"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Filter, LogIn, CheckCircle, Loader2 } from "lucide-react";
import { User, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Zap, Package, Gem, Calendar } from "lucide-react";
import { apiGet, apiPost } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { Spinner } from "@/components/ui/spinner";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DISABILITY_TYPES } from "@/lib/constants";

interface RegionNeed {
  region: string;
  deviceType: string;
  count: number;
  requests: Array<{
    id?: string;
    _id?: string;
    aidName: string;
    priority: string;
    status: string;
    createdAt: string;
    location?: string;
    disabilityType?: string;
  }>;
}

interface NeedsData {
  needs: Record<string, Record<string, RegionNeed>>;
  total: number;
}

// All 28 States and 8 Union Territories of India (alphabetically sorted)
const INDIAN_STATES_AND_UTS = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

// Comprehensive list of assistive devices
const DEVICE_TYPES = [
  "Wheelchair",
  "Electric Wheelchair",
  "Manual Wheelchair",
  "Crutches",
  "Walking Stick",
  "Walking Frame",
  "Orthopaedic Walker",
  "Mobility Scooter",
  "Prosthetic Limb",
  "Orthotic Devices",
  "Hearing Aid",
  "Smart Hearing Aid",
  "Cochlear Implant",
  "Visual Aid",
  "Smart Walking Stick",
  "White Cane",
  "Braille Display",
  "Screen Reader",
  "Communication Board",
  "AAC Device",
  "Speech Generating Device",
  "Voice Amplifier",
  "Assistive Technology for Learning",
  "Adaptive Computer Equipment",
  "Mobility Aids",
  "Transfer Equipment",
  "Bathroom Safety Equipment",
  "Bed Assist Rails",
  "Lift Chair",
  "Stair Lift",
  "Ramp",
  "Grab Bars",
  "Other",
];

const oneTimePlans = [
  {
    id: "basic",
    name: "Basic",
    price: 499,
    profiles: 10,
    icon: Zap,
    description: "Perfect for getting started",
    features: ["View 10 verified profiles", "24-hour access", "Basic filters"],
  },
  {
    id: "standard",
    name: "Standard",
    price: 999,
    profiles: 25,
    icon: Package,
    description: "Most popular choice",
    features: [
      "View 25 verified profiles",
      "7-day access",
      "Advanced filters",
      "Export data",
    ],
  },
  {
    id: "impact",
    name: "Impact",
    price: 1999,
    profiles: 50,
    icon: Gem,
    description: "Maximum reach",
    features: [
      "View 50 verified profiles",
      "30-day access",
      "All features",
      "Direct contact",
    ],
  },
];

const subscriptionPlans = [
  {
    id: "monthly",
    period: "Monthly",
    price: 4999,
    duration: "30 days",
    profiles: "Unlimited",
  },
  {
    id: "quarterly",
    period: "Quarterly",
    price: 12000,
    duration: "90 days",
    profiles: "Unlimited",
  },
  {
    id: "annual",
    period: "Annual",
    price: 45000,
    duration: "365 days",
    profiles: "Unlimited",
  },
];

interface VerifiedPWD {
  _id: string;
  name: string;
  location: string;
  disabilityType?: string;
  udidVerified: boolean;
  aid?: string;
  requestId?: string;
}

// Helper function to extract state from location string
// Handles formats like "City, State" or just "State"
const extractState = (location: string | undefined | null): string => {
  if (!location) return "Unknown";

  // If location contains a comma, extract the part after the comma (state)
  if (location.includes(",")) {
    const parts = location.split(",");
    return parts[parts.length - 1].trim();
  }

  // If no comma, assume it's already just the state
  return location.trim();
};

export default function ExploreNeeds() {
  const { toast } = useToast();
  const router = useRouter();
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [selectedDisability, setSelectedDisability] = useState("All");
  const [selectedAid, setSelectedAid] = useState("All");
  const [needsData, setNeedsData] = useState<NeedsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedNeed, setSelectedNeed] = useState<any>(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [paymentStage, setPaymentStage] = useState<
    "plans" | "gateway" | "success"
  >("plans");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedPlanType, setSelectedPlanType] = useState<
    "oneTime" | "subscription"
  >("oneTime");
  const [accessGranted, setAccessGranted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [verifiedPWDs, setVerifiedPWDs] = useState<VerifiedPWD[]>([]);
  const [supportingPWD, setSupportingPWD] = useState<string | null>(null);

  // New modal states for enhanced payment flow
  const [showEthicalModal, setShowEthicalModal] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [agreedEthical, setAgreedEthical] = useState(false);
  const [agreedConsent, setAgreedConsent] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<any>(null);

  useEffect(() => {
    const currentUser = getUser();
    setUser(currentUser);
    fetchNeeds();

    // Refresh needs data periodically to ensure verified requests are removed
    // Poll every 30 seconds to catch updates when PWD confirms delivery
    const intervalId = setInterval(() => {
      fetchNeeds();
    }, 30000); // 30 seconds

    // Also refresh when page comes into focus (user switches back to tab)
    const handleFocus = () => {
      fetchNeeds();
    };
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const fetchNeeds = async () => {
    setLoading(true);
    try {
      const response = await apiGet<{
        success: boolean;
        data: NeedsData;
      }>("/donor/explore");
      if (response.success && response.data) {
        setNeedsData(response.data);
      }
    } catch (error: any) {
      toast({
        title: "Failed to fetch needs",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Flatten needs data for display
  // Backend returns requests grouped by region and deviceType
  // Each group contains both Pending and Approved requests
  // Frontend filters to show ONLY Approved requests to donors
  const flattenedNeeds = needsData
    ? Object.entries(needsData.needs).flatMap(
        ([region, deviceTypes]) =>
          Object.entries(deviceTypes)
            .map(([deviceType, data]) => {
              // Validate data structure
              if (!data || !data.requests || !Array.isArray(data.requests)) {
                return null;
              }

              // Filter requests array to only include Approved status
              // Donors should NOT see Pending, Verified, Delivered, or InProgress requests
              // Backend already excludes Verified/Delivered/InProgress, but we filter for Approved only
              // This ensures verified requests are never shown in Explore Needs
              const approvedRequests = data.requests.filter((req) => {
                // Check if request exists and has Approved status
                // Verified requests are excluded by backend, but we explicitly check here too
                return (
                  req && typeof req === "object" && req.status === "Approved"
                );
              });

              // Skip this entry if no approved requests found
              if (!approvedRequests || approvedRequests.length === 0) {
                return null;
              }

              // Extract disability type from first approved request
              const firstApprovedRequest = approvedRequests[0];
              const disabilityType =
                firstApprovedRequest?.disabilityType || "Various";

              // Return flattened need entry with only approved request data
              return {
                state: extractState(region), // State name only (no city)
                originalRegion: region, // Original region for backend lookups
                device: deviceType, // Device type requested
                deviceType: deviceType, // Keep for backward compatibility
                disability: disabilityType, // Disability type from approved request
                count: approvedRequests.length, // Count of approved requests (not total)
              };
            })
            .filter((item) => item !== null) // Remove null entries (no approved requests)
      )
    : [];

  // Use comprehensive lists for filters - show all options regardless of API data
  // This allows users to filter by any state/UT, device type, or disability category
  const regions = ["All", ...INDIAN_STATES_AND_UTS];
  const disabilities = ["All", ...DISABILITY_TYPES];
  const deviceTypes = ["All", ...DEVICE_TYPES];

  const filteredNeeds = flattenedNeeds.filter((need) => {
    const stateMatch =
      selectedRegion === "All" || need.state === selectedRegion;
    const deviceMatch = selectedAid === "All" || need.device === selectedAid;
    const disabilityMatch =
      selectedDisability === "All" || need.disability === selectedDisability;
    return stateMatch && deviceMatch && disabilityMatch;
  });

  const handleHelpNow = (need: any) => {
    setSelectedNeed(need);
    setSelectedBeneficiary(need);
    // Reset all agreement states
    setAgreedEthical(false);
    setAgreedConsent(false);
    setSelectedPlan(null);
    setSelectedPlanType("oneTime");
    setSelectedMethod(null);
    setIsPaying(false);
    // Show Ethical Use Declaration modal first
    setShowEthicalModal(true);
  };

  const handleSelectPlan = (
    planId: string,
    planType: "oneTime" | "subscription"
  ) => {
    setSelectedPlan(planId);
    setSelectedPlanType(planType);
  };

  const handleProceedToPay = async () => {
    if (!selectedMethod || !selectedPlan) return;

    setIsPaying(true);

    try {
      // Simulate payment processing delay (2 seconds)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Find plan details for amount
      let planDetails: { id: string; name: string; price: number } | null =
        null;

      if (selectedPlanType === "oneTime") {
        planDetails = oneTimePlans.find((p) => p.id === selectedPlan) || null;
      } else {
        const subPlan = subscriptionPlans.find((p) => p.id === selectedPlan);
        if (subPlan) {
          planDetails = {
            id: subPlan.id,
            name: subPlan.period,
            price: subPlan.price,
          };
        }
      }

      if (!planDetails) {
        throw new Error("Plan not found");
      }

      // Process mock payment with plan and payment method
      const response = await apiPost<{
        success: boolean;
        message: string;
        data: any;
      }>("/donor/purchase", {
        planId: planDetails.id,
        plan: planDetails.name,
        amount: planDetails.price,
        paymentMethod: selectedMethod,
      });

      if (response.success && selectedBeneficiary) {
        // Support the selected beneficiary
        try {
          // Find request ID from the selected need
          // Use originalRegion for backend lookup since that's the key in needsData
          // IMPORTANT: Only use Approved requests for support
          let requestId: string | undefined;
          if (needsData?.needs) {
            const originalRegion = selectedBeneficiary.originalRegion;
            const deviceType =
              selectedBeneficiary.deviceType || selectedBeneficiary.device;
            if (originalRegion && deviceType) {
              const regionData = needsData.needs[originalRegion];
              if (regionData) {
                const deviceData = regionData[deviceType];
                if (
                  deviceData?.requests &&
                  Array.isArray(deviceData.requests)
                ) {
                  // Find first Approved request (donors should only support approved requests)
                  const approvedRequest = deviceData.requests.find(
                    (req) => req && req.status === "Approved"
                  );
                  if (approvedRequest) {
                    requestId = approvedRequest.id || approvedRequest._id;
                  }
                }
              }
            }
          }

          if (requestId) {
            await apiPost<{
              success: boolean;
              message: string;
              data: any;
            }>("/donor/support", {
              requestId: requestId,
              amount: 0,
              notes: `Supporting ${
                selectedBeneficiary.state ||
                extractState(selectedBeneficiary.originalRegion)
              } - ${
                selectedBeneficiary.device || selectedBeneficiary.deviceType
              }`,
            });
          }
        } catch (supportError) {
          console.error("Error supporting beneficiary:", supportError);
        }

        // Show success toast
        toast({
          title: "Payment Successful!",
          description: "Your support has been initiated successfully.",
        });

        // Close payment modal
        setIsPaying(false);
        setShowPaymentModal(false);

        // Reset all states
        setAgreedEthical(false);
        setAgreedConsent(false);
        setSelectedPlan(null);
        setSelectedPlanType("oneTime");
        setSelectedMethod(null);
        setSelectedBeneficiary(null);

        // Redirect to beneficiaries page
        router.push("/dashboard/donor/beneficiaries");
      } else {
        throw new Error("Payment failed");
      }
    } catch (error: any) {
      setIsPaying(false);
      toast({
        title: "Payment Failed",
        description:
          error.message || "Failed to process payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleClosePlanModal = () => {
    setShowPlanModal(false);
    setSelectedPlan(null);
    setSelectedPlanType("oneTime");
  };

  const handleCloseEthicalModal = () => {
    setShowEthicalModal(false);
    setAgreedEthical(false);
    setSelectedNeed(null);
    setSelectedBeneficiary(null);
  };

  const handleCloseConsentModal = () => {
    setShowConsentModal(false);
    setAgreedConsent(false);
    // If declined, also reset ethical agreement
    if (!agreedConsent) {
      setAgreedEthical(false);
      setSelectedNeed(null);
      setSelectedBeneficiary(null);
    }
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedMethod(null);
    setIsPaying(false);
  };

  const fetchVerifiedPWDs = async () => {
    try {
      // Fetch verified PwDs
      const response = await apiGet<{
        success: boolean;
        data: { beneficiaries: VerifiedPWD[] };
      }>("/donor/beneficiaries");

      if (response.success && response.data.beneficiaries) {
        // Fetch explore data once to match requests
        let exploreData: NeedsData | null = null;
        try {
          const exploreResponse = await apiGet<{
            success: boolean;
            data: NeedsData;
          }>("/donor/explore");
          if (exploreResponse.success) {
            exploreData = exploreResponse.data;
          }
        } catch (err) {
          console.error("Error fetching explore data:", err);
        }

        // Match with requests to get aid information
        const pwdWithAids = response.data.beneficiaries.map((pwd) => {
          let requestId: string | undefined;
          let aid: string | undefined;

          if (exploreData?.needs) {
            Object.values(exploreData.needs).forEach((regionData: any) => {
              Object.values(regionData).forEach((deviceData: any) => {
                if (deviceData.requests) {
                  deviceData.requests.forEach((req: any) => {
                    // Match by PwD ID or location
                    if (
                      req.requestedBy?._id === pwd._id ||
                      req.location === pwd.location
                    ) {
                      requestId = req.id || req._id;
                      aid = req.aidName || deviceData.deviceType;
                    }
                  });
                }
              });
            });
          }

          return { ...pwd, requestId, aid: aid || "Not specified" };
        });

        setVerifiedPWDs(pwdWithAids);
      }
    } catch (error: any) {
      console.error("Failed to fetch verified PwDs:", error);
      toast({
        title: "Failed to load verified PwDs",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleSupportPWD = async (pwd: VerifiedPWD) => {
    if (!pwd.requestId) {
      toast({
        title: "No Request Available",
        description: "This PwD doesn't have an active request yet.",
        variant: "destructive",
      });
      return;
    }

    setSupportingPWD(pwd._id);
    try {
      const response = await apiPost<{
        success: boolean;
        message: string;
        data: any;
      }>("/donor/support", {
        requestId: pwd.requestId,
        amount: 0,
        notes: `Supporting ${pwd.name}`,
      });

      if (response.success) {
        toast({
          title: "Support Initiated!",
          description: `You are now supporting ${pwd.name}. They've been added to your beneficiaries list.`,
        });
        // Remove from verified list
        setVerifiedPWDs(verifiedPWDs.filter((p) => p._id !== pwd._id));
      }
    } catch (error: any) {
      toast({
        title: "Support Failed",
        description:
          error.message || "Failed to initiate support. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSupportingPWD(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <DashboardSidebar role="donor" />
        <div className="flex-1 overflow-auto flex items-center justify-center">
          <Spinner className="h-8 w-8" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar role="donor" />
      <div className="flex-1 overflow-auto">
        <DashboardHeader userName={user?.name || "Explore Needs"} />

        <main className="p-8 space-y-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Explore PwD Needs by Region
              </h1>
              <p className="text-muted-foreground">
                View aggregated data on assistance needs and support verified
                beneficiaries
              </p>
            </div>
            
          </div>

          {/* Filters */}
          <div className="bg-card border rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Filter Insights</h3>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-semibold block mb-2">
                  Region
                </label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full border rounded px-3 py-2 text-sm"
                >
                  {regions.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground mt-1">
                  {regions.length - 1} states and union territories
                </p>
              </div>

              <div>
                <label className="text-sm font-semibold block mb-2">
                  Disability Type
                </label>
                <select
                  value={selectedDisability}
                  onChange={(e) => setSelectedDisability(e.target.value)}
                  className="w-full border rounded px-3 py-2 text-sm"
                >
                  {disabilities.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground mt-1">
                  RPwD Act categories
                </p>
              </div>

              <div>
                <label className="text-sm font-semibold block mb-2">
                  Device Type
                </label>
                <select
                  value={selectedAid}
                  onChange={(e) => setSelectedAid(e.target.value)}
                  className="w-full border rounded px-3 py-2 text-sm"
                >
                  {deviceTypes.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground mt-1">
                  {deviceTypes.length - 1} assistive devices
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNeeds.map((need, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 space-y-4">
                  <div className="bg-primary/10 rounded-lg p-4">
                    <p className="text-3xl font-bold text-primary">
                      {need.count}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      PwDs in need
                    </p>
                  </div>
                  <div className="space-y-2">
                    {/* Field order: 1) State, 2) Device, 3) Disability Type */}
                    <div>
                      <p className="text-xs text-muted-foreground">State</p>
                      <p className="font-semibold text-lg">{need.state}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Device</p>
                      <p className="text-sm font-medium">{need.device}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Disability Type
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {need.disability}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleHelpNow(need)}
                    className="w-full bg-accent hover:bg-accent/90"
                  >
                    Help Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredNeeds.length === 0 && !loading && (
            <Card>
              <CardContent className="pt-12 text-center">
                <p className="text-muted-foreground">
                  No needs found matching your criteria
                </p>
              </CardContent>
            </Card>
          )}

          {accessGranted && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Verified Beneficiaries
                </h2>
                <p className="text-muted-foreground">
                  Support PwDs directly through your active access plan
                </p>
              </div>

              {verifiedPWDs.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {verifiedPWDs.map((pwd) => {
                    const initials = pwd.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .substring(0, 2);
                    return (
                      <Card
                        key={pwd._id}
                        className="hover:shadow-lg transition-shadow"
                      >
                        <CardContent className="pt-6 space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="text-2xl font-bold text-primary">
                                {initials}
                              </span>
                            </div>
                            {pwd.udidVerified && (
                              <div className="flex items-center gap-1 text-primary">
                                <CheckCircle className="h-5 w-5" />
                                <span className="text-xs font-semibold">
                                  Verified
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="space-y-2">
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Name
                              </p>
                              <p className="font-semibold">{pwd.name}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Region
                              </p>
                              <p className="font-semibold">
                                {extractState(pwd.location)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Aid Needed
                              </p>
                              <p className="font-semibold">
                                {pwd.aid || "Not specified"}
                              </p>
                            </div>
                            {pwd.disabilityType && (
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  Disability Type
                                </p>
                                <p className="font-semibold">
                                  {pwd.disabilityType}
                                </p>
                              </div>
                            )}
                          </div>

                          <Button
                            onClick={() => handleSupportPWD(pwd)}
                            className="w-full bg-[#FF5E4B] hover:bg-[#FF5E4B]/90 text-white"
                            disabled={
                              supportingPWD === pwd._id || !pwd.requestId
                            }
                          >
                            {supportingPWD === pwd._id ? (
                              <>
                                <Spinner className="mr-2 h-4 w-4" />
                                Supporting...
                              </>
                            ) : (
                              "Support Now"
                            )}
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Card>
                  <CardContent className="pt-12 text-center">
                    <p className="text-muted-foreground">
                      No verified PwDs available at the moment.
                    </p>
                    <Link href="/dashboard/donor/beneficiaries">
                      <Button className="mt-4">View All Beneficiaries</Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </main>
      </div>

      {/* CSR Ethical Use Declaration Modal */}
      <Dialog open={showEthicalModal} onOpenChange={handleCloseEthicalModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>CSR Ethical Use Declaration</DialogTitle>
            <DialogDescription>
              Please review and accept the data privacy and ethical use
              agreement below.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-green-50 rounded-lg space-y-3 mt-4">
            <h3 className="font-semibold text-lg text-[#006E40]">
              Data Privacy & Ethical Use Agreement
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
              <li>
                Use this data solely for genuine social and CSR support purposes
              </li>
              <li>
                Comply with SakshamSetu's privacy and data protection policy
              </li>
              <li>
                Do not share beneficiary personal information with third parties
              </li>
              <li>Maintain confidentiality of all beneficiary data accessed</li>
              <li>Report any data misuse or unauthorized access immediately</li>
            </ul>
          </div>
          <div className="mt-4 flex items-center space-x-2">
            <input
              type="checkbox"
              id="ethicalAgree"
              checked={agreedEthical}
              onChange={(e) => setAgreedEthical(e.target.checked)}
              className="h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-[#00A15D]"
            />
            <label
              htmlFor="ethicalAgree"
              className="text-sm text-gray-700 cursor-pointer"
            >
              I agree to the above terms and conditions
            </label>
          </div>
          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={handleCloseEthicalModal}>
              Back
            </Button>
            <Button
              disabled={!agreedEthical}
              onClick={() => {
                setShowEthicalModal(false);
                setShowConsentModal(true);
              }}
              className="bg-[#00A15D] text-white hover:bg-[#00A15D]/90 disabled:opacity-50"
            >
              Continue to Consent
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Data Sharing Consent Modal */}
      <Dialog open={showConsentModal} onOpenChange={handleCloseConsentModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Data Sharing Consent</DialogTitle>
            <DialogDescription>
              Please review how your data will be shared with beneficiaries.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-blue-50 p-4 rounded-lg space-y-3 mt-4">
            <h3 className="font-medium text-[#006E40]">
              Your Data Will Be Shared
            </h3>
            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-2">
              <li>
                Your contact details will be shared with verified PwDs in your
                region
              </li>
              <li>Your organization details for CSR coordination</li>
              <li>Only verified device and requirement info is shared</li>
              <li>All transfers comply with data protection laws</li>
            </ul>
          </div>
          <div className="bg-yellow-50 mt-3 p-3 rounded-lg text-sm text-gray-800">
            <strong>Privacy Assurance:</strong> Your personal data will be
            shared only with the beneficiaries you choose to support.
          </div>
          <div className="mt-4 flex items-center space-x-2">
            <input
              type="checkbox"
              id="consentAgree"
              checked={agreedConsent}
              onChange={(e) => setAgreedConsent(e.target.checked)}
              className="h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-[#00A15D]"
            />
            <label
              htmlFor="consentAgree"
              className="text-sm text-gray-700 cursor-pointer"
            >
              I consent to data sharing as described above
            </label>
          </div>
          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={handleCloseConsentModal}>
              Decline
            </Button>
            <Button
              disabled={!agreedConsent}
              onClick={() => {
                setShowConsentModal(false);
                setShowPlanModal(true);
              }}
              className="bg-[#00A15D] text-white hover:bg-[#00A15D]/90 disabled:opacity-50"
            >
              Accept & Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Method Selection Modal */}
      <Dialog open={showPaymentModal} onOpenChange={handleClosePaymentModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Select Payment Method</DialogTitle>
            <DialogDescription>
              Choose your preferred payment method to proceed
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {["Card", "Net Banking", "UPI"].map((method) => (
              <div
                key={method}
                className={`flex items-center justify-between border rounded-lg p-3 cursor-pointer transition-all ${
                  selectedMethod === method
                    ? "border-[#00A15D] ring-2 ring-[#00A15D]/20 bg-green-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onClick={() => setSelectedMethod(method)}
              >
                <span className="font-medium">{method}</span>
                {selectedMethod === method && (
                  <CheckCircle className="text-[#00A15D]" size={20} />
                )}
              </div>
            ))}
          </div>
          {isPaying ? (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Loader2 className="animate-spin h-5 w-5 text-[#00A15D]" />
              <span>Processing...</span>
            </div>
          ) : (
            <Button
              disabled={!selectedMethod || isPaying}
              onClick={handleProceedToPay}
              className="mt-6 w-full bg-[#FF5E4B] hover:bg-[#FF5E4B]/90 text-white disabled:opacity-50"
            >
              Pay Now
            </Button>
          )}
        </DialogContent>
      </Dialog>

      {/* Subscription Plan Selection Modal */}
      <Dialog open={showPlanModal} onOpenChange={handleClosePlanModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Select a Subscription Plan</DialogTitle>
            <DialogDescription>
              Choose your access level before proceeding to payment.
            </DialogDescription>
          </DialogHeader>

          <Tabs 
            defaultValue="oneTime" 
            value={selectedPlanType === "oneTime" ? "oneTime" : "subscription"}
            onValueChange={(value) => {
              setSelectedPlanType(value as "oneTime" | "subscription")
              setSelectedPlan(null)
            }}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="oneTime">One-Time Access</TabsTrigger>
              <TabsTrigger value="subscription">Subscription</TabsTrigger>
            </TabsList>

            <TabsContent value="oneTime" className="space-y-4">
              <div className="grid gap-4">
                {oneTimePlans.map((plan) => {
                  const Icon = plan.icon
                  const isSelected = selectedPlan === plan.id && selectedPlanType === "oneTime"
                  return (
                    <Card
                      key={plan.id}
                      onClick={() => handleSelectPlan(plan.id, "oneTime")}
                      className={`cursor-pointer border transition-all ${
                        isSelected ? "border-[#00A15D] ring-2 ring-[#00A15D]/20" : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <Icon className="h-5 w-5 text-primary" />
                          <CardTitle className="text-2xl font-bold">₹{plan.price.toLocaleString()}</CardTitle>
                        </div>
                        <CardDescription>{plan.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="subscription" className="space-y-4">
              <div className="grid gap-4">
                {subscriptionPlans.map((plan) => {
                  const isSelected = selectedPlan === plan.id && selectedPlanType === "subscription"
                  const priceDisplay = plan.period === "Monthly" 
                    ? `₹${plan.price.toLocaleString()} / month`
                    : plan.period === "Quarterly"
                    ? `₹${plan.price.toLocaleString()} / quarter`
                    : `₹${plan.price.toLocaleString()} / year`
                  return (
                    <Card
                      key={plan.id}
                      onClick={() => handleSelectPlan(plan.id, "subscription")}
                      className={`cursor-pointer border transition-all ${
                        isSelected ? "border-[#00A15D] ring-2 ring-[#00A15D]/20" : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <Calendar className="h-5 w-5 text-primary" />
                          <CardTitle className="text-xl font-bold">{priceDisplay}</CardTitle>
                        </div>
                        <CardDescription>Unlimited verified access + impact reports</CardDescription>
                      </CardHeader>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>
          </Tabs>

          <Button
            disabled={!selectedPlan}
            onClick={() => {
              setShowPlanModal(false)
              setShowPaymentModal(true)
            }}
            className="w-full mt-6 bg-[#FF5E4B] hover:bg-[#FF5E4B]/90 text-white disabled:opacity-50"
          >
            Proceed to Payment
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

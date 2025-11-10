import type { Scheme } from "@/types"

export const NAVIGATION_ITEMS = {
  pwd: [
    { label: "Dashboard", href: "/dashboard/pwd" },
    { label: "My Profile", href: "/dashboard/pwd/profile" },
    { label: "Schemes", href: "/dashboard/pwd/schemes" },
    // { label: "Knowledge Hub", href: "/knowledge-hub" },
    { label: "Request Assistance", href: "/dashboard/pwd/requests" },
    { label: "My Support Status", href: "/dashboard/pwd/status" },
    { label: "Privacy And Data", href: "/dashboard/pwd/privacy" },
    { label: "Support Chat", href: "/dashboard/pwd/support" },
  ],
  donor: [
    { label: "Dashboard", href: "/dashboard/donor" },
    { label: "Explore Needs", href: "/dashboard/donor/explore" },
    { label: "Beneficiaries", href: "/dashboard/donor/beneficiaries" },
    { label: "Support Status", href: "/dashboard/donor/status" },
    { label: "Impact Tracker", href: "/dashboard/donor/impact" },
    { label: "My Plans & Payments", href: "/dashboard/donor/plans" },
    { label: "Help & Support", href: "/dashboard/donor/support" },
    { label: "Privacy & Policy", href: "/dashboard/donor/privacy" },
  ],
  supplier: [
    { label: "My Products", href: "/dashboard/supplier" },
    { label: "Devices", href: "/dashboard/supplier/devices" },
    { label: "Orders", href: "/dashboard/supplier/orders" },
  ],
  admin: [
    { label: "Dashboard", href: "/dashboard/admin" },
    { label: "Analytics", href: "/dashboard/admin/analytics" },
    { label: "User Management", href: "/dashboard/admin/users" },
    { label: "Request Monitoring", href: "/dashboard/admin/requests" },
    { label: "Verifications", href: "/dashboard/admin/verifications" },
    { label: "Payments & Transactions", href: "/dashboard/admin/payments" },
    { label: "Privacy & Compliance", href: "/dashboard/admin/compliance" },
    { label: "Notifications", href: "/dashboard/admin/notifications" },
  ],
}

export const ROLES = [
  { value: "pwd", label: "Person with Disability" },
  { value: "donor", label: "CSR Donor" },
  // { value: "supplier", label: "Assistive Device Supplier" },
  { value: "admin", label: "Administrator" },
]

export const KNOWLEDGE_HUB_ARTICLES: Array<{
  id: string
  title: string
  description: string
  category: string
  icon: string
}> = []

// Disability types as per RPwD Act of India
// This list is used in both registration form and donor dashboard filters
export const DISABILITY_TYPES = [
  "Visual Impairment",
  "Blindness",
  "Low Vision",
  "Hearing Impairment",
  "Deaf",
  "Hard of Hearing",
  "Locomotor Disability",
  "Intellectual Disability",
  "Mental Illness",
  "Autism Spectrum Disorder",
  "Cerebral Palsy",
  "Chronic Neurological Conditions",
  "Specific Learning Disabilities",
  "Multiple Disabilities",
  "Speech and Language Disability",
  "Thalassemia",
  "Hemophilia",
  "Sickle Cell Disease",
  "Acid Attack Victim",
  "Dwarfism",
  "Muscular Dystrophy",
  "Leprosy Cured",
  "Parkinson's Disease",
  "Multiple Sclerosis",
  "Other",
]

// Government Schemes & Programs for Persons with Disabilities (PwDs)
export const SCHEMES_DATA: Scheme[] = [
  {
    id: 1,
    name: "ADIP Scheme (Assistance to Disabled Persons for Purchase/Fitting of Aids and Appliances)",
    provider: "Government of India | Implemented by ALIMCO under DEPwD",
    description:
      "Provides free or subsidized assistive devices such as wheelchairs, hearing aids, and prosthetics to eligible PwDs.",
    benefits: "Free or subsidized assistive devices",
    eligibility: "PwDs with 40% disability and annual family income below ₹3,00,000",
    documents: ["Disability Certificate", "Income Proof", "Aadhar Card"],
    link: "https://disabilityaffairs.gov.in/content/page/adip-scheme.php",
    status: "Eligible",
    amount: "Subsidized Devices",
  },
  {
    id: 2,
    name: "NHFDC Schemes (National Handicapped Finance and Development Corporation)",
    provider: "NHFDC | Ministry of Social Justice & Empowerment",
    description:
      "Provides financial assistance, loans, and skill development programs to PwDs for self-employment and education.",
    benefits: "Low-interest loans, education loans, skill training",
    eligibility: "PwDs aged 18–55 with valid disability certificate",
    documents: ["Disability Certificate", "ID Proof", "Income Certificate"],
    link: "https://www.nhfdc.nic.in/schemes",
    status: "Open",
    amount: "As per scheme",
  },
  {
    id: 3,
    name: "Accessible India Campaign (Sugamya Bharat Abhiyan)",
    provider: "Department of Empowerment of Persons with Disabilities (DEPwD)",
    description:
      "A national initiative to make public spaces, transport, and digital services accessible for all persons with disabilities.",
    benefits: "Accessibility improvements in buildings, transport, and ICT",
    eligibility: "All citizens; especially PwDs",
    documents: ["N/A"],
    link: "https://disabilityaffairs.gov.in/content/page/accessible-india-campaign---sugamya-bharat-abhiyan.php",
    status: "In Progress",
    amount: "Nationwide Initiative",
  },
  {
    id: 4,
    name: "Skill Development and Vocational Training for PwDs",
    provider: "DEPwD in collaboration with Skill India & NSDC",
    description:
      "Provides industry-relevant training and employment opportunities for PwDs in various fields like IT, tailoring, hospitality, etc.",
    benefits: "Free training + job placement assistance",
    eligibility: "All PwDs aged 18–45 years",
    documents: ["Disability Certificate", "Educational Proof", "ID Proof"],
    link: "https://disabilityaffairs.gov.in/content/page/skill-development-of-persons-with-disabilities.php",
    status: "Ongoing",
    amount: "Free Training",
  },
  {
    id: 5,
    name: "Deendayal Disabled Rehabilitation Scheme (DDRS)",
    provider: "Ministry of Social Justice & Empowerment",
    description:
      "Provides grants to NGOs for running rehabilitation centers, schools, and care homes for PwDs.",
    benefits: "Financial support for NGOs providing rehabilitation services",
    eligibility: "Registered NGOs working for PwDs",
    documents: ["NGO Registration", "Project Proposal", "Financial Reports"],
    link: "https://disabilityaffairs.gov.in/content/page/deendayal-disabled-rehabilitation-scheme.php",
    status: "Eligible",
    amount: "Grant-in-aid",
  },
  {
    id: 6,
    name: "Scholarship Schemes for Students with Disabilities",
    provider: "Department of Empowerment of Persons with Disabilities (DEPwD)",
    description:
      "Financial assistance for PwDs pursuing education at pre-matric, post-matric, and higher education levels.",
    benefits: "Scholarships for Class 9 to PG level",
    eligibility: "Students with 40% disability or more",
    documents: ["Disability Certificate", "Marksheet", "Income Certificate"],
    link: "https://disabilityaffairs.gov.in/content/page/scholarship-schemes-under-national-fund.php",
    status: "Open",
    amount: "₹2,000–₹5,000/month (approx.)",
  },
  {
    id: 7,
    name: "Unique Disability ID (UDID) Project",
    provider: "Government of India | DEPwD",
    description:
      "Creates a national database of PwDs and issues a Unique Disability ID card for access to various benefits and services.",
    benefits: "Single ID card for all disability-related benefits",
    eligibility: "All PwDs",
    documents: ["Disability Certificate", "Aadhar Card"],
    link: "https://www.swavlambancard.gov.in/",
    status: "Active",
    amount: "Free Registration",
  },
  {
    id: 8,
    name: "National Action Plan for Skill Development of PwDs (NAP-PwD)",
    provider: "DEPwD | Ministry of Social Justice & Empowerment",
    description:
      "Provides market-linked skills to PwDs to promote inclusive employment. Goal: train 5 lakh PwDs in 5 years.",
    benefits: "Free skill training and placement assistance",
    eligibility: "All PwDs aged 18–50 years",
    documents: ["Disability Certificate", "ID Proof", "Educational Proof"],
    link: "https://disabilityaffairs.gov.in/content/page/national-action-plan-for-skill-development-of-persons-with-disabilities.php",
    status: "In Progress",
    amount: "Free Training",
  },
  {
    id: 9,
    name: "Rights of Persons with Disabilities Act, 2016 (RPwD Act)",
    provider: "Government of India | Legislative Framework",
    description:
      "A legal framework protecting rights and ensuring equal opportunity, covering 21 recognized disabilities.",
    benefits: "Reservation in jobs & education, protection from discrimination",
    eligibility: "All persons with disabilities",
    documents: ["Disability Certificate"],
    link: "https://disabilityaffairs.gov.in/content/page/rpwd-act-2016.php",
    status: "Implemented",
    amount: "Legal Rights",
  },
]

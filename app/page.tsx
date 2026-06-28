"use client";

import Image from "next/image";
import { FormEvent, useMemo, useState } from "react";

type Role =
  | "Super Admin"
  | "COO"
  | "CSMO"
  | "Customer Care"
  | "Product Manager"
  | "Media Team"
  | "Branch Manager"
  | "Realtor"
  | "Investor"
  | "Front Desk Officer";

type AppVersion = "web" | "mobile";
type NavKey =
  | "dashboard"
  | "sales"
  | "operations"
  | "realtors"
  | "learning"
  | "customerCare"
  | "products"
  | "frontDesk"
  | "media"
  | "reports"
  | "ai"
  | "administration"
  | "audit";

type Tone = "red" | "green" | "amber" | "blue" | "purple" | "slate" | "dark";
type LeadStatus = "New Lead" | "Contacted" | "Follow-Up" | "Inspection Scheduled" | "Negotiation" | "Closed Won" | "Closed Lost";
type LeadScore = "Cold" | "Warm" | "Hot";
type ModalType = null | "lead" | "content" | "visitor" | "property" | "user" | "learning";

type LeadRecord = {
  id: number;
  name: string;
  phone: string;
  email: string;
  source: string;
  assignedRealtor: string;
  budget: string;
  propertyType: string;
  state: string;
  city: string;
  area: string;
  purpose: string;
  timeline: string;
  score: LeadScore;
  status: LeadStatus;
  method: string;
  lastContact: string;
  nextFollowUp: string;
  objection: string;
  notes: string;
};

type ContentRecord = {
  id: number;
  title: string;
  format: "Video" | "Flyer/Image" | "Blog Article";
  platforms: string[];
  campaign: string;
  publishAt: string;
  status: "Draft" | "Review" | "Approval" | "Scheduled" | "Published";
  reach: number;
  engagement: number;
  leads: number;
};

type PropertyRecord = {
  id: number;
  title: string;
  type: string;
  location: string;
  price: string;
  status: "Available" | "Reserved" | "Sold" | "Under Review";
  workflow: "Submission" | "Review" | "Approval" | "Publishing" | "Revision Requested" | "Rejected";
  media: string;
  documents: string;
  guide: string;
};

type VisitorRecord = {
  id: number;
  name: string;
  phone: string;
  email: string;
  purpose: string;
  department: string;
  staff: string;
  pass: string;
  checkIn: string;
  checkOut: string;
  status: "Checked In" | "Waiting" | "Checked Out";
};

const roles: Role[] = ["Super Admin", "COO", "CSMO", "Customer Care", "Product Manager", "Media Team", "Branch Manager", "Realtor", "Investor", "Front Desk Officer"];
const leadStatuses: LeadStatus[] = ["New Lead", "Contacted", "Follow-Up", "Inspection Scheduled", "Negotiation", "Closed Won", "Closed Lost"];
const budgetRanges = ["Under ₦5M", "₦5M – ₦10M", "₦10M – ₦20M", "₦20M – ₦50M", "₦50M+"];
const propertyTypes = ["Land", "Residential", "Commercial", "Shortlet Investment", "Mixed Use"];
const purposes = ["Investment", "Residential", "Commercial", "Resale", "Rental Income"];
const timelines = ["Immediate", "1–3 Months", "3–6 Months", "6+ Months"];
const leadScores: LeadScore[] = ["Cold", "Warm", "Hot"];
const objectionCategories = ["Lack of Funds", "Wants More Time", "Location Concern", "Needs Spouse Approval", "Comparing Alternatives", "Trust Issues", "Payment Plan Concern", "Documentation Concern", "Market Conditions", "Other"];
const followUpMethods = ["Phone Call", "WhatsApp", "Email", "SMS", "Physical Meeting"];
const socialPlatforms = ["Facebook", "Instagram", "TikTok", "YouTube", "LinkedIn", "X (Twitter)"];

const navItems: { key: NavKey; label: string; icon: string; subtitle: string; allowed: Role[] }[] = [
  { key: "dashboard", label: "Executive Dashboard", icon: "⌘", subtitle: "Live KPIs", allowed: roles },
  { key: "sales", label: "CSMO Sales", icon: "◎", subtitle: "Leads, objections, follow-ups", allowed: ["Super Admin", "COO", "CSMO", "Customer Care", "Branch Manager", "Realtor"] },
  { key: "operations", label: "COO Operations", icon: "◉", subtitle: "Clients, commissions, investments", allowed: ["Super Admin", "COO", "Customer Care", "Investor"] },
  { key: "realtors", label: "REPROS Realtors", icon: "♜", subtitle: "Branches, ranking, recruitment", allowed: ["Super Admin", "COO", "CSMO", "Branch Manager", "Realtor"] },
  { key: "learning", label: "Learning Hub", icon: "◫", subtitle: "Resources and certificates", allowed: ["Super Admin", "COO", "CSMO", "Branch Manager", "Realtor"] },
  { key: "customerCare", label: "Customer Care", icon: "✦", subtitle: "Reminders and VIP clients", allowed: ["Super Admin", "COO", "Customer Care"] },
  { key: "products", label: "Product Management", icon: "▣", subtitle: "Properties and inspections", allowed: ["Super Admin", "COO", "Product Manager", "Branch Manager", "Realtor"] },
  { key: "frontDesk", label: "Front Desk", icon: "☷", subtitle: "Visitors and attendance", allowed: ["Super Admin", "COO", "Front Desk Officer"] },
  { key: "media", label: "Media Management", icon: "◌", subtitle: "Content and campaigns", allowed: ["Super Admin", "COO", "Media Team"] },
  { key: "reports", label: "Reports Center", icon: "▤", subtitle: "PDF, Excel, CSV", allowed: ["Super Admin", "COO", "CSMO", "Customer Care", "Product Manager", "Media Team", "Branch Manager", "Investor", "Front Desk Officer"] },
  { key: "ai", label: "AI & Automation", icon: "✧", subtitle: "Scoring and predictions", allowed: ["Super Admin", "COO", "CSMO", "Customer Care", "Branch Manager"] },
  { key: "administration", label: "Administration", icon: "⚿", subtitle: "Users and permissions", allowed: ["Super Admin"] },
  { key: "audit", label: "Audit Logs", icon: "◍", subtitle: "Security trail", allowed: ["Super Admin", "COO"] },
];

const roleHome: Record<Role, NavKey> = {
  "Super Admin": "dashboard",
  COO: "operations",
  CSMO: "sales",
  "Customer Care": "customerCare",
  "Product Manager": "products",
  "Media Team": "media",
  "Branch Manager": "realtors",
  Realtor: "sales",
  Investor: "operations",
  "Front Desk Officer": "frontDesk",
};

const roleDescriptions: Record<Role, { title: string; scope: string; focus: string; metrics: string[] }> = {
  "Super Admin": { title: "System Administration Workspace", scope: "Full platform access across users, roles, audit logs, reports and configuration.", focus: "Control access, secure data, monitor activity and approve sensitive changes.", metrics: ["612 users", "37 branches", "98% system health"] },
  COO: { title: "Operations Control Workspace", scope: "Customer database, commissions, investments, approvals and operations reports.", focus: "Track company operations, investor maturity, payout risks and customer performance.", metrics: ["₦72.5M pending commission", "19 maturities", "6 cash-out requests"] },
  CSMO: { title: "Sales Management Workspace", scope: "Lead qualification, objections, follow-ups, sales pipeline and team performance.", focus: "Improve lead conversion, manage follow-up discipline and monitor objection trends.", metrics: ["314 hot leads", "87 follow-ups due", "22.4% win rate"] },
  "Customer Care": { title: "Customer Care Workspace", scope: "Client reminders, engagement messages, VIP client records and retention reports.", focus: "Keep customers informed, reduce churn risk and manage high-value relationships.", metrics: ["42 reminders due", "18 VIP clients", "96% response SLA"] },
  "Product Manager": { title: "Product Management Workspace", scope: "Property records, approval workflow, knowledge hub and inspection records.", focus: "Keep product information accurate, approved and ready for realtor sales activity.", metrics: ["48 properties", "7 under review", "23 inspections"] },
  "Media Team": { title: "Media Operations Workspace", scope: "Content scheduler, blog management, campaigns, approvals and social reports.", focus: "Plan, publish, measure and improve campaigns across all company social channels.", metrics: ["31 scheduled posts", "6 campaigns", "428 leads attributed"] },
  "Branch Manager": { title: "Branch Management Workspace", scope: "Branch realtors, branch leads, inspections, referrals, ranking and reactivation.", focus: "Improve branch productivity, realtor activity and sales discipline.", metrics: ["84 realtors", "488 branch leads", "41 sales closed"] },
  Realtor: { title: "Realtor Field Workspace", scope: "Assigned leads, follow-ups, inspections, learning resources and property guides.", focus: "Manage personal pipeline, improve sales skill and close assigned opportunities.", metrics: ["17 assigned leads", "5 hot leads", "4 inspections"] },
  Investor: { title: "Investor Workspace", scope: "Investment portfolio, ROI earned, maturity dates and cash-out requests.", focus: "Monitor RealtyPin investment records and upcoming maturity actions.", metrics: ["₦142M invested", "₦18.4M ROI", "2 maturities"] },
  "Front Desk Officer": { title: "Front Desk Workspace", scope: "Visitor registration, check-in/out, attendance and visitor reports.", focus: "Control reception activity, visitor passes and staff attendance records.", metrics: ["34 visitors today", "7 late arrivals", "3 waiting"] },
};

const initialLeads: LeadRecord[] = [
  { id: 1, name: "Mrs. Adaeze Nwankwo", phone: "+234 803 122 9941", email: "adaeze.n@example.com", source: "Instagram Campaign", assignedRealtor: "Tunde Bello", budget: "₦20M – ₦50M", propertyType: "Residential", state: "Lagos", city: "Lekki", area: "Phase 1", purpose: "Residential", timeline: "Immediate", score: "Hot", status: "Negotiation", method: "WhatsApp", lastContact: "Today", nextFollowUp: "Today, 5:00 PM", objection: "Payment Plan Concern", notes: "Requested flexible payment plan and title document review." },
  { id: 2, name: "Greenfield Homes Ltd", phone: "+234 905 211 4820", email: "info@greenfieldhomes.ng", source: "Referral", assignedRealtor: "Ada Okafor", budget: "₦50M+", propertyType: "Commercial", state: "Lagos", city: "Victoria Island", area: "Akin Adesola", purpose: "Rental Income", timeline: "1–3 Months", score: "Hot", status: "Inspection Scheduled", method: "Email", lastContact: "Yesterday", nextFollowUp: "Tomorrow, 11:30 AM", objection: "Documentation Concern", notes: "Management requested updated survey and deed of assignment before inspection." },
  { id: 3, name: "Mr. Chinedu Obi", phone: "+234 812 090 6621", email: "chinedu.obi@example.com", source: "Website", assignedRealtor: "Chika Nwosu", budget: "₦5M – ₦10M", propertyType: "Land", state: "Lagos", city: "Ibeju-Lekki", area: "Eleko", purpose: "Investment", timeline: "3–6 Months", score: "Warm", status: "Follow-Up", method: "Phone Call", lastContact: "2 days ago", nextFollowUp: "Friday, 10:00 AM", objection: "Needs Spouse Approval", notes: "Wife wants to join the next property inspection." },
  { id: 4, name: "Mercy Adebayo", phone: "+234 701 455 8830", email: "mercy.a@example.com", source: "TikTok Lead Form", assignedRealtor: "Ifeanyi Eze", budget: "Under ₦5M", propertyType: "Shortlet Investment", state: "Lagos", city: "Ajah", area: "Sangotedo", purpose: "Investment", timeline: "6+ Months", score: "Cold", status: "Contacted", method: "SMS", lastContact: "4 days ago", nextFollowUp: "Next Monday", objection: "Lack of Funds", notes: "Send smaller entry investment opportunity when available." },
];

const initialContent: ContentRecord[] = [
  { id: 1, title: "Lekki Investor Open Day", format: "Video", platforms: ["Facebook", "Instagram", "TikTok"], campaign: "Q3 Investment Push", publishAt: "Today, 6:00 PM", status: "Scheduled", reach: 48200, engagement: 4100, leads: 83 },
  { id: 2, title: "Palmridge Estate Flyer", format: "Flyer/Image", platforms: ["Instagram", "LinkedIn", "X (Twitter)"], campaign: "Land Banking Awareness", publishAt: "Tomorrow, 9:00 AM", status: "Approval", reach: 29700, engagement: 2600, leads: 51 },
  { id: 3, title: "Why Shortlet Investment Works", format: "Blog Article", platforms: ["Website", "LinkedIn"], campaign: "RealtyPin Education", publishAt: "Friday", status: "Review", reach: 13500, engagement: 920, leads: 19 },
];

const initialProperties: PropertyRecord[] = [
  { id: 1, title: "Azure Court Phase II", type: "Residential", location: "Lekki Phase 1, Lagos", price: "₦85M", status: "Available", workflow: "Publishing", media: "18 images • 3 videos", documents: "Survey • Deed • Allocation Letter", guide: "Premium 4-bedroom units with flexible payment and title documentation ready." },
  { id: 2, title: "Palmridge Estate", type: "Land", location: "Ibeju-Lekki, Lagos", price: "₦12M/plot", status: "Reserved", workflow: "Approval", media: "23 images • 2 videos", documents: "Survey • Layout • Gazette", guide: "Fast-selling land product near emerging commercial corridor." },
  { id: 3, title: "Northgate Gardens", type: "Mixed Use", location: "Abuja", price: "₦32M", status: "Under Review", workflow: "Revision Requested", media: "9 images", documents: "Layout pending update", guide: "Product team needs updated survey document before full release." },
  { id: 4, title: "REPROS Shortlet Tower", type: "Shortlet Investment", location: "Victoria Island, Lagos", price: "₦120M", status: "Available", workflow: "Review", media: "12 images • 4 videos", documents: "Title • ROI brief • Facility plan", guide: "High-value shortlet investment for investor campaign." },
];

const initialVisitors: VisitorRecord[] = [
  { id: 1, name: "Mr. Femi Cole", phone: "+234 811 443 9201", email: "femi.cole@example.com", purpose: "Property consultation", department: "Sales", staff: "Tunde Bello", pass: "RP-1024", checkIn: "09:42 AM", checkOut: "", status: "Checked In" },
  { id: 2, name: "Grace Nwosu", phone: "+234 902 118 5520", email: "grace.nwosu@example.com", purpose: "Investment inquiry", department: "Customer Care", staff: "Ada Okafor", pass: "RP-1025", checkIn: "10:15 AM", checkOut: "", status: "Waiting" },
];

const clients = [
  { id: "C-10021", name: "Chief Daniel Umeh", phone: "+234 803 000 0011", email: "daniel.umeh@example.com", address: "Banana Island, Lagos", occupation: "Investor", interests: "Shortlet Investment, Commercial", investment: "₦142M active", transaction: "₦320M lifetime", communication: "Maturity reminder due in 14 days", tag: "VIP ₦10M+" },
  { id: "C-10022", name: "Amaka Realty Partners", phone: "+234 701 450 1112", email: "operations@amakarealty.ng", address: "Ikoyi, Lagos", occupation: "Real Estate Firm", interests: "Land, Mixed Use", investment: "Pending cash-out", transaction: "₦86M lifetime", communication: "Customer care callback required", tag: "Returning Client" },
  { id: "C-10023", name: "Mr. Musa Ibrahim", phone: "+234 909 221 8830", email: "musa.i@example.com", address: "Wuse II, Abuja", occupation: "Business Owner", interests: "Residential", investment: "No active investment", transaction: "₦24M lifetime", communication: "Welcome pack delivered", tag: "New Client" },
];

const commissions = [
  { realtor: "Ada Okafor", type: "Realtor Commission", client: "Greenfield Homes Ltd", amount: "₦6M", status: "Approved", history: "Awaiting payout batch" },
  { realtor: "Tunde Bello", type: "Referral Commission", client: "Mrs. Adaeze Nwankwo", amount: "₦1.25M", status: "Pending", history: "COO review required" },
  { realtor: "Chika Nwosu", type: "Realtor Commission", client: "Mr. Chinedu Obi", amount: "₦1.2M", status: "Paid", history: "Paid 12 Jun 2026" },
];

const investments = [
  { investor: "Chief Daniel Umeh", total: "₦142M", active: "₦100M", roi: "₦18.4M", maturity: "14 days", status: "Active", action: "Send 14-day reminder" },
  { investor: "Amaka Realty Partners", total: "₦86M", active: "₦48M", roi: "₦9.8M", maturity: "30 days", status: "Cash-out requested", action: "Review cash-out" },
  { investor: "Mercy Adebayo", total: "₦12M", active: "₦12M", roi: "₦1.1M", maturity: "90 days", status: "Active", action: "Monitor ROI" },
];

const branches = [
  { name: "Lekki", total: 84, active: 71, dormant: 13, leads: 488, inspections: 91, referrals: 67, sales: 41, boe: "86%", score: 92 },
  { name: "Abuja", total: 63, active: 52, dormant: 11, leads: 341, inspections: 64, referrals: 38, sales: 33, boe: "79%", score: 86 },
  { name: "Ikeja", total: 71, active: 54, dormant: 17, leads: 298, inspections: 52, referrals: 44, sales: 26, boe: "74%", score: 74 },
  { name: "Port Harcourt", total: 39, active: 27, dormant: 12, leads: 176, inspections: 31, referrals: 18, sales: 14, boe: "62%", score: 61 },
];

const realtorRanks = [
  { rank: 1, name: "Ada Okafor", branch: "Lekki", leads: 42, inspections: 18, referrals: 7, sales: 9, recruits: 11, reward: "₦850k", status: "Active" },
  { rank: 2, name: "Tunde Bello", branch: "Abuja", leads: 38, inspections: 16, referrals: 4, sales: 7, recruits: 8, reward: "₦620k", status: "Active" },
  { rank: 3, name: "Chika Nwosu", branch: "Ikeja", leads: 31, inspections: 11, referrals: 6, sales: 5, recruits: 7, reward: "₦480k", status: "Active" },
  { rank: 4, name: "Ifeanyi Eze", branch: "Ajah", leads: 14, inspections: 4, referrals: 1, sales: 1, recruits: 2, reward: "₦120k", status: "60 Days Inactive" },
];

const learningResources = [
  { type: "Training Videos", title: "Converting Property Investment Leads", progress: "82%", status: "In Progress" },
  { type: "BOE Recordings", title: "Weekly BOE: Handling Trust Objections", progress: "100%", status: "Completed" },
  { type: "Sales Scripts", title: "Inspection Booking Call Script", progress: "Ready", status: "Published" },
  { type: "Property Guides", title: "Azure Court Sales Guide", progress: "Ready", status: "Published" },
  { type: "Marketing Templates", title: "Instagram Story Lead Magnet", progress: "Ready", status: "Published" },
];

const inspections = [
  { client: "Mrs. Adaeze Nwankwo", realtor: "Tunde Bello", property: "Azure Court Phase II", request: "Site visit", date: "Today, 2:00 PM", attendance: "Pending", feedback: "Awaiting inspection report" },
  { client: "Greenfield Homes Ltd", realtor: "Ada Okafor", property: "REPROS Shortlet Tower", request: "Executive inspection", date: "Tomorrow, 11:30 AM", attendance: "Pending", feedback: "Management team attending" },
  { client: "Mr. Chinedu Obi", realtor: "Chika Nwosu", property: "Palmridge Estate", request: "Land inspection", date: "Yesterday", attendance: "Present", feedback: "Client requested spouse visit" },
];

const users = [
  { name: "Amara Eze", role: "COO", department: "Operations", status: "Active", security: "2FA Enabled" },
  { name: "David Bassey", role: "CSMO", department: "Sales", status: "Active", security: "2FA Enabled" },
  { name: "Ada Okafor", role: "Realtor", department: "Lekki Branch", status: "Active", security: "Password Reset Sent" },
  { name: "Bola Martins", role: "Front Desk Officer", department: "Reception", status: "Disabled", security: "Access Revoked" },
];

export default function HomePage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<AppVersion>("web");
  const [selectedRole, setSelectedRole] = useState<Role>("Super Admin");
  const [activePage, setActivePage] = useState<NavKey>("dashboard");
  const [toast, setToast] = useState("");
  const [modal, setModal] = useState<ModalType>(null);
  const [leads, setLeads] = useState<LeadRecord[]>(initialLeads);
  const [content, setContent] = useState<ContentRecord[]>(initialContent);
  const [properties, setProperties] = useState<PropertyRecord[]>(initialProperties);
  const [visitors, setVisitors] = useState<VisitorRecord[]>(initialVisitors);
  const [search, setSearch] = useState("");

  const visibleNav = useMemo(() => navItems.filter((item) => item.allowed.includes(selectedRole)), [selectedRole]);
  const currentRole = roleDescriptions[selectedRole];
  const canAccess = (key: NavKey) => navItems.find((item) => item.key === key)?.allowed.includes(selectedRole);
  const visibleLeads = selectedRole === "Realtor" ? leads.filter((lead) => lead.assignedRealtor === "Tunde Bello" || lead.assignedRealtor === "Ada Okafor") : leads;
  const filteredLeads = visibleLeads.filter((lead) => `${lead.name} ${lead.phone} ${lead.email} ${lead.source} ${lead.assignedRealtor} ${lead.budget} ${lead.propertyType} ${lead.city} ${lead.area} ${lead.status} ${lead.score}`.toLowerCase().includes(search.toLowerCase()));

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const enterApp = () => {
    if (selectedVersion === "mobile") {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("repros-role", selectedRole);
        window.location.href = `/mobile?role=${encodeURIComponent(selectedRole)}`;
      }
      return;
    }
    setActivePage(roleHome[selectedRole]);
    setLoggedIn(true);
    notify(`${selectedRole} workspace loaded.`);
  };

  const logout = () => {
    setLoggedIn(false);
    setActivePage("dashboard");
    notify("Signed out. Select workspace and role to continue.");
  };

  const openPage = (page: NavKey) => {
    if (!canAccess(page)) {
      setActivePage("dashboard");
      notify(`${selectedRole} does not have access to that module.`);
      return;
    }
    setActivePage(page);
  };

  const updateLeadStatus = (id: number, status: LeadStatus) => {
    setLeads((prev) => prev.map((lead) => lead.id === id ? { ...lead, status, lastContact: "Updated now" } : lead));
    notify(`Lead moved to ${status}.`);
  };

  const approveProperty = (id: number) => {
    setProperties((prev) => prev.map((property) => property.id === id ? { ...property, workflow: "Publishing", status: "Available" } : property));
    notify("Property approved and moved to publishing queue.");
  };

  const advanceContent = (id: number) => {
    const order: ContentRecord["status"][] = ["Draft", "Review", "Approval", "Scheduled", "Published"];
    setContent((prev) => prev.map((item) => {
      if (item.id !== id) return item;
      const next = order[Math.min(order.indexOf(item.status) + 1, order.length - 1)];
      return { ...item, status: next };
    }));
    notify("Content workflow advanced.");
  };

  const checkoutVisitor = (id: number) => {
    setVisitors((prev) => prev.map((visitor) => visitor.id === id ? { ...visitor, status: "Checked Out", checkOut: "Now" } : visitor));
    notify("Visitor check-out recorded.");
  };

  if (!loggedIn) {
    return <LoginScreen selectedVersion={selectedVersion} setSelectedVersion={setSelectedVersion} selectedRole={selectedRole} setSelectedRole={setSelectedRole} enterApp={enterApp} />;
  }

  return (
    <main className="min-h-screen bg-[#f6f7fb] text-slate-950">
      <div className="flex min-h-screen">
        <aside className="hidden w-[290px] shrink-0 border-r border-slate-200 bg-[#111111] text-white xl:flex xl:flex-col">
          <div className="border-b border-white/10 p-6">
            <div className="flex items-center gap-3 rounded-3xl bg-white p-3">
              <Image src="/logo-realtypros.jpeg" alt="RealtyPros logo" width={180} height={58} className="h-12 w-auto object-contain" />
            </div>
            <p className="mt-5 text-xs font-black uppercase tracking-[0.28em] text-red-300">REPROS CRM</p>
            <h1 className="mt-2 text-2xl font-black leading-tight">{currentRole.title}</h1>
            <p className="mt-2 text-sm font-medium leading-6 text-white/65">{currentRole.scope}</p>
          </div>
          <nav className="flex-1 space-y-2 overflow-y-auto p-4">
            {visibleNav.map((item) => (
              <button key={item.key} onClick={() => openPage(item.key)} className={`group w-full rounded-3xl px-4 py-3 text-left transition ${activePage === item.key ? "bg-[#ef3b24] text-white shadow-xl shadow-red-950/20" : "text-white/68 hover:bg-white/10 hover:text-white"}`}>
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-2xl bg-white/10 text-lg">{item.icon}</span>
                  <span className="min-w-0">
                    <span className="block text-sm font-black">{item.label}</span>
                    <span className="block truncate text-[11px] font-bold opacity-70">{item.subtitle}</span>
                  </span>
                </div>
              </button>
            ))}
          </nav>
          <div className="border-t border-white/10 p-4">
            <button onClick={logout} className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-black text-white transition hover:bg-white/15">Logout and change role</button>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 px-4 py-4 backdrop-blur md:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button className="grid h-11 w-11 place-items-center rounded-2xl bg-[#ef3b24] text-xl font-black text-white xl:hidden">R</button>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#ef3b24]">{selectedRole}</p>
                  <h2 className="text-xl font-black md:text-2xl">{navItems.find((item) => item.key === activePage)?.label || currentRole.title}</h2>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Search records, leads, clients" className="hidden w-72 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none transition focus:border-[#ef3b24] focus:bg-white md:block" />
                <button onClick={() => notify("Notifications opened.")} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm">Alerts</button>
                <button onClick={logout} className="rounded-2xl bg-[#111111] px-4 py-3 text-sm font-black text-white shadow-sm">Logout</button>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-[1500px] space-y-6 p-4 md:p-8">
            <RoleBanner role={selectedRole} />
            {activePage === "dashboard" && <Dashboard role={selectedRole} openPage={openPage} />}
            {activePage === "sales" && <SalesModule role={selectedRole} leads={filteredLeads} setModal={setModal} updateLeadStatus={updateLeadStatus} notify={notify} search={search} setSearch={setSearch} />}
            {activePage === "operations" && <OperationsModule role={selectedRole} notify={notify} />}
            {activePage === "realtors" && <RealtorModule notify={notify} />}
            {activePage === "learning" && <LearningHub notify={notify} setModal={setModal} />}
            {activePage === "customerCare" && <CustomerCare notify={notify} />}
            {activePage === "products" && <ProductModule properties={properties} setModal={setModal} approveProperty={approveProperty} notify={notify} />}
            {activePage === "frontDesk" && <FrontDesk visitors={visitors} setModal={setModal} checkoutVisitor={checkoutVisitor} notify={notify} />}
            {activePage === "media" && <MediaModule content={content} setModal={setModal} advanceContent={advanceContent} notify={notify} />}
            {activePage === "reports" && <ReportsCenter role={selectedRole} notify={notify} />}
            {activePage === "ai" && <AIAutomation notify={notify} />}
            {activePage === "administration" && <Administration notify={notify} setModal={setModal} />}
            {activePage === "audit" && <AuditLogs />}
          </div>
        </section>
      </div>

      {toast && <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#111111] px-5 py-3 text-sm font-black text-white shadow-2xl">{toast}</div>}
      <AppModal modal={modal} close={() => setModal(null)} setLeads={setLeads} setContent={setContent} setVisitors={setVisitors} setProperties={setProperties} notify={notify} role={selectedRole} />
    </main>
  );
}

function LoginScreen({ selectedVersion, setSelectedVersion, selectedRole, setSelectedRole, enterApp }: { selectedVersion: AppVersion; setSelectedVersion: (value: AppVersion) => void; selectedRole: Role; setSelectedRole: (role: Role) => void; enterApp: () => void }) {
  return (
    <main className="min-h-screen overflow-hidden bg-[#111111] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(239,59,36,0.42),transparent_34rem),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_32rem)]" />
      <section className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-5 py-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-8">
          <div className="inline-flex rounded-[2rem] bg-white p-4 shadow-2xl shadow-black/30">
            <Image src="/logo-realtypros.jpeg" alt="RealtyPros Investment Global Ltd" width={350} height={95} className="h-20 w-auto object-contain" priority />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.36em] text-red-200">Enterprise Real Estate CRM & Realtor Management System</p>
            <h1 className="mt-5 max-w-3xl text-5xl font-black leading-[0.96] tracking-tight md:text-7xl">REALTO<span className="text-[#ef3b24]">REPROS</span></h1>
            <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-white/72">A unified operating system for realtor recruitment, sales tracking, client management, investments, property approvals, customer care, media operations, learning and AI-powered automation.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["Multi-branch", "Thousands of users"],
              ["RBAC", "Role-based access"],
              ["Supabase", "PostgreSQL + RLS"],
            ].map(([title, text]) => <div key={title} className="rounded-3xl border border-white/10 bg-white/8 p-5"><p className="text-xl font-black">{title}</p><p className="mt-1 text-sm font-semibold text-white/60">{text}</p></div>)}
          </div>
        </div>
        <div className="rounded-[2.2rem] border border-white/10 bg-white p-3 text-slate-950 shadow-2xl shadow-black/35">
          <div className="rounded-[1.8rem] bg-slate-50 p-5 md:p-7">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#ef3b24]">Workspace Access</p>
            <h2 className="mt-2 text-3xl font-black">Choose product experience</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <ChoiceCard active={selectedVersion === "web"} title="Web Application" text="Full CRM administration, branch control, reports, approvals and executive operations." onClick={() => setSelectedVersion("web")} />
              <ChoiceCard active={selectedVersion === "mobile"} title="Android / iOS Application" text="Field-ready mobile workspace with bottom navigation and role-specific actions." onClick={() => setSelectedVersion("mobile")} />
            </div>
            <h3 className="mt-7 text-sm font-black uppercase tracking-[0.22em] text-slate-500">Select user role</h3>
            <div className="mt-4 grid max-h-[360px] gap-3 overflow-y-auto pr-1 sm:grid-cols-2">
              {roles.map((role) => (
                <button key={role} onClick={() => setSelectedRole(role)} className={`rounded-3xl border p-4 text-left transition ${selectedRole === role ? "border-[#ef3b24] bg-[#fff5f3] shadow-lg shadow-red-100" : "border-slate-200 bg-white hover:border-red-200"}`}>
                  <p className="font-black">{role}</p>
                  <p className="mt-1 line-clamp-2 text-xs font-semibold leading-5 text-slate-500">{roleDescriptions[role].scope}</p>
                </button>
              ))}
            </div>
            <button onClick={enterApp} className="mt-6 w-full rounded-3xl bg-[#ef3b24] px-6 py-4 text-sm font-black text-white shadow-xl shadow-red-200 transition hover:-translate-y-0.5 hover:bg-[#d92f1d]">
              Continue to {selectedVersion === "web" ? "Web Application" : "Mobile Application"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

function ChoiceCard({ active, title, text, onClick }: { active: boolean; title: string; text: string; onClick: () => void }) {
  return <button onClick={onClick} className={`rounded-3xl border p-5 text-left transition ${active ? "border-[#ef3b24] bg-[#fff5f3]" : "border-slate-200 bg-white hover:border-red-200"}`}><p className="text-lg font-black">{title}</p><p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{text}</p></button>;
}

function RoleBanner({ role }: { role: Role }) {
  const data = roleDescriptions[role];
  return (
    <section className="grid gap-4 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-[1fr_auto]">
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.26em] text-[#ef3b24]">{role} Access Scope</p>
        <h3 className="mt-2 text-2xl font-black">{data.title}</h3>
        <p className="mt-2 max-w-4xl text-sm font-semibold leading-6 text-slate-600">{data.focus}</p>
      </div>
      <div className="flex flex-wrap gap-2 self-center">
        {data.metrics.map((metric) => <Badge key={metric} tone="red">{metric}</Badge>)}
      </div>
    </section>
  );
}

function Dashboard({ role, openPage }: { role: Role; openPage: (page: NavKey) => void }) {
  const cards = role === "CSMO" ? [
    ["Hot Leads", "314", "+18%"], ["Due Follow-ups", "87", "Today"], ["Objections Logged", "126", "This month"], ["Conversion Rate", "22.4%", "+3.1%"]
  ] : role === "Media Team" ? [
    ["Scheduled Posts", "31", "6 platforms"], ["Active Campaigns", "6", "₦8.7M budget"], ["Leads Attributed", "428", "+14%"], ["Engagement", "12.8%", "+2.4%"]
  ] : role === "Front Desk Officer" ? [
    ["Visitors Today", "34", "3 waiting"], ["Clock-ins", "117", "7 late"], ["Passes Issued", "28", "Today"], ["Reports", "2", "Ready"]
  ] : role === "Product Manager" ? [
    ["Properties", "48", "7 under review"], ["Inspections", "23", "This week"], ["Documents", "186", "12 updates"], ["Approval SLA", "91%", "Healthy"]
  ] : role === "Investor" ? [
    ["Total Investment", "₦142M", "Active"], ["ROI Earned", "₦18.4M", "+12.8%"], ["Maturity", "14 days", "Upcoming"], ["Cash-out", "1", "Under review"]
  ] : [
    ["Revenue", "₦1.84B", "+11.6%"], ["Sales", "126", "+9%"], ["Leads", "1,284", "+18%"], ["Investments", "₦486M", "+7.4%"]
  ];
  return (
    <section className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([title, value, change]) => <MetricCard key={title} title={title} value={value} change={change} />)}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <Panel title="Company performance overview" description="Live operational visibility across revenue, sales, leads, inspections, realtor activity, branch health, investments and customer retention.">
          <div className="grid gap-4 md:grid-cols-4">
            {["Revenue", "Sales", "Leads", "Inspections", "Realtor Activity", "Branch Performance", "Investments", "Customer Retention"].map((item, index) => <ProgressItem key={item} label={item} value={96 - index * 7} />)}
          </div>
        </Panel>
        <Panel title="Recommended next actions" description="Role-specific workflow shortcuts.">
          <div className="space-y-3">
            {[
              ["Qualify hot leads", "Open sales pipeline", "sales"],
              ["Review property approvals", "Open product queue", "products"],
              ["Generate monthly reports", "Open reports center", "reports"],
              ["Check AI recommendations", "Open automation engine", "ai"],
            ].map(([title, action, page]) => <button key={title} onClick={() => openPage(page as NavKey)} className="w-full rounded-3xl border border-slate-200 bg-white p-4 text-left transition hover:border-red-200 hover:shadow-sm"><p className="font-black">{title}</p><p className="mt-1 text-xs font-bold text-[#ef3b24]">{action}</p></button>)}
          </div>
        </Panel>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Branch performance" description="Ranking by leads, inspections, referrals, sales closed and BOE attendance."><BranchTable /></Panel>
        <Panel title="Top priority alerts" description="Operational events that require action.">
          <Timeline items={["87 follow-ups are due today", "19 investment maturities fall within the next 30 days", "7 product records require approval", "4 audit events require management review", "31 scheduled content posts are awaiting final checks"]} />
        </Panel>
      </div>
    </section>
  );
}

function SalesModule({ role, leads, setModal, updateLeadStatus, notify, search, setSearch }: { role: Role; leads: LeadRecord[]; setModal: (modal: ModalType) => void; updateLeadStatus: (id: number, status: LeadStatus) => void; notify: (msg: string) => void; search: string; setSearch: (value: string) => void }) {
  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard title="Qualified Leads" value="1,284" change="All sources" />
        <MetricCard title="Hot Leads" value="314" change="Priority" />
        <MetricCard title="Follow-ups Due" value="87" change="Today" />
        <MetricCard title="Closed Won" value="126" change="This month" />
      </div>
      <Panel title="Lead Qualification Engine" description="Capture lead profile, budget, property type, location preference, purchase purpose, buying timeline and lead score." action={<PrimaryButton onClick={() => setModal("lead")}>Create Qualified Lead</PrimaryButton>}>
        <div className="mb-4 grid gap-3 md:grid-cols-[1fr_auto]">
          <input value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Search sales records" className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-[#ef3b24] focus:bg-white" />
          <SecondaryButton onClick={() => notify("Lead assignment rules updated.")}>Run Lead Assignment</SecondaryButton>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead><tr className="border-b text-xs uppercase tracking-[0.16em] text-slate-400">{["Lead Profile", "Qualification", "Location", "Purpose", "Score", "Follow-Up", "Status"].map((h) => <th key={h} className="py-3 pr-4 font-black">{h}</th>)}</tr></thead>
            <tbody>
              {leads.map((lead) => <tr key={lead.id} className="border-b border-slate-100 align-top">
                <td className="py-4 pr-4"><p className="font-black text-slate-900">{lead.name}</p><p className="mt-1 text-xs font-bold text-slate-500">{lead.phone} • {lead.email}</p><p className="mt-1 text-xs font-bold text-[#ef3b24]">{lead.source} • {lead.assignedRealtor}</p></td>
                <td className="py-4 pr-4"><Badge tone="slate">{lead.budget}</Badge><p className="mt-2 font-bold">{lead.propertyType}</p></td>
                <td className="py-4 pr-4"><p className="font-bold">{lead.state}</p><p className="text-xs font-semibold text-slate-500">{lead.city} • {lead.area}</p></td>
                <td className="py-4 pr-4"><p className="font-bold">{lead.purpose}</p><p className="text-xs font-semibold text-slate-500">{lead.timeline}</p></td>
                <td className="py-4 pr-4"><Badge tone={lead.score === "Hot" ? "red" : lead.score === "Warm" ? "amber" : "slate"}>{lead.score}</Badge><p className="mt-2 text-xs font-semibold text-slate-500">{lead.objection}</p></td>
                <td className="py-4 pr-4"><p className="font-bold">{lead.method}</p><p className="text-xs font-semibold text-slate-500">Last: {lead.lastContact}</p><p className="text-xs font-semibold text-[#ef3b24]">Next: {lead.nextFollowUp}</p></td>
                <td className="py-4 pr-4"><select value={lead.status} onChange={(event) => updateLeadStatus(lead.id, event.target.value as LeadStatus)} className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-black outline-none">{leadStatuses.map((s) => <option key={s}>{s}</option>)}</select></td>
              </tr>)}
            </tbody>
          </table>
        </div>
      </Panel>
      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Objection Management System" description="Analyze objection frequency, conversion impact and sales team objection handling performance.">
          <div className="grid gap-3 sm:grid-cols-2">
            {objectionCategories.map((item, index) => <button key={item} onClick={() => notify(`${item} objection report opened.`)} className="rounded-2xl bg-slate-50 p-4 text-left transition hover:bg-white hover:shadow-sm"><p className="font-black">{item}</p><p className="mt-1 text-xs font-bold text-slate-500">{18 - (index % 6)} active records</p></button>)}
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {['Objection Frequency Report', 'Conversion Report', 'Sales Team Performance Report'].map((report) => <SecondaryButton key={report} onClick={() => notify(`${report} generated.`)}>{report}</SecondaryButton>)}
          </div>
        </Panel>
        <Panel title="Follow-Up Management" description="Track last contact date, next follow-up date, method, notes and sales stage.">
          <div className="grid gap-3">
            {leads.slice(0, 4).map((lead) => <div key={lead.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-black">{lead.name}</p><p className="mt-1 text-sm font-semibold text-slate-500">{lead.method} • {lead.notes}</p></div><Badge tone="red">{lead.nextFollowUp}</Badge></div></div>)}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">{followUpMethods.map((method) => <Badge key={method} tone="slate">{method}</Badge>)}</div>
        </Panel>
      </div>
    </section>
  );
}

function OperationsModule({ role, notify }: { role: Role; notify: (msg: string) => void }) {
  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard title="Total Customer Value" value="₦1.26B" change="Active database" />
        <MetricCard title="Pending Commission" value="₦72.5M" change="31 records" />
        <MetricCard title="Active Investments" value="₦486M" change="RealtyPin" />
        <MetricCard title="Maturities" value="19" change="30 days" />
      </div>
      <Panel title={role === "Investor" ? "Investor Dashboard" : "Centralized Customer Database"} description="Customer ID, profile information, property interests, investment interests, transaction history and communication history.">
        <div className="grid gap-4 xl:grid-cols-3">
          {clients.map((client) => <div key={client.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-black text-[#ef3b24]">{client.id}</p><h3 className="mt-1 text-lg font-black">{client.name}</h3></div><Badge tone="red">{client.tag}</Badge></div><div className="mt-4 space-y-2 text-sm font-semibold text-slate-600"><p>{client.phone}</p><p>{client.email}</p><p>{client.address}</p><p>Occupation: {client.occupation}</p><p>Property Interest: {client.interests}</p><p>Investment Interest: {client.investment}</p><p>Transaction History: {client.transaction}</p><p>Communication: {client.communication}</p></div></div>)}
        </div>
      </Panel>
      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Commission Management" description="Track realtor commission, referral commission, commission status and payment history." action={<SecondaryButton onClick={() => notify("Commission payment file sent for approval.")}>Prepare Payment Batch</SecondaryButton>}>
          <DataList rows={commissions.map((item) => ({ title: `${item.realtor} • ${item.type}`, sub: `${item.client} • ${item.history}`, value: item.amount, status: item.status }))} />
        </Panel>
        <Panel title="Investment Management" description="RealtyPin investments, ROI monitoring, maturity tracking and cash-out requests." action={<SecondaryButton onClick={() => notify("Investor maturity reminders queued.")}>Queue Maturity Alerts</SecondaryButton>}>
          <DataList rows={investments.map((item) => ({ title: item.investor, sub: `Active: ${item.active} • ROI: ${item.roi} • Maturity: ${item.maturity}`, value: item.total, status: item.status }))} />
        </Panel>
      </div>
    </section>
  );
}

function RealtorModule({ notify }: { notify: (msg: string) => void }) {
  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard title="Total Realtors" value="257" change="37 branches" />
        <MetricCard title="Active Realtors" value="204" change="79% active" />
        <MetricCard title="Dormant Realtors" value="53" change="30/60/90 days" />
        <MetricCard title="BOE Attendance" value="81%" change="This month" />
      </div>
      <Panel title="Branch Performance Dashboard" description="Total realtors, active/dormant realtors, leads generated, inspections, referrals, sales closed and BOE attendance."><BranchTable /></Panel>
      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Rankings and Leaderboards" description="Individual rankings, branch rankings, monthly, quarterly and annual performance.">
          <div className="overflow-x-auto"><table className="w-full min-w-[700px] text-sm"><thead><tr className="border-b text-xs uppercase tracking-widest text-slate-400">{["Rank", "Realtor", "Branch", "Leads", "Inspections", "Sales", "Recruits", "Reward"].map((h) => <th key={h} className="py-3 pr-4 text-left font-black">{h}</th>)}</tr></thead><tbody>{realtorRanks.map((r) => <tr key={r.rank} className="border-b border-slate-100"><td className="py-4 pr-4 font-black">#{r.rank}</td><td className="py-4 pr-4 font-black">{r.name}</td><td className="py-4 pr-4">{r.branch}</td><td className="py-4 pr-4">{r.leads}</td><td className="py-4 pr-4">{r.inspections}</td><td className="py-4 pr-4 font-black text-[#ef3b24]">{r.sales}</td><td className="py-4 pr-4">{r.recruits}</td><td className="py-4 pr-4">{r.reward}</td></tr>)}</tbody></table></div>
        </Panel>
        <Panel title="Recruitment and Reactivation" description="Recruitment tracker, referral rewards, conversion rate, inactive 30/60/90 day detection and reactivation campaigns." action={<PrimaryButton onClick={() => notify("Reactivation campaign generated for dormant realtors.")}>Create Reactivation Campaign</PrimaryButton>}>
          <DataList rows={[
            { title: "Recruitment Tracker", sub: "Recruit name, referred by, recruitment date and status", value: "64", status: "Active recruits" },
            { title: "Referral Performance", sub: "Total recruits, active recruits, conversion rate and rewards", value: "38%", status: "Conversion" },
            { title: "30 Days Inactive", sub: "Reminder messages and WhatsApp notifications", value: "28", status: "Auto reminder" },
            { title: "60 Days Inactive", sub: "Call scheduling and branch manager handoff", value: "17", status: "Call list" },
            { title: "90 Days Inactive", sub: "Formal reactivation campaign", value: "8", status: "Campaign" },
          ]} />
        </Panel>
      </div>
    </section>
  );
}

function LearningHub({ notify, setModal }: { notify: (msg: string) => void; setModal: (modal: ModalType) => void }) {
  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard title="Learning Resources" value="186" change="Videos, scripts, guides" />
        <MetricCard title="Quizzes" value="34" change="Active" />
        <MetricCard title="Exam Pass Rate" value="78%" change="This month" />
        <MetricCard title="Certificates" value="412" change="Issued" />
      </div>
      <Panel title="Realtor Learning Hub" description="Training videos, BOE recordings, sales scripts, property guides and marketing templates." action={<PrimaryButton onClick={() => setModal("learning")}>Add Learning Resource</PrimaryButton>}>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {learningResources.map((item) => <button key={item.title} onClick={() => notify(`${item.title} opened.`)} className="rounded-3xl border border-slate-100 bg-slate-50 p-5 text-left transition hover:border-red-200 hover:bg-white hover:shadow-sm"><Badge tone="red">{item.type}</Badge><h3 className="mt-4 font-black">{item.title}</h3><p className="mt-2 text-sm font-semibold text-slate-500">Progress: {item.progress}</p><p className="mt-1 text-xs font-black text-[#ef3b24]">{item.status}</p></button>)}
        </div>
      </Panel>
      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Assessment System" description="Quizzes, exams, scores and performance tracking.">
          <DataList rows={[
            { title: "Lead Conversion Quiz", sub: "15 questions • 20 minutes", value: "86%", status: "Average score" },
            { title: "Property Documentation Exam", sub: "30 questions • certification path", value: "72%", status: "Pass rate" },
            { title: "Objection Handling Assessment", sub: "Scenario-based sales evaluation", value: "91%", status: "Top branch" },
          ]} />
        </Panel>
        <Panel title="Certification" description="Certificates, progress tracking and training completion status." action={<SecondaryButton onClick={() => notify("Certificates generated for completed learners.")}>Generate Certificates</SecondaryButton>}>
          <DataList rows={[
            { title: "Certified REPROS Sales Associate", sub: "80% minimum score + completed property guide path", value: "219", status: "Issued" },
            { title: "Advanced Investment Advisor", sub: "RealtyPin investment training completion", value: "88", status: "Issued" },
            { title: "Branch Sales Leader", sub: "Leadership exam and BOE attendance", value: "34", status: "Eligible" },
          ]} />
        </Panel>
      </div>
    </section>
  );
}

function CustomerCare({ notify }: { notify: (msg: string) => void }) {
  const reminders = ["30 Days Before Maturity", "14 Days Before Maturity", "7 Days Before Maturity", "2 Days Before Maturity", "Outstanding Balance Reminder", "Due Date Reminder", "Payment Confirmation", "Welcome Messages", "Birthday Messages", "Festive Greetings", "Appreciation Messages"];
  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4"><MetricCard title="Reminders Due" value="42" change="Today" /><MetricCard title="VIP Clients" value="18" change="₦10M+" /><MetricCard title="Retention Score" value="86%" change="Healthy" /><MetricCard title="Response SLA" value="96%" change="On time" /></div>
      <Panel title="Automated Notifications" description="Investment reminders, payment notifications and customer engagement workflows." action={<PrimaryButton onClick={() => notify("Customer notification sequence activated.")}>Activate Sequence</PrimaryButton>}>
        <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-4">{reminders.map((item) => <button key={item} onClick={() => notify(`${item} template opened.`)} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-left transition hover:bg-white hover:shadow-sm"><p className="font-black">{item}</p><p className="mt-1 text-xs font-semibold text-slate-500">Email • SMS • WhatsApp • Push</p></button>)}</div>
      </Panel>
      <Panel title="VIP Client Management" description="Automatic tagging for clients with ₦5M+ and ₦10M+ transactions, top investors, returning clients and VIP dashboards.">
        <div className="grid gap-4 md:grid-cols-3">{clients.map((client) => <div key={client.id} className="rounded-3xl bg-slate-50 p-5"><Badge tone="red">{client.tag}</Badge><h3 className="mt-4 font-black">{client.name}</h3><p className="mt-2 text-sm font-semibold text-slate-500">{client.transaction}</p><p className="mt-1 text-sm font-semibold text-slate-500">{client.communication}</p></div>)}</div>
        <div className="mt-5 flex flex-wrap gap-2">{["Monthly Reports", "Quarterly Reports", "Annual Reports"].map((item) => <SecondaryButton key={item} onClick={() => notify(`${item} generated.`)}>{item}</SecondaryButton>)}</div>
      </Panel>
    </section>
  );
}

function ProductModule({ properties, setModal, approveProperty, notify }: { properties: PropertyRecord[]; setModal: (modal: ModalType) => void; approveProperty: (id: number) => void; notify: (msg: string) => void }) {
  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4"><MetricCard title="Properties" value="48" change="Inventory" /><MetricCard title="Available" value="31" change="Ready" /><MetricCard title="Under Review" value="7" change="Approval" /><MetricCard title="Inspections" value="23" change="This week" /></div>
      <Panel title="Property Management" description="Store property details, images, videos, documents, pricing and location data." action={<PrimaryButton onClick={() => setModal("property")}>Add Property Record</PrimaryButton>}>
        <div className="grid gap-4 xl:grid-cols-2">{properties.map((property) => <div key={property.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="text-lg font-black">{property.title}</h3><p className="mt-1 text-sm font-semibold text-slate-500">{property.type} • {property.location}</p></div><Badge tone={property.status === "Available" ? "green" : property.status === "Under Review" ? "amber" : "slate"}>{property.status}</Badge></div><div className="mt-4 grid gap-2 text-sm font-semibold text-slate-600 md:grid-cols-2"><p>Pricing: {property.price}</p><p>Workflow: {property.workflow}</p><p>Media: {property.media}</p><p>Documents: {property.documents}</p></div><p className="mt-4 rounded-2xl bg-white p-4 text-sm font-semibold leading-6 text-slate-600">{property.guide}</p><div className="mt-4 flex flex-wrap gap-2"><SecondaryButton onClick={() => notify(`${property.title} knowledge hub opened.`)}>Knowledge Hub</SecondaryButton><PrimaryButton onClick={() => approveProperty(property.id)}>Approve</PrimaryButton></div></div>)}</div>
      </Panel>
      <div className="grid gap-6 xl:grid-cols-2"><Panel title="Inspection Management" description="Inspection requests, attendance, feedback and inspection reports."><DataList rows={inspections.map((item) => ({ title: `${item.client} • ${item.property}`, sub: `${item.realtor} • ${item.request} • ${item.feedback}`, value: item.date, status: item.attendance }))} /></Panel><Panel title="Knowledge Hub" description="Property documents, FAQs, sales guides, videos, images and location insights."><DataList rows={[{ title: "Property Documents", sub: "Survey, title, allocation, deed and layout files", value: "186", status: "Stored" }, { title: "FAQs", sub: "Product questions and objection answers", value: "74", status: "Published" }, { title: "Sales Guides", sub: "Price, payment plan, inspection pitch and sales positioning", value: "42", status: "Ready" }, { title: "Location Insights", sub: "Road access, development, landmarks and ROI positioning", value: "31", status: "Ready" }]} /></Panel></div>
    </section>
  );
}

function FrontDesk({ visitors, setModal, checkoutVisitor, notify }: { visitors: VisitorRecord[]; setModal: (modal: ModalType) => void; checkoutVisitor: (id: number) => void; notify: (msg: string) => void }) {
  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4"><MetricCard title="Visitors Today" value="34" change="3 waiting" /><MetricCard title="Clock-ins" value="117" change="7 late" /><MetricCard title="Passes Issued" value="28" change="Today" /><MetricCard title="Monthly Visits" value="841" change="Analytics" /></div>
      <div className="grid gap-6 xl:grid-cols-2"><Panel title="Attendance System" description="Clock-in, clock-out, attendance reports and late arrival tracking." action={<PrimaryButton onClick={() => notify("Clock-in recorded.")}>Clock In Staff</PrimaryButton>}><DataList rows={[{ title: "Operations Team", sub: "31 clock-ins • 2 late arrivals", value: "96%", status: "On time" }, { title: "Sales Team", sub: "49 clock-ins • 4 late arrivals", value: "91%", status: "Review" }, { title: "Front Desk", sub: "8 clock-ins • 0 late arrivals", value: "100%", status: "On time" }]} /></Panel><Panel title="Visitor Management" description="Visitor name, phone, email, purpose, department, staff visited, check-in/out time and pass number." action={<PrimaryButton onClick={() => setModal("visitor")}>Register Visitor</PrimaryButton>}><div className="space-y-3">{visitors.map((visitor) => <div key={visitor.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-black">{visitor.name}</p><p className="text-sm font-semibold text-slate-500">{visitor.phone} • {visitor.email}</p><p className="text-sm font-semibold text-slate-500">{visitor.purpose} • {visitor.department} • {visitor.staff}</p><p className="mt-1 text-xs font-black text-[#ef3b24]">{visitor.pass} • {visitor.checkIn}</p></div><button onClick={() => checkoutVisitor(visitor.id)}><Badge tone={visitor.status === "Checked Out" ? "green" : "red"}>{visitor.status}</Badge></button></div></div>)}</div></Panel></div>
      <Panel title="Visitor Reports" description="Daily visitor report, monthly visitor report and visitor analytics."><div className="flex flex-wrap gap-2">{["Daily Visitor Report", "Monthly Visitor Report", "Visitor Analytics"].map((item) => <SecondaryButton key={item} onClick={() => notify(`${item} generated.`)}>{item}</SecondaryButton>)}</div></Panel>
    </section>
  );
}

function MediaModule({ content, setModal, advanceContent, notify }: { content: ContentRecord[]; setModal: (modal: ModalType) => void; advanceContent: (id: number) => void; notify: (msg: string) => void }) {
  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4"><MetricCard title="Scheduled Content" value="31" change="Daily/weekly/monthly" /><MetricCard title="Active Campaigns" value="6" change="₦8.7M budget" /><MetricCard title="Leads Generated" value="428" change="Attributed" /><MetricCard title="Engagement" value="12.8%" change="Average" /></div>
      <Panel title="Content Scheduler" description="Upload videos, upload flyers/images, create captions, select date/time and publish to Facebook, Instagram, TikTok, YouTube, LinkedIn and X." action={<PrimaryButton onClick={() => setModal("content")}>Create Content</PrimaryButton>}>
        <div className="mb-5 flex flex-wrap gap-2">{socialPlatforms.map((platform) => <Badge key={platform} tone="slate">{platform}</Badge>)}</div>
        <div className="grid gap-4 xl:grid-cols-3">{content.map((item) => <div key={item.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-5"><Badge tone="red">{item.status}</Badge><h3 className="mt-4 text-lg font-black">{item.title}</h3><p className="mt-1 text-sm font-semibold text-slate-500">{item.format} • {item.campaign}</p><p className="mt-2 text-sm font-bold text-slate-700">{item.publishAt}</p><div className="mt-4 flex flex-wrap gap-2">{item.platforms.map((platform) => <Badge key={platform} tone="slate">{platform}</Badge>)}</div><div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs font-black"><div className="rounded-2xl bg-white p-3"><p>{item.reach.toLocaleString()}</p><p className="text-slate-400">Reach</p></div><div className="rounded-2xl bg-white p-3"><p>{item.engagement.toLocaleString()}</p><p className="text-slate-400">Engage</p></div><div className="rounded-2xl bg-white p-3"><p>{item.leads}</p><p className="text-slate-400">Leads</p></div></div><button onClick={() => advanceContent(item.id)} className="mt-4 w-full rounded-2xl bg-[#111111] px-4 py-3 text-sm font-black text-white">Advance Workflow</button></div>)}</div>
      </Panel>
      <div className="grid gap-6 xl:grid-cols-3"><Panel title="Publishing Workflow" description="Draft → Review → Approval → Scheduled → Published"><Workflow /></Panel><Panel title="Blog Management" description="Create articles, save drafts, publish articles and categorize content."><DataList rows={[{ title: "Investment Education", sub: "Category: RealtyPin", value: "12", status: "Published" }, { title: "Property Buying Guide", sub: "Category: Sales Enablement", value: "8", status: "Drafts" }, { title: "Market Updates", sub: "Category: Insights", value: "5", status: "Scheduled" }]} /></Panel><Panel title="Campaign Management" description="Campaign name, objective, budget, start date, end date and status."><DataList rows={[{ title: "Q3 Investment Push", sub: "Objective: Investor leads • Budget: ₦4.2M", value: "Active", status: "Ends Jul 30" }, { title: "Land Banking Awareness", sub: "Objective: Land sales • Budget: ₦2.1M", value: "Review", status: "Starts Jul 01" }, { title: "RealtyPin Education", sub: "Objective: Retention • Budget: ₦900k", value: "Active", status: "Always on" }]} /></Panel></div>
      <Panel title="Analytics and Reports" description="Reach, impressions, engagement, follower growth, leads generated and platform performance."><div className="grid gap-3 md:grid-cols-5">{["Daily Reports", "Weekly Reports", "Monthly Reports", "Campaign Reports", "Social Performance Reports"].map((item) => <SecondaryButton key={item} onClick={() => notify(`${item} generated.`)}>{item}</SecondaryButton>)}</div></Panel>
    </section>
  );
}

function ReportsCenter({ role, notify }: { role: Role; notify: (msg: string) => void }) {
  const base = ["Executive KPI Report", "Lead Conversion Report", "Branch Performance Report", "Realtor Productivity Report", "Investment Maturity Report", "Commission Report", "Customer Retention Report", "Property Approval Report", "Media Campaign Report", "Visitor Analytics Report"];
  const scoped = role === "Realtor" ? ["My Lead Report", "My Follow-Up Report", "My Inspection Report", "My Training Progress"] : role === "Investor" ? ["Investment Portfolio Report", "ROI Statement", "Maturity Schedule", "Cash-Out Status"] : base;
  return <section className="space-y-6"><div className="grid gap-4 md:grid-cols-3"><MetricCard title="PDF Exports" value="38" change="This month" /><MetricCard title="Excel Exports" value="64" change="Finance and sales" /><MetricCard title="CSV Exports" value="117" change="Operational data" /></div><Panel title="Reports Center" description="Generate PDF, Excel and CSV exports based on role scope."><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{scoped.map((report) => <div key={report} className="rounded-3xl border border-slate-100 bg-slate-50 p-5"><h3 className="font-black">{report}</h3><p className="mt-2 text-sm font-semibold leading-6 text-slate-500">Includes authorized data, filters, date range and export audit trail.</p><div className="mt-4 flex flex-wrap gap-2">{["PDF", "Excel", "CSV"].map((type) => <button key={type} onClick={() => notify(`${report} exported as ${type}.`)} className="rounded-full bg-white px-3 py-2 text-xs font-black text-slate-700 shadow-sm">{type}</button>)}</div></div>)}</div></Panel></section>;
}

function AIAutomation({ notify }: { notify: (msg: string) => void }) {
  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4"><MetricCard title="AI Lead Scores" value="1,284" change="Updated" /><MetricCard title="Predictions" value="426" change="Active" /><MetricCard title="Automations" value="72" change="Rules" /><MetricCard title="Alerts" value="19" change="Actionable" /></div>
      <div className="grid gap-6 xl:grid-cols-2"><Panel title="Smart Automation" description="Automatically perform lead assignment, task assignment, follow-up reminders, customer notifications and investment maturity alerts."><DataList rows={[{ title: "Lead Assignment", sub: "Assign hot leads by location, budget and realtor performance", value: "42", status: "Queued" }, { title: "Task Assignment", sub: "Route work to sales, care, product and front desk teams", value: "117", status: "Active" }, { title: "Follow-Up Reminders", sub: "Trigger alerts by next follow-up date and stage", value: "87", status: "Today" }, { title: "Customer Notifications", sub: "Welcome, birthday, festive, payment and maturity messages", value: "246", status: "Scheduled" }, { title: "Investment Maturity Alerts", sub: "30/14/7/2-day reminder schedule", value: "19", status: "Due" }]} /></Panel><Panel title="AI Features" description="Lead scoring, conversion prediction, realtor performance prediction and customer retention prediction." action={<PrimaryButton onClick={() => notify("AI recommendations refreshed.")}>Refresh AI Recommendations</PrimaryButton>}><DataList rows={[{ title: "AI Lead Scoring", sub: "Lead behaviour, engagement, budget and follow-up activity", value: "84%", status: "Probability to buy" }, { title: "AI Conversion Prediction", sub: "Chance of closing and recommended follow-up action", value: "High", status: "Inspection advised" }, { title: "AI Realtor Performance Prediction", sub: "Top closers, at-risk realtors and recruitment potential", value: "12", status: "At risk" }, { title: "AI Customer Retention Prediction", sub: "Churn risk, reinvestment probability and upsell opportunities", value: "28", status: "Upsell ready" }]} /></Panel></div>
    </section>
  );
}

function Administration({ notify, setModal }: { notify: (msg: string) => void; setModal: (modal: ModalType) => void }) {
  const permissionGroups = ["Create Users", "Edit Users", "Disable Users", "Reset Passwords", "Role-Based Permission System", "Email Login", "Phone Login", "Google Login", "OTP Verification", "Two-Factor Authentication", "Supabase PostgreSQL", "Row Level Security", "REST APIs", "GraphQL Support", "Secure File Storage", "Audit Logs"];
  return <section className="space-y-6"><Panel title="User Management" description="Create users, edit users, disable users and reset passwords." action={<PrimaryButton onClick={() => setModal("user")}>Create User</PrimaryButton>}><DataList rows={users.map((u) => ({ title: `${u.name} • ${u.role}`, sub: `${u.department} • ${u.security}`, value: u.status, status: u.role }))} /></Panel><Panel title="Access Control and System Requirements" description="Enterprise-grade authentication, RBAC, Supabase PostgreSQL, RLS, REST, GraphQL, storage and audit controls."><div className="grid gap-3 md:grid-cols-4">{permissionGroups.map((item) => <button key={item} onClick={() => notify(`${item} configuration opened.`)} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-left text-sm font-black transition hover:bg-white hover:shadow-sm">{item}</button>)}</div></Panel></section>;
}

function AuditLogs() {
  const logs = ["Super Admin enabled 2FA policy for management roles", "COO exported investment maturity report", "CSMO reassigned 42 hot leads to high-performing realtors", "Product Manager approved Azure Court Phase II publishing", "Customer Care queued 14-day maturity reminders", "Front Desk Officer checked out visitor pass RP-1024"];
  return <Panel title="Audit Logs" description="Every sensitive action is tracked with user, role, timestamp, IP/device and affected record."><div className="space-y-3">{logs.map((log, index) => <div key={log} className="rounded-3xl border border-slate-100 bg-slate-50 p-4"><p className="font-black">{log}</p><p className="mt-1 text-xs font-semibold text-slate-500">Today • {String(9 + index).padStart(2, "0")}:15 AM • Signed event #{10241 + index}</p></div>)}</div></Panel>;
}

function BranchTable() {
  return <div className="overflow-x-auto"><table className="w-full min-w-[850px] text-sm"><thead><tr className="border-b text-xs uppercase tracking-widest text-slate-400">{["Branch", "Total", "Active", "Dormant", "Leads", "Inspections", "Referrals", "Sales", "BOE", "Score"].map((h) => <th key={h} className="py-3 pr-4 text-left font-black">{h}</th>)}</tr></thead><tbody>{branches.map((b) => <tr key={b.name} className="border-b border-slate-100"><td className="py-4 pr-4 font-black">{b.name}</td><td className="py-4 pr-4">{b.total}</td><td className="py-4 pr-4 text-green-700 font-black">{b.active}</td><td className="py-4 pr-4 text-red-600 font-black">{b.dormant}</td><td className="py-4 pr-4">{b.leads}</td><td className="py-4 pr-4">{b.inspections}</td><td className="py-4 pr-4">{b.referrals}</td><td className="py-4 pr-4 font-black">{b.sales}</td><td className="py-4 pr-4">{b.boe}</td><td className="py-4 pr-4"><Badge tone="red">{b.score}%</Badge></td></tr>)}</tbody></table></div>;
}

function Workflow() { return <div className="space-y-3">{["Draft", "Review", "Approval", "Scheduled", "Published"].map((step, index) => <div key={step} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3"><span className="grid h-8 w-8 place-items-center rounded-full bg-[#ef3b24] text-xs font-black text-white">{index + 1}</span><p className="font-black">{step}</p></div>)}</div>; }
function Timeline({ items }: { items: string[] }) { return <div className="space-y-3">{items.map((item) => <div key={item} className="rounded-3xl bg-slate-50 p-4 text-sm font-bold text-slate-700">{item}</div>)}</div>; }
function DataList({ rows }: { rows: { title: string; sub: string; value?: string; status: string }[] }) { return <div className="space-y-3">{rows.map((row) => <div key={`${row.title}${row.status}`} className="rounded-3xl border border-slate-100 bg-slate-50 p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-black">{row.title}</p><p className="mt-1 text-sm font-semibold leading-6 text-slate-500">{row.sub}</p></div><div className="text-right"><p className="font-black text-[#ef3b24]">{row.value}</p><Badge tone="slate">{row.status}</Badge></div></div></div>)}</div>; }
function ProgressItem({ label, value }: { label: string; value: number }) { return <div className="rounded-3xl bg-slate-50 p-4"><div className="flex items-center justify-between gap-3"><p className="text-sm font-black">{label}</p><p className="text-sm font-black text-[#ef3b24]">{value}%</p></div><div className="mt-3 h-2 rounded-full bg-slate-200"><div className="h-2 rounded-full bg-[#ef3b24]" style={{ width: `${value}%` }} /></div></div>; }
function MetricCard({ title, value, change }: { title: string; value: string; change: string }) { return <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm"><p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">{title}</p><p className="mt-3 text-3xl font-black tracking-tight">{value}</p><p className="mt-2 text-sm font-bold text-[#ef3b24]">{change}</p></div>; }
function Panel({ title, description, action, children }: { title: string; description?: string; action?: React.ReactNode; children?: React.ReactNode }) { return <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm md:p-6"><div className="mb-5 flex flex-wrap items-start justify-between gap-4"><div><h2 className="text-xl font-black">{title}</h2>{description && <p className="mt-1 max-w-4xl text-sm font-semibold leading-6 text-slate-500">{description}</p>}</div>{action}</div>{children}</section>; }
function PrimaryButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) { return <button onClick={onClick} className="rounded-2xl bg-[#ef3b24] px-4 py-3 text-sm font-black text-white shadow-lg shadow-red-100 transition hover:-translate-y-0.5 hover:bg-[#d92f1d]">{children}</button>; }
function SecondaryButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) { return <button onClick={onClick} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-red-200 hover:text-[#ef3b24]">{children}</button>; }
function Badge({ children, tone = "slate" }: { children: React.ReactNode; tone?: Tone }) { const cls: Record<Tone, string> = { red: "bg-red-50 text-red-700", green: "bg-green-50 text-green-700", amber: "bg-amber-50 text-amber-700", blue: "bg-blue-50 text-blue-700", purple: "bg-purple-50 text-purple-700", slate: "bg-slate-100 text-slate-700", dark: "bg-[#111111] text-white" }; return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${cls[tone]}`}>{children}</span>; }

function AppModal({ modal, close, setLeads, setContent, setVisitors, setProperties, notify, role }: { modal: ModalType; close: () => void; setLeads: React.Dispatch<React.SetStateAction<LeadRecord[]>>; setContent: React.Dispatch<React.SetStateAction<ContentRecord[]>>; setVisitors: React.Dispatch<React.SetStateAction<VisitorRecord[]>>; setProperties: React.Dispatch<React.SetStateAction<PropertyRecord[]>>; notify: (msg: string) => void; role: Role }) {
  const [leadName, setLeadName] = useState("");
  const [contentTitle, setContentTitle] = useState("");
  const [visitorName, setVisitorName] = useState("");
  const [propertyTitle, setPropertyTitle] = useState("");
  if (!modal) return null;
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (modal === "lead") {
      setLeads((prev) => [{ id: Date.now(), name: leadName || "New Qualified Lead", phone: "+234 800 000 0000", email: "lead@client.ng", source: "Website", assignedRealtor: "Tunde Bello", budget: "₦20M – ₦50M", propertyType: "Residential", state: "Lagos", city: "Lekki", area: "Phase 1", purpose: "Investment", timeline: "Immediate", score: "Hot", status: "New Lead", method: "WhatsApp", lastContact: "Just now", nextFollowUp: "Tomorrow, 10:00 AM", objection: "Other", notes: `Created by ${role}.` }, ...prev]);
      notify("Qualified lead created.");
    }
    if (modal === "content") {
      setContent((prev) => [{ id: Date.now(), title: contentTitle || "New Campaign Content", format: "Flyer/Image", platforms: ["Facebook", "Instagram", "LinkedIn"], campaign: "New Property Campaign", publishAt: "Tomorrow, 9:00 AM", status: "Draft", reach: 0, engagement: 0, leads: 0 }, ...prev]);
      notify("Content added to scheduler.");
    }
    if (modal === "visitor") {
      setVisitors((prev) => [{ id: Date.now(), name: visitorName || "New Visitor", phone: "+234 800 000 0000", email: "visitor@example.com", purpose: "Consultation", department: "Sales", staff: "Front Desk Assignment", pass: `RP-${Math.floor(Math.random() * 9000) + 1000}`, checkIn: "Now", checkOut: "", status: "Checked In" }, ...prev]);
      notify("Visitor registered and pass issued.");
    }
    if (modal === "property") {
      setProperties((prev) => [{ id: Date.now(), title: propertyTitle || "New Property Record", type: "Residential", location: "Lagos", price: "₦45M", status: "Under Review", workflow: "Submission", media: "Pending upload", documents: "Pending upload", guide: "Product information submitted for review." }, ...prev]);
      notify("Property submitted for review.");
    }
    if (modal === "user") notify("User creation request saved.");
    if (modal === "learning") notify("Learning resource added.");
    close();
  };
  const title: Record<Exclude<ModalType, null>, string> = { lead: "Create Qualified Lead", content: "Create Content Schedule", visitor: "Register Visitor", property: "Add Property Record", user: "Create User", learning: "Add Learning Resource" };
  return <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 p-4 backdrop-blur-sm"><form onSubmit={submit} className="w-full max-w-xl rounded-[2rem] bg-white p-6 shadow-2xl"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.24em] text-[#ef3b24]">REPROS CRM</p><h2 className="mt-1 text-2xl font-black">{title[modal]}</h2></div><button type="button" onClick={close} className="rounded-full bg-slate-100 px-3 py-2 text-sm font-black">Close</button></div><div className="mt-6 grid gap-3">{modal === "lead" && <><Input label="Lead Name" value={leadName} setValue={setLeadName} /><Input label="Phone Number" /><Input label="Email" /><Select label="Budget Range" options={budgetRanges} /><Select label="Property Type" options={propertyTypes} /><Select label="Purpose" options={purposes} /><Select label="Timeline" options={timelines} /><Select label="Lead Score" options={leadScores} /><Select label="Objection Category" options={objectionCategories} /></>}{modal === "content" && <><Input label="Content Title" value={contentTitle} setValue={setContentTitle} /><Select label="Content Format" options={["Video", "Flyer/Image", "Blog Article"]} /><Select label="Publishing Platform" options={socialPlatforms} /><Input label="Caption" /><Input label="Publishing Date and Time" /></>}{modal === "visitor" && <><Input label="Visitor Name" value={visitorName} setValue={setVisitorName} /><Input label="Phone Number" /><Input label="Email Address" /><Input label="Purpose of Visit" /><Input label="Department Visiting" /><Input label="Staff Being Visited" /></>}{modal === "property" && <><Input label="Property Name" value={propertyTitle} setValue={setPropertyTitle} /><Select label="Property Status" options={["Available", "Reserved", "Sold", "Under Review"]} /><Input label="Pricing" /><Input label="Location Data" /><Input label="Property Documents" /></>}{modal === "user" && <><Input label="Full Name" /><Input label="Email Address" /><Select label="Role" options={roles} /><Select label="Authentication" options={["Email Login", "Phone Login", "Google Login", "OTP Verification", "Two-Factor Authentication"]} /></>}{modal === "learning" && <><Input label="Resource Title" /><Select label="Resource Type" options={["Training Videos", "BOE Recordings", "Sales Scripts", "Property Guides", "Marketing Templates"]} /><Select label="Assessment Type" options={["Quiz", "Exam", "Score", "Certificate"]} /></>}<button className="mt-3 rounded-2xl bg-[#ef3b24] px-5 py-4 text-sm font-black text-white">Save Record</button></div></form></div>;
}
function Input({ label, value, setValue }: { label: string; value?: string; setValue?: (value: string) => void }) { return <label className="grid gap-2 text-sm font-black text-slate-700">{label}<input value={value} onChange={(e) => setValue?.(e.target.value)} aria-label={label} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold outline-none focus:border-[#ef3b24] focus:bg-white" /></label>; }
function Select({ label, options }: { label: string; options: readonly string[] }) { return <label className="grid gap-2 text-sm font-black text-slate-700">{label}<select className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold outline-none focus:border-[#ef3b24] focus:bg-white">{options.map((option) => <option key={option}>{option}</option>)}</select></label>; }

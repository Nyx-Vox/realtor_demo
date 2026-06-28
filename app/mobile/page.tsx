"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type Role = "Super Admin" | "COO" | "CSMO" | "Customer Care" | "Product Manager" | "Media Team" | "Branch Manager" | "Realtor" | "Investor" | "Front Desk Officer";
type Tab = "home" | "work" | "records" | "learning" | "reports" | "me";
type Tone = "red" | "green" | "amber" | "blue" | "slate" | "dark";

type Profile = {
  title: string;
  subtitle: string;
  scope: string;
  metrics: [string, string, string][];
  work: string[];
  records: string[];
  learning: string[];
  reports: string[];
  permissions: string[];
};

const roles: Role[] = ["Super Admin", "COO", "CSMO", "Customer Care", "Product Manager", "Media Team", "Branch Manager", "Realtor", "Investor", "Front Desk Officer"];

const profiles: Record<Role, Profile> = {
  "Super Admin": {
    title: "System Administration",
    subtitle: "Full platform control",
    scope: "Users, roles, permissions, audit logs, reports, security and system configuration.",
    metrics: [["Users", "612", "Active"], ["Branches", "37", "Live"], ["Audit Flags", "4", "Review"]],
    work: ["Approve role access requests", "Review sensitive export activity", "Verify Supabase RLS policy coverage", "Check database backup status", "Reset user password"],
    records: ["User management", "Role-based permission matrix", "Audit log entries", "System settings", "Authentication policies"],
    learning: ["Admin security policy", "RLS access guide", "Data protection checklist"],
    reports: ["User Access Report", "Audit Activity Report", "System Health Report", "Executive KPI Report"],
    permissions: ["All modules", "User management", "Role management", "Audit logs", "Security settings", "All exports"],
  },
  COO: {
    title: "COO Operations",
    subtitle: "Customers, commissions and investments",
    scope: "Centralized customer database, commission management, RealtyPin investments, ROI and cash-out reviews.",
    metrics: [["Pending Payout", "₦72.5M", "31 records"], ["Maturities", "19", "30 days"], ["Cash-Out", "6", "Review"]],
    work: ["Review commission approval batch", "Open investor maturity schedule", "Approve cash-out request", "Review customer transaction history", "Escalate product approval delay"],
    records: ["Customer profiles", "Realtor commissions", "Referral commissions", "Investment records", "ROI earned", "Payment history"],
    learning: ["Operations approval SOP", "Investor communication guide", "Commission policy"],
    reports: ["Commission Report", "Investment Maturity Report", "Cash-Out Request Report", "Customer Database Report"],
    permissions: ["Operations dashboard", "Customer database", "Commission approval", "Investment management", "Reports export"],
  },
  CSMO: {
    title: "CSMO Sales",
    subtitle: "Qualification, objections and follow-ups",
    scope: "Lead qualification engine, objection management, follow-up tracking and sales performance analytics.",
    metrics: [["Hot Leads", "314", "+18%"], ["Follow-ups", "87", "Today"], ["Win Rate", "22.4%", "+3.1%"]],
    work: ["Create qualified lead", "Assign hot lead to realtor", "Update objection category", "Generate objection frequency report", "Review sales team performance", "Move lead to inspection scheduled"],
    records: ["Lead profile", "Budget range", "Property type", "State, city and area", "Purpose", "Timeline", "Lead score", "Lead status", "Follow-up notes"],
    learning: ["Objection handling playbook", "Lead qualification guide", "Sales team coaching pack"],
    reports: ["Objection Frequency Report", "Conversion Report", "Sales Team Performance Report", "Follow-Up Discipline Report"],
    permissions: ["Sales dashboard", "Lead qualification", "Objection analytics", "Follow-up management", "Sales reports"],
  },
  "Customer Care": {
    title: "Customer Care",
    subtitle: "Client engagement and retention",
    scope: "Investment reminders, payment notifications, welcome messages, birthdays, festive greetings and VIP client management.",
    metrics: [["Reminders", "42", "Today"], ["VIP Clients", "18", "₦10M+"], ["SLA", "96%", "On time"]],
    work: ["Send 14-day investment maturity reminder", "Send outstanding balance reminder", "Confirm payment notification", "Send birthday message", "Update VIP client note"],
    records: ["Top investors", "Top returning clients", "VIP customer dashboard", "Customer communication history", "Monthly retention records"],
    learning: ["Customer appreciation templates", "VIP client handling guide", "Maturity call script"],
    reports: ["Monthly Customer Care Report", "Quarterly VIP Report", "Annual Retention Report", "Payment Notification Report"],
    permissions: ["Customer care dashboard", "Client reminders", "VIP client view", "Communication records", "Care reports"],
  },
  "Product Manager": {
    title: "Product Management",
    subtitle: "Properties, approvals and inspections",
    scope: "Property status, media, documents, approval workflow, inspection tracking and product knowledge hub.",
    metrics: [["Properties", "48", "Inventory"], ["Under Review", "7", "Approval"], ["Inspections", "23", "This week"]],
    work: ["Approve property submission", "Request document revision", "Schedule inspection", "Upload property video", "Update location insight"],
    records: ["Property details", "Images", "Videos", "Documents", "Pricing", "Location data", "Inspection reports", "Sales guides"],
    learning: ["Product upload standard", "Property documentation guide", "Inspection report template"],
    reports: ["Property Status Report", "Inspection Attendance Report", "Approval Workflow Report", "Knowledge Hub Report"],
    permissions: ["Property management", "Approval workflow", "Inspection management", "Knowledge hub", "Product reports"],
  },
  "Media Team": {
    title: "Media Management",
    subtitle: "Content, campaigns and social analytics",
    scope: "Schedule videos, flyers, captions, blogs and campaigns across Facebook, Instagram, TikTok, YouTube, LinkedIn and X.",
    metrics: [["Posts", "31", "Scheduled"], ["Campaigns", "6", "Active"], ["Leads", "428", "Attributed"]],
    work: ["Create content schedule", "Upload flyer/image", "Upload video", "Submit content for approval", "Publish approved campaign", "Review platform performance"],
    records: ["Content calendar", "Blog drafts", "Campaign budget", "Reach", "Impressions", "Engagement", "Follower growth", "Leads generated"],
    learning: ["Brand content guide", "Campaign reporting SOP", "Platform publishing checklist"],
    reports: ["Daily Social Report", "Weekly Social Report", "Monthly Social Report", "Campaign Report", "Platform Performance Report"],
    permissions: ["Media calendar", "Content scheduler", "Blog management", "Campaign management", "Social reports"],
  },
  "Branch Manager": {
    title: "Branch Management",
    subtitle: "Branch performance and realtor activity",
    scope: "Branch dashboard, realtor rankings, recruitment tracker, reactivation campaigns and BOE attendance.",
    metrics: [["Realtors", "84", "Lekki"], ["Leads", "488", "Branch"], ["Sales", "41", "Closed"]],
    work: ["Review branch leaderboard", "Create reactivation campaign", "Approve referral reward", "Check BOE attendance", "Coach dormant realtor"],
    records: ["Active realtors", "Dormant realtors", "Recruitment records", "Referral rewards", "Top closers", "Top recruiters"],
    learning: ["Branch coaching guide", "Realtor onboarding path", "BOE management checklist"],
    reports: ["Branch Ranking Report", "Dormant Realtor Report", "Recruitment Conversion Report", "BOE Attendance Report"],
    permissions: ["Branch dashboard", "Branch leads", "Branch realtors", "Reactivation", "Branch reports"],
  },
  Realtor: {
    title: "Realtor Workspace",
    subtitle: "Leads, follow-ups and learning",
    scope: "Assigned leads, property viewing, follow-up management, inspection schedule, notifications and learning hub.",
    metrics: [["My Leads", "17", "Assigned"], ["Hot Leads", "5", "Priority"], ["Inspections", "4", "This week"]],
    work: ["Call hot lead", "Update follow-up note", "Schedule property inspection", "Open property guide", "Complete sales quiz", "Download marketing template"],
    records: ["My lead profile", "Budget range", "Property interest", "Follow-up method", "Lead status", "Inspection feedback"],
    learning: ["Training videos", "BOE recordings", "Sales scripts", "Property guides", "Marketing templates", "Certificates"],
    reports: ["My Lead Report", "My Follow-Up Report", "My Inspection Report", "Training Completion Report"],
    permissions: ["Own leads", "Own follow-ups", "Property viewing", "Learning hub", "Own reports"],
  },
  Investor: {
    title: "Investor Portfolio",
    subtitle: "RealtyPin investments and ROI",
    scope: "Total investment, active investments, ROI earned, upcoming maturity dates and cash-out requests.",
    metrics: [["Investment", "₦142M", "Total"], ["ROI", "₦18.4M", "Earned"], ["Maturity", "14 days", "Upcoming"]],
    work: ["Review portfolio", "Open ROI statement", "Request cash-out", "Confirm maturity reminder", "Download investment documents"],
    records: ["Active investments", "ROI history", "Maturity schedule", "Cash-out requests", "Investment documents"],
    learning: ["RealtyPin investment guide", "Maturity process", "Cash-out policy"],
    reports: ["Investment Portfolio Report", "ROI Statement", "Maturity Schedule", "Cash-Out Request Status"],
    permissions: ["Own investment records", "Own ROI", "Own documents", "Own reports"],
  },
  "Front Desk Officer": {
    title: "Front Desk",
    subtitle: "Visitors and attendance",
    scope: "Clock-in, clock-out, attendance reports, late arrivals, visitor registration, check-in/out and pass numbers.",
    metrics: [["Visitors", "34", "Today"], ["Clock-ins", "117", "Staff"], ["Late", "7", "Review"]],
    work: ["Register visitor", "Issue visitor pass", "Check visitor out", "Clock in staff", "Generate daily visitor report"],
    records: ["Visitor name", "Phone", "Email", "Purpose", "Department", "Staff visited", "Check-in", "Check-out", "Pass number"],
    learning: ["Reception SOP", "Visitor privacy guide", "Emergency contact checklist"],
    reports: ["Daily Visitor Report", "Monthly Visitor Report", "Visitor Analytics", "Attendance Report"],
    permissions: ["Visitor management", "Attendance system", "Daily reports", "Monthly reports"],
  },
};

const tabs: { key: Tab; label: string; icon: string }[] = [
  { key: "home", label: "Home", icon: "⌂" },
  { key: "work", label: "Work", icon: "✓" },
  { key: "records", label: "Records", icon: "▤" },
  { key: "learning", label: "Learn", icon: "◫" },
  { key: "reports", label: "Reports", icon: "↧" },
  { key: "me", label: "Me", icon: "◉" },
];

export default function MobilePage() {
  const [role, setRole] = useState<Role>("Realtor");
  const [tab, setTab] = useState<Tab>("home");
  const [toast, setToast] = useState("");
  const [signedIn, setSignedIn] = useState(true);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search).get("role") as Role | null;
    const saved = window.localStorage.getItem("repros-role") as Role | null;
    if (query && roles.includes(query)) setRole(query);
    else if (saved && roles.includes(saved)) setRole(saved);
  }, []);

  const profile = profiles[role];
  const notify = (msg: string) => { setToast(msg); window.setTimeout(() => setToast(""), 2300); };
  const signIn = () => { window.localStorage.setItem("repros-role", role); setSignedIn(true); notify(`${role} mobile workspace opened.`); };
  const logout = () => { setSignedIn(false); setTab("home"); notify("Signed out."); };

  if (!signedIn) {
    return (
      <main className="min-h-screen bg-[#111111] px-5 py-8 text-white">
        <section className="mx-auto max-w-md">
          <div className="rounded-[2rem] bg-white p-4 shadow-2xl">
            <Image src="/logo-realtypros.jpeg" alt="RealtyPros logo" width={260} height={80} className="mx-auto h-16 w-auto object-contain" />
          </div>
          <p className="mt-8 text-xs font-black uppercase tracking-[0.32em] text-red-200">Android / iOS Application</p>
          <h1 className="mt-3 text-4xl font-black leading-tight">REPROS Mobile</h1>
          <p className="mt-3 text-sm font-semibold leading-7 text-white/65">Select your role to open a secured mobile workspace with bottom navigation and role-based access.</p>
          <div className="mt-6 grid gap-3">
            {roles.map((item) => <button key={item} onClick={() => setRole(item)} className={`rounded-3xl border p-4 text-left ${role === item ? "border-[#ef3b24] bg-[#ef3b24]" : "border-white/10 bg-white/10"}`}><p className="font-black">{item}</p><p className="mt-1 text-xs font-semibold text-white/70">{profiles[item].subtitle}</p></button>)}
          </div>
          <button onClick={signIn} className="mt-6 w-full rounded-3xl bg-[#ef3b24] px-5 py-4 text-sm font-black text-white">Open Mobile Workspace</button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#111111] px-3 py-4 text-slate-950 sm:px-5">
      <section className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-md flex-col overflow-hidden rounded-[2.4rem] border border-white/10 bg-slate-100 shadow-2xl shadow-black/40">
        <header className="bg-[#111111] px-5 pb-5 pt-6 text-white">
          <div className="flex items-center justify-between gap-3">
            <div className="rounded-2xl bg-white p-2"><Image src="/logo-realtypros.jpeg" alt="RealtyPros" width={130} height={44} className="h-9 w-auto object-contain" /></div>
            <button onClick={logout} className="rounded-full bg-white/10 px-3 py-2 text-xs font-black">Logout</button>
          </div>
          <div className="mt-6 flex items-start justify-between gap-4">
            <div><p className="text-[10px] font-black uppercase tracking-[0.24em] text-red-200">{role}</p><h1 className="mt-1 text-2xl font-black">{profile.title}</h1><p className="mt-2 text-sm font-semibold leading-6 text-white/60">{profile.subtitle}</p></div>
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#ef3b24] text-xl font-black">R</div>
          </div>
        </header>

        <section className="rp-mobile-scroll flex-1 overflow-y-auto p-4 pb-28">
          {tab === "home" && <HomeTab profile={profile} notify={notify} />}
          {tab === "work" && <ListTab title="Work Queue" description={profile.scope} items={profile.work} cta="Complete Action" notify={notify} />}
          {tab === "records" && <RecordsTab role={role} profile={profile} notify={notify} />}
          {tab === "learning" && <ListTab title="Learning Hub" description="Training videos, BOE recordings, sales scripts, property guides, marketing templates, assessments and certificates." items={profile.learning} cta="Open" notify={notify} />}
          {tab === "reports" && <ReportsTab profile={profile} notify={notify} />}
          {tab === "me" && <ProfileTab role={role} profile={profile} logout={logout} />}
        </section>

        <nav className="fixed bottom-4 left-1/2 z-40 grid w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 grid-cols-6 gap-1 rounded-[1.7rem] border border-slate-200 bg-white p-2 shadow-2xl shadow-black/20 sm:bottom-6 sm:w-[26rem]">
          {tabs.map((item) => <button key={item.key} onClick={() => setTab(item.key)} className={`rounded-2xl px-1 py-2 text-center transition ${tab === item.key ? "bg-[#ef3b24] text-white" : "text-slate-500"}`}><span className="block text-lg font-black leading-none">{item.icon}</span><span className="mt-1 block text-[10px] font-black">{item.label}</span></button>)}
        </nav>
      </section>
      {toast && <div className="fixed left-1/2 top-5 z-50 -translate-x-1/2 rounded-full bg-white px-4 py-3 text-xs font-black text-slate-900 shadow-2xl">{toast}</div>}
    </main>
  );
}

function HomeTab({ profile, notify }: { profile: Profile; notify: (msg: string) => void }) {
  return <div className="space-y-4"><div className="rounded-[2rem] bg-white p-5 shadow-sm"><p className="text-xs font-black uppercase tracking-[0.24em] text-[#ef3b24]">Today</p><h2 className="mt-2 text-2xl font-black">{profile.scope}</h2><p className="mt-3 text-sm font-semibold leading-7 text-slate-500">Use the bottom menu to manage actions, records, learning, reports and profile access.</p></div><div className="grid grid-cols-3 gap-3">{profile.metrics.map(([label, value, change]) => <div key={label} className="rounded-3xl bg-white p-4 shadow-sm"><p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p><p className="mt-2 text-xl font-black">{value}</p><p className="mt-1 text-[11px] font-black text-[#ef3b24]">{change}</p></div>)}</div><div className="space-y-3">{profile.work.slice(0, 3).map((item) => <button key={item} onClick={() => notify(`${item} opened.`)} className="w-full rounded-3xl bg-white p-4 text-left shadow-sm"><p className="font-black">{item}</p><p className="mt-1 text-xs font-semibold text-slate-500">Tap to process this task</p></button>)}</div></div>;
}

function ListTab({ title, description, items, cta, notify }: { title: string; description: string; items: string[]; cta: string; notify: (msg: string) => void }) {
  return <div className="space-y-4"><Header title={title} description={description} />{items.map((item, index) => <button key={item} onClick={() => notify(`${item} updated.`)} className="w-full rounded-3xl bg-white p-4 text-left shadow-sm"><div className="flex items-start gap-3"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-red-50 text-sm font-black text-[#ef3b24]">{index + 1}</span><div><p className="font-black">{item}</p><p className="mt-1 text-xs font-semibold text-slate-500">{cta}</p></div></div></button>)}</div>;
}

function RecordsTab({ role, profile, notify }: { role: Role; profile: Profile; notify: (msg: string) => void }) {
  const extra = role === "CSMO" ? ["Lead Name", "Phone Number", "Email", "Source", "Assigned Realtor", "Budget Range", "Property Type", "State", "City", "Area", "Purpose", "Timeline", "Lead Score", "Last Contact Date", "Next Follow-Up Date", "Follow-Up Method", "Follow-Up Notes", "Lead Status"] : [];
  return <div className="space-y-4"><Header title="Authorized Records" description="Records available to this role based on access scope." />{[...profile.records, ...extra].map((item) => <button key={item} onClick={() => notify(`${item} opened.`)} className="w-full rounded-3xl bg-white p-4 text-left shadow-sm"><p className="font-black">{item}</p><p className="mt-1 text-xs font-semibold text-slate-500">Role-scoped record</p></button>)}</div>;
}

function ReportsTab({ profile, notify }: { profile: Profile; notify: (msg: string) => void }) {
  return <div className="space-y-4"><Header title="Reports" description="Generate authorized PDF, Excel and CSV exports." />{profile.reports.map((report) => <div key={report} className="rounded-3xl bg-white p-4 shadow-sm"><p className="font-black">{report}</p><p className="mt-1 text-xs font-semibold text-slate-500">Includes filters, date range and audit tracking.</p><div className="mt-3 flex gap-2">{["PDF", "Excel", "CSV"].map((type) => <button key={type} onClick={() => notify(`${report} exported as ${type}.`)} className="rounded-full bg-slate-100 px-3 py-2 text-[11px] font-black text-slate-700">{type}</button>)}</div></div>)}</div>;
}

function ProfileTab({ role, profile, logout }: { role: Role; profile: Profile; logout: () => void }) {
  return <div className="space-y-4"><Header title="Profile & Permissions" description={`${role} account access and mobile app settings.`} /><div className="rounded-3xl bg-white p-5 shadow-sm"><p className="font-black">{role}</p><p className="mt-2 text-sm font-semibold leading-6 text-slate-500">{profile.scope}</p></div><div className="rounded-3xl bg-white p-5 shadow-sm"><p className="font-black">Permissions</p><div className="mt-3 flex flex-wrap gap-2">{profile.permissions.map((item) => <Badge key={item}>{item}</Badge>)}</div></div><div className="rounded-3xl bg-white p-5 shadow-sm"><p className="font-black">Mobile Settings</p><div className="mt-3 space-y-3">{["Push notifications enabled", "Offline drafts enabled", "Biometric unlock enabled", "Auto-sync on Wi-Fi", "Secure file access"].map((item) => <div key={item} className="flex items-center justify-between"><span className="text-sm font-semibold text-slate-600">{item}</span><span className="h-6 w-11 rounded-full bg-[#ef3b24] p-1"><span className="ml-auto block h-4 w-4 rounded-full bg-white" /></span></div>)}</div></div><button onClick={logout} className="w-full rounded-3xl bg-[#111111] px-5 py-4 text-sm font-black text-white">Logout</button></div>;
}

function Header({ title, description }: { title: string; description: string }) { return <div className="rounded-[2rem] bg-white p-5 shadow-sm"><h2 className="text-2xl font-black">{title}</h2><p className="mt-2 text-sm font-semibold leading-6 text-slate-500">{description}</p></div>; }
function Badge({ children, tone = "slate" }: { children: React.ReactNode; tone?: Tone }) { const cls: Record<Tone, string> = { red: "bg-red-50 text-red-700", green: "bg-green-50 text-green-700", amber: "bg-amber-50 text-amber-700", blue: "bg-blue-50 text-blue-700", slate: "bg-slate-100 text-slate-700", dark: "bg-[#111111] text-white" }; return <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-black ${cls[tone]}`}>{children}</span>; }

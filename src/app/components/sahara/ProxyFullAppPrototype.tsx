import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Home,
  Bell,
  Settings,
  ShieldCheck,
  Wifi,
  Activity,
  MessageCircleHeart,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  ChevronRight,
  ShieldAlert,
  BrainCircuit,
  ChevronLeft,
  Video,
  Lightbulb,
  Zap,
  Lock,
  EyeOff,
  Globe,
  User,
  ArrowRight,
  Loader2,
  KeyRound,
} from "lucide-react";
import * as Switch from "@radix-ui/react-switch";
import { flowSaharaLogo } from "./flows/flowLogo";

type RoutePath = "/" | "/dashboard" | "/alert" | "/alert/1" | "/settings";

export default function ProxyFullAppPrototype() {
  const [pathname, setPathname] = useState<RoutePath>("/");
  const [history, setHistory] = useState<RoutePath[]>(["/"]);

  const navigate = (to: string | number) => {
    if (typeof to === "number") {
      if (to === -1 && history.length > 1) {
        setHistory((previous) => previous.slice(0, -1));
        const fallback = history[history.length - 2] ?? "/dashboard";
        setPathname(fallback);
      }
      return;
    }

    const normalized = (
      to === "/alert/2" || to === "/alert/3" ? "/alert/1" : to
    ) as RoutePath;
    setHistory((previous) => [...previous, normalized]);
    setPathname(normalized);
  };

  const navItems = [
    { id: "dashboard", icon: Home, label: "Home", path: "/dashboard" },
    { id: "alert", icon: Bell, label: "Alerts", path: "/alert" },
    { id: "settings", icon: Settings, label: "Settings", path: "/settings" },
  ];

  const showBottomNav = pathname !== "/";

  return (
    <div className="relative flex h-full flex-col bg-neutral-50">
      <div className="flex-1 overflow-y-auto pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {pathname === "/" && <OnboardingScreen onNavigate={navigate} />}
            {pathname === "/dashboard" && <DashboardScreen />}
            {pathname === "/alert" && (
              <AlertsListScreen onNavigate={navigate} />
            )}
            {pathname === "/alert/1" && (
              <AlertDetailsScreen onNavigate={navigate} />
            )}
            {pathname === "/settings" && <SettingsScreen />}
          </motion.div>
        </AnimatePresence>
      </div>

      {showBottomNav && (
        <div className="absolute right-0 bottom-0 left-0 z-40 flex h-20 items-center justify-between rounded-b-[48px] border-t border-neutral-200 bg-white px-6 pt-2 pb-6 shadow-[0_-5px_15px_rgba(0,0,0,0.03)]">
          {navItems.map((item) => {
            const isActive = pathname.includes(item.path);
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className="flex min-w-[64px] flex-col items-center gap-1"
              >
                <div
                  className={`rounded-xl p-1.5 transition-all ${
                    isActive
                      ? "bg-[#00695C]/10 text-[#00695C]"
                      : "text-neutral-400"
                  }`}
                >
                  <Icon
                    className={`h-6 w-6 ${isActive ? "fill-[#00695C]/20" : ""}`}
                  />
                </div>
                <span
                  className={`text-[10px] font-semibold ${
                    isActive ? "text-[#00695C]" : "text-neutral-500"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function OnboardingScreen({
  onNavigate,
}: {
  onNavigate: (to: string | number) => void;
}) {
  const [step, setStep] = useState(1);
  const [elderName, setElderName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [language, setLanguage] = useState("English");
  const [pairingCode, setPairingCode] = useState("");

  const generateCode = () => {
    setPairingCode(Math.floor(1000 + Math.random() * 9000).toString());
    setStep(4);
  };

  const nextStep = () => {
    if (step === 3) {
      generateCode();
    } else {
      setStep(step + 1);
    }
  };

  const steps = [
    { id: 1, title: "Welcome to Proxy" },
    { id: 2, title: "Elder Profile" },
    { id: 3, title: "Assessment" },
    { id: 4, title: "Pairing" },
  ];

  return (
    <div className="flex h-full flex-col bg-white px-6 pt-20 pb-10">
      <div className="mb-8 flex items-center justify-center gap-2">
        {steps.map((stepItem) => (
          <div
            key={stepItem.id}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              step === stepItem.id
                ? "w-8 bg-[#00695C]"
                : step > stepItem.id
                  ? "w-4 bg-[#00695C]/30"
                  : "w-4 bg-neutral-200"
            }`}
          />
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex h-full flex-col"
            >
              <div className="flex flex-1 flex-col items-center justify-center text-center">
                <div className="mb-6 flex h-24 w-24 items-center justify-center overflow-hidden rounded-[2rem] border border-neutral-100 bg-neutral-50 shadow-sm">
                  <img
                    src={flowSaharaLogo}
                    alt="Sahara Logo"
                    className="h-full w-full object-cover"
                  />
                </div>
                <h1 className="mb-4 text-3xl font-bold tracking-tight text-neutral-900">
                  Sahara Proxy
                </h1>
                <p className="mb-8 px-4 text-[15px] leading-relaxed text-neutral-500">
                  Protect your elderly loved ones from digital scams. You handle
                  the setup, they stay safe.
                </p>

                <button
                  onClick={nextStep}
                  className="w-full rounded-2xl bg-[#00695C] py-4 text-lg font-semibold text-white shadow-lg shadow-[#00695C]/20 transition-all duration-200 hover:bg-[#005a4f] hover:shadow-xl hover:shadow-[#00695C]/30 active:scale-[0.98]"
                >
                  <span className="inline-flex items-center gap-2">
                    Get Started <ArrowRight className="h-5 w-5" />
                  </span>
                </button>
                <button className="mt-4 w-full font-semibold text-[#00695C]">
                  I already have an account
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex h-full flex-col"
            >
              <h2 className="mb-2 text-2xl font-bold text-neutral-900">
                Who are you protecting?
              </h2>
              <p className="mb-8 text-[15px] text-neutral-500">
                Help Sahara understand the context to provide better AI
                assistance.
              </p>

              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-neutral-700">
                    Elder's Name
                  </label>
                  <div className="relative">
                    <User className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="e.g. Aba, Ammi, John"
                      value={elderName}
                      onChange={(event) => setElderName(event.target.value)}
                      className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-3.5 pr-4 pl-12 outline-none transition-all focus:border-[#00695C] focus:ring-1 focus:ring-[#00695C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-neutral-700">
                    Relationship
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {["Parent", "Grandparent", "Spouse", "Other"].map(
                      (value) => (
                        <button
                          key={value}
                          onClick={() => setRelationship(value)}
                          className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all ${
                            relationship === value
                              ? "border-[#00695C] bg-[#00695C]/5 text-[#00695C]"
                              : "border-neutral-200 bg-white text-neutral-700 hover:border-[#00695C] hover:bg-[#00695C]/5 hover:text-[#00695C]"
                          }`}
                        >
                          {value}
                        </button>
                      ),
                    )}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-neutral-700">
                    Primary Language
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {["English", "Urdu (اردو)", "Roman Urdu"].map((value) => (
                      <button
                        key={value}
                        onClick={() => setLanguage(value)}
                        className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition-all ${
                          language === value
                            ? "border-2 border-[#00695C] bg-[#00695C]/5 text-[#00695C]"
                            : "border border-neutral-200 bg-white text-neutral-700 hover:border-[#00695C]"
                        }`}
                      >
                        <Globe className="h-4 w-4" /> {value}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-6">
                <button
                  onClick={nextStep}
                  disabled={!elderName.trim() || !relationship}
                  className="w-full rounded-2xl bg-[#00695C] py-4 text-lg font-semibold text-white shadow-lg shadow-[#00695C]/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:shadow-none"
                >
                  <span className="inline-flex items-center gap-2">
                    Next <ArrowRight className="h-5 w-5" />
                  </span>
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex h-full flex-col"
            >
              <h2 className="mb-2 text-2xl font-bold text-neutral-900">
                Baseline Assessment
              </h2>
              <p className="mb-8 text-[15px] text-neutral-500">
                Select their most common struggles so we can tailor Sahara's
                protection.
              </p>

              <div className="space-y-4">
                {[
                  {
                    id: 1,
                    title: "Falling for Spam / Phishing",
                    desc: "Clicking suspicious links in SMS or WhatsApp",
                  },
                  {
                    id: 2,
                    title: "Accidental Deletions",
                    desc: "Deleting photos, contacts, or important apps",
                  },
                  {
                    id: 3,
                    title: "Tech Overwhelm",
                    desc: "Gets stuck on pop-ups or system updates",
                  },
                  {
                    id: 4,
                    title: "Account Lockouts",
                    desc: "Forgetting passwords or getting locked out",
                  },
                ].map((issue) => (
                  <label
                    key={issue.id}
                    className="flex cursor-pointer items-start gap-4 rounded-2xl border border-neutral-200 bg-white p-4 transition-all hover:border-[#00695C]"
                  >
                    <div className="mt-0.5">
                      <input
                        type="checkbox"
                        className="h-5 w-5 rounded border-neutral-300 text-[#00695C] focus:ring-[#00695C]"
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-900">
                        {issue.title}
                      </h3>
                      <p className="mt-0.5 text-xs text-neutral-500">
                        {issue.desc}
                      </p>
                    </div>
                  </label>
                ))}
              </div>

              <div className="mt-auto pt-6">
                <button
                  onClick={nextStep}
                  className="w-full rounded-2xl bg-[#00695C] py-4 text-lg font-semibold text-white shadow-lg shadow-[#00695C]/20 transition-all active:scale-[0.98]"
                >
                  Generate Pairing Code
                </button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex h-full flex-col items-center justify-center py-10 text-center"
            >
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-500">
                <KeyRound className="h-10 w-10" />
              </div>

              <h2 className="mb-2 text-2xl font-bold text-neutral-900">
                Link Devices
              </h2>
              <p className="mb-10 px-4 text-[15px] leading-relaxed text-neutral-500">
                Open the <strong>Sahara app</strong> on{" "}
                {elderName || "your elder's"} phone and enter this code to
                securely pair devices.
              </p>

              <div className="mb-10 w-full rounded-[2rem] border border-neutral-200 bg-neutral-100 p-8 shadow-inner">
                <div className="ml-[0.25em] font-mono text-6xl font-black tracking-[0.25em] text-[#00695C]">
                  {pairingCode}
                </div>
              </div>

              <div className="mb-auto flex items-center gap-3 text-sm text-neutral-400">
                <Loader2 className="h-4 w-4 animate-spin" /> Waiting for
                connection...
              </div>

              <div className="mt-8 w-full">
                <button
                  onClick={() => onNavigate("/dashboard")}
                  className="w-full rounded-2xl bg-neutral-900 py-4 text-lg font-semibold text-white transition-all active:scale-[0.98]"
                >
                  Skip to Dashboard (Demo)
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function DashboardScreen() {
  const activities = [
    {
      id: 1,
      time: "10:00 AM Today",
      title: "Guided Photo Sharing",
      desc: "Successfully guided Aba through sending a WhatsApp photo to Family Group.",
      icon: CheckCircle2,
      color: "text-green-500",
      bg: "bg-green-50",
      border: "border-green-100",
    },
    {
      id: 2,
      time: "Yesterday, 4:30 PM",
      title: "Blocked Malicious Link",
      desc: "Blocked interaction with a malicious BISP link received via SMS.",
      icon: AlertTriangle,
      color: "text-amber-500",
      bg: "bg-amber-50",
      border: "border-amber-100",
    },
    {
      id: 3,
      time: "Tuesday, 11:15 AM",
      title: "System Update Deferred",
      desc: "Paused an intrusive OS update popup while Aba was reading news.",
      icon: Info,
      color: "text-blue-500",
      bg: "bg-blue-50",
      border: "border-blue-100",
    },
  ];

  return (
    <div className="flex h-full flex-col bg-neutral-50 px-5 pt-16">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Command Center
          </h1>
          <p className="mt-1 text-[13px] text-neutral-500">
            Monitoring Aba's device
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-neutral-200 bg-white p-1 shadow-sm">
          <img
            src={flowSaharaLogo}
            alt="Sahara"
            className="h-full w-full object-contain"
          />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-6 overflow-hidden rounded-3xl border border-neutral-100 bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
      >
        <div className="absolute top-0 right-0 h-32 w-32 translate-x-1/4 -translate-y-1/2 rounded-full bg-[#00695C]/5 blur-2xl"></div>
        <div className="relative z-10 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-500 shadow-inner">
                <Wifi className="h-6 w-6" />
              </div>
              <div className="absolute -right-1 -bottom-1 h-4 w-4 rounded-full border-2 border-white bg-green-500"></div>
            </div>
            <div>
              <h2 className="font-bold text-neutral-900">Device Online</h2>
              <p className="flex items-center gap-1 text-[13px] font-medium text-green-600">
                <ShieldCheck className="h-3.5 w-3.5" /> Overlay Active
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-neutral-100 pt-4">
          <div className="flex items-center gap-1.5 text-xs text-neutral-500">
            <Clock className="h-3.5 w-3.5" /> Last sync: Just now
          </div>
          <div className="rounded-md bg-neutral-100 px-2 py-1 text-xs font-bold text-neutral-900">
            Battery: 84%
          </div>
        </div>
      </motion.div>

      <div className="mb-8">
        <h3 className="mb-3 px-1 text-[13px] font-bold tracking-wider text-neutral-900 uppercase">
          Quick Actions
        </h3>
        <button className="flex w-full items-center justify-between rounded-2xl bg-[#00695C] p-4 text-white shadow-lg shadow-[#00695C]/20 transition-all hover:bg-[#004d40] active:scale-[0.98]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
              <MessageCircleHeart className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <div className="text-base font-bold">Quick Ping</div>
              <div className="text-xs font-medium text-white/80">
                Send "Just checking in" to widget
              </div>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-white/50" />
        </button>
      </div>

      <div className="flex-1">
        <div className="mb-4 flex items-center justify-between px-1">
          <h3 className="flex items-center gap-1.5 text-[13px] font-bold tracking-wider text-neutral-900 uppercase">
            <Activity className="h-4 w-4 text-[#00695C]" /> Activity Log
          </h3>
          <button className="text-xs font-bold text-[#00695C]">View All</button>
        </div>

        <div className="relative pl-3 pb-8">
          <div className="absolute top-4 bottom-0 left-[1.1rem] w-px bg-neutral-200"></div>

          <div className="space-y-6">
            {activities.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative pl-8"
                >
                  <div
                    className={`absolute top-1 left-0 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full border-4 border-neutral-50 ${item.bg}`}
                  >
                    <div
                      className={`h-2.5 w-2.5 rounded-full ${item.color.replace("text-", "bg-")}`}
                    ></div>
                  </div>

                  <div
                    className={`cursor-pointer rounded-2xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md ${item.border}`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`shrink-0 rounded-xl p-2 ${item.bg} ${item.color}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="mb-1 flex items-center justify-between">
                          <h4 className="text-[14px] font-bold text-neutral-900">
                            {item.title}
                          </h4>
                          <span className="text-[10px] font-medium text-neutral-400">
                            {item.time.split(",")[0]}
                          </span>
                        </div>
                        <p className="text-[13px] leading-snug text-neutral-500">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function AlertsListScreen({
  onNavigate,
}: {
  onNavigate: (to: string | number) => void;
}) {
  const alerts = [
    {
      id: "1",
      title: "Factory Data Reset",
      type: "Destructive Action",
      time: "Just now",
      isNew: true,
      priority: "high",
      recommendation: "teach",
      desc: "Aba is attempting to erase all data from the device internal storage.",
    },
    {
      id: "2",
      title: "Suspicious WhatsApp Link",
      type: "Phishing Risk",
      time: "2 hours ago",
      isNew: false,
      priority: "high",
      recommendation: "do",
      desc: "Aba clicked on a known malicious BISP lottery link.",
    },
    {
      id: "3",
      title: "App Installation: Flashlight Pro",
      type: "Malware Risk",
      time: "Yesterday",
      isNew: false,
      priority: "medium",
      recommendation: "teach",
      desc: "App requests excessive permissions including Contacts and SMS.",
    },
  ];

  return (
    <div className="flex h-full flex-col bg-neutral-50 px-5 pt-16 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
          Active Alerts
        </h1>
        <p className="mt-1 text-[13px] text-neutral-500">
          Recent interventions requiring your attention
        </p>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative overflow-hidden rounded-2xl border bg-white p-4 shadow-sm ${
              alert.isNew ? "border-red-200" : "border-neutral-200"
            }`}
          >
            {alert.isNew && (
              <div className="absolute top-0 right-0 h-16 w-16 translate-x-1/4 -translate-y-1/2 rounded-full bg-red-500/5 blur-xl"></div>
            )}

            <div className="relative z-10 mb-3 flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`flex shrink-0 items-center justify-center rounded-xl p-2 ${
                    alert.priority === "high"
                      ? "bg-red-50 text-red-500"
                      : "bg-amber-50 text-amber-500"
                  }`}
                >
                  {alert.priority === "high" ? (
                    <ShieldAlert className="h-4 w-4" />
                  ) : (
                    <AlertTriangle className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-neutral-900">
                      {alert.title}
                    </h3>
                    {alert.isNew && (
                      <span className="rounded bg-red-500 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-white uppercase">
                        New
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span className="text-[11px] font-medium text-neutral-500">
                      {alert.type}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-neutral-300"></span>
                    <span className="flex items-center gap-1 text-[11px] text-neutral-400">
                      <Clock className="h-3 w-3" />
                      {alert.time}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <p className="mb-4 text-[13px] leading-relaxed text-neutral-600">
              {alert.desc}
            </p>

            <div className="mb-4 flex items-center gap-3 rounded-xl border border-[#00695C]/10 bg-[#00695C]/5 p-3">
              <BrainCircuit className="h-4 w-4 text-[#00695C]" />
              <div className="flex-1">
                <span className="block text-[10px] font-bold tracking-wider text-[#00695C] uppercase">
                  AI Recommendation
                </span>
                <span className="text-[12px] font-medium text-neutral-900">
                  {alert.recommendation === "teach"
                    ? "Teach via Walkthrough"
                    : "Do it for them (Remote)"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate(`/alert/${alert.id}`)}
                className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-neutral-200 bg-white py-2.5 text-[13px] font-bold text-neutral-700 shadow-sm transition-all hover:bg-neutral-50 active:scale-[0.98]"
              >
                View Details
              </button>
              <button className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#00695C] py-2.5 text-[13px] font-bold text-white shadow-sm transition-all hover:bg-[#004d40] active:scale-[0.98]">
                {alert.recommendation === "teach"
                  ? "Send Walkthrough"
                  : "Request Remote"}
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function AlertDetailsScreen({
  onNavigate,
}: {
  onNavigate: (to: string | number) => void;
}) {
  const [decision, setDecision] = useState<"teach" | "do" | null>(null);

  const ContextVisual = () => (
    <div className="relative mx-auto mb-6 max-w-[200px] overflow-hidden rounded-3xl bg-neutral-900 p-1 shadow-2xl shadow-neutral-900/20">
      <div className="relative flex aspect-[9/19.5] flex-col overflow-hidden rounded-[20px] bg-white">
        <div className="flex h-6 w-full shrink-0 items-center justify-between bg-neutral-100 px-4">
          <div className="h-2.5 w-8 rounded-full bg-neutral-300"></div>
          <div className="h-2.5 w-10 rounded-full bg-neutral-300"></div>
        </div>

        <div className="flex flex-1 flex-col items-center p-4 pt-10 text-center">
          <div className="mb-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-500">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h2 className="mb-2 text-sm leading-tight font-bold text-neutral-900">
            Factory Data Reset
          </h2>
          <p className="mb-8 text-[10px] leading-relaxed text-neutral-500">
            This will erase all data from your phone's internal storage.
          </p>

          <div className="mt-auto w-full space-y-2 pb-4">
            <div className="h-8 w-full rounded-lg bg-neutral-100"></div>
            <div className="relative h-8 w-full overflow-hidden rounded-lg bg-red-500">
              <motion.div
                className="absolute inset-0 border-[1.5px] border-red-500 bg-red-500/20"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 border-4 border-red-500/30 bg-red-500/10"></div>
      </div>

      <div className="absolute top-3 left-3 z-10 flex items-center gap-1 rounded bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
        <Video className="h-3 w-3" /> Live View
      </div>
    </div>
  );

  return (
    <div className="flex h-full flex-col bg-neutral-50 px-5 pt-14 pb-24">
      <div className="mb-6 flex items-center gap-3 border-b border-neutral-200 pb-4">
        <button
          onClick={() => onNavigate(-1)}
          className="-ml-2 rounded-full p-2 text-neutral-600 transition-colors hover:bg-neutral-200"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <div>
          <h1 className="flex items-center gap-2 text-lg font-bold text-neutral-900">
            Intervention Required
            <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-black tracking-wider text-red-600 uppercase">
              High Priority
            </span>
          </h1>
          <p className="flex items-center gap-1 text-[13px] text-neutral-500">
            <Clock className="h-3.5 w-3.5" /> Triggered Just Now
          </p>
        </div>
      </div>

      <div className="no-scrollbar flex-1 overflow-x-hidden overflow-y-auto">
        <div className="mb-6 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-3">
            <div className="rounded-xl bg-red-50 p-2 text-red-500">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-neutral-900">
                Factory Data Reset
              </h2>
              <span className="text-[11px] font-medium text-neutral-500">
                Destructive Action Attempted
              </span>
            </div>
          </div>
          <p className="mt-3 border-t border-neutral-100 pt-2 text-[13px] leading-relaxed text-neutral-600">
            Aba is attempting to erase all data from the device internal
            storage. This is a critical risk.
          </p>
        </div>

        <ContextVisual />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-8 overflow-hidden rounded-2xl border border-[#00695C]/20 bg-[#00695C]/5 p-4 shadow-[0_4px_20px_rgba(0,105,92,0.05)]"
        >
          <div className="absolute top-0 left-0 h-full w-1 bg-[#00695C]"></div>
          <div className="flex gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#00695C]/10">
              <BrainCircuit className="h-4 w-4 text-[#00695C]" />
            </div>
            <div>
              <h3 className="mb-1 flex items-center gap-1.5 text-sm font-bold text-neutral-900">
                Sahara Recommendation
                <span className="ml-1 rounded bg-[#00695C] px-1.5 py-0.5 text-[9px] font-black tracking-wider text-white uppercase">
                  Teach
                </span>
              </h3>
              <p className="text-[13px] leading-relaxed text-neutral-600">
                Aba is on the Factory Reset screen. He has struggled with device
                settings before.
                <strong className="font-bold text-neutral-900">
                  {" "}
                  Teaching is recommended
                </strong>{" "}
                to help him understand what this screen does and how to avoid it
                in the future.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="mb-4 space-y-4">
          <h3 className="mb-2 px-1 text-[13px] font-bold tracking-wider text-neutral-500 uppercase">
            How would you like to proceed?
          </h3>

          <AnimatePresence mode="wait">
            {!decision ? (
              <motion.div className="flex flex-col gap-3">
                <button
                  onClick={() => setDecision("teach")}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#00695C] py-4 text-[15px] font-semibold text-white shadow-lg shadow-[#00695C]/20 transition-all active:scale-[0.98]"
                >
                  <Lightbulb className="h-5 w-5" /> Teach (Send Walkthrough)
                </button>

                <button
                  onClick={() => setDecision("do")}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white py-4 text-[15px] font-semibold text-neutral-700 shadow-sm transition-all hover:bg-neutral-50 active:scale-[0.98]"
                >
                  <Zap className="h-5 w-5 text-blue-500" /> Do it for them
                  (Remote Control)
                </button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center shadow-inner"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-500">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h4 className="mb-2 text-lg font-bold text-green-800">
                  Action Initiated
                </h4>
                <p className="text-sm text-green-700">
                  {decision === "teach"
                    ? "Generating walkthrough and sending to Aba's device..."
                    : "Requesting remote control permission from Aba..."}
                </p>
                <button
                  onClick={() => setDecision(null)}
                  className="mt-6 text-sm font-bold text-green-700 underline underline-offset-4"
                >
                  Cancel Action
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function SettingsScreen() {
  const [privacyToggles, setPrivacyToggles] = useState({
    banking: true,
    medical: true,
    social: false,
  });

  const [alertToggles, setAlertToggles] = useState({
    red: true,
    yellow: true,
    info: false,
  });

  return (
    <div className="flex h-full flex-col bg-neutral-50 px-5 pt-16 pb-24">
      <h1 className="mb-2 text-2xl font-bold tracking-tight text-neutral-900">
        Rules & Settings
      </h1>
      <p className="mb-8 text-[13px] text-neutral-500">
        Configure Sahara's protection level for Aba's device.
      </p>

      <div className="space-y-8">
        <section>
          <div className="mb-4 flex items-center gap-2 px-1">
            <Lock className="h-5 w-5 text-[#00695C]" />
            <h2 className="text-sm font-bold tracking-wider text-neutral-900 uppercase">
              Privacy Overrides
            </h2>
          </div>
          <p className="mb-4 px-1 text-[13px] leading-relaxed text-neutral-500">
            Automatically pause Sahara's screen-reading and AI analysis when
            these sensitive apps are opened.
          </p>

          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-neutral-100 p-4">
              <div>
                <h3 className="text-[15px] font-bold text-neutral-900">
                  Banking Apps
                </h3>
                <p className="mt-0.5 text-xs text-neutral-500">
                  HBL, Meezan, JazzCash, Easypaisa
                </p>
              </div>
              <Switch.Root
                checked={privacyToggles.banking}
                onCheckedChange={(checked) =>
                  setPrivacyToggles((previous) => ({
                    ...previous,
                    banking: checked,
                  }))
                }
                className={`relative h-6 w-11 rounded-full transition-colors focus:ring-2 focus:ring-[#00695C] focus:ring-offset-2 focus:outline-none ${privacyToggles.banking ? "bg-[#00695C]" : "bg-neutral-200"}`}
              >
                <Switch.Thumb
                  className={`block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${privacyToggles.banking ? "translate-x-[22px]" : "translate-x-0.5"}`}
                />
              </Switch.Root>
            </div>

            <div className="flex items-center justify-between border-b border-neutral-100 p-4">
              <div>
                <h3 className="text-[15px] font-bold text-neutral-900">
                  Medical & Health
                </h3>
                <p className="mt-0.5 text-xs text-neutral-500">
                  Sehat Kahani, Chughtai Lab
                </p>
              </div>
              <Switch.Root
                checked={privacyToggles.medical}
                onCheckedChange={(checked) =>
                  setPrivacyToggles((previous) => ({
                    ...previous,
                    medical: checked,
                  }))
                }
                className={`relative h-6 w-11 rounded-full transition-colors focus:ring-2 focus:ring-[#00695C] focus:ring-offset-2 focus:outline-none ${privacyToggles.medical ? "bg-[#00695C]" : "bg-neutral-200"}`}
              >
                <Switch.Thumb
                  className={`block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${privacyToggles.medical ? "translate-x-[22px]" : "translate-x-0.5"}`}
                />
              </Switch.Root>
            </div>

            <div className="flex items-center justify-between p-4">
              <div>
                <h3 className="text-[15px] font-bold text-neutral-900">
                  Social Media
                </h3>
                <p className="mt-0.5 text-xs text-neutral-500">
                  WhatsApp, Facebook, TikTok
                </p>
              </div>
              <Switch.Root
                checked={privacyToggles.social}
                onCheckedChange={(checked) =>
                  setPrivacyToggles((previous) => ({
                    ...previous,
                    social: checked,
                  }))
                }
                className={`relative h-6 w-11 rounded-full transition-colors focus:ring-2 focus:ring-[#00695C] focus:ring-offset-2 focus:outline-none ${privacyToggles.social ? "bg-[#00695C]" : "bg-neutral-200"}`}
              >
                <Switch.Thumb
                  className={`block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${privacyToggles.social ? "translate-x-[22px]" : "translate-x-0.5"}`}
                />
              </Switch.Root>
            </div>
          </div>

          {privacyToggles.banking && (
            <div className="mt-3 flex items-start gap-2 px-1">
              <EyeOff className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <p className="text-[12px] font-medium text-amber-700">
                Sahara will go blind during banking sessions to ensure complete
                financial privacy.
              </p>
            </div>
          )}
        </section>

        <section>
          <div className="mb-4 flex items-center gap-2 px-1">
            <Bell className="h-5 w-5 text-[#00695C]" />
            <h2 className="text-sm font-bold tracking-wider text-neutral-900 uppercase">
              Alert Thresholds
            </h2>
          </div>
          <p className="mb-4 px-1 text-[13px] leading-relaxed text-neutral-500">
            Choose what types of events trigger a push notification to your
            phone.
          </p>

          <div className="space-y-3">
            <label
              className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition-all ${
                alertToggles.red
                  ? "border-red-200 bg-red-50"
                  : "border-neutral-200 bg-white"
              }`}
            >
              <div className="mt-0.5">
                <input
                  type="checkbox"
                  checked={alertToggles.red}
                  onChange={(event) =>
                    setAlertToggles((previous) => ({
                      ...previous,
                      red: event.target.checked,
                    }))
                  }
                  className="h-5 w-5 rounded border-neutral-300 text-red-600 focus:ring-red-600"
                />
              </div>
              <div>
                <h3 className="flex items-center gap-1.5 text-sm font-bold text-neutral-900">
                  <ShieldAlert className="h-4 w-4 text-red-500" /> Red Scams
                </h3>
                <p className="mt-1 text-xs text-neutral-600">
                  Phishing links, fake OTP requests, malicious app installs.
                </p>
              </div>
            </label>

            <label
              className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition-all ${
                alertToggles.yellow
                  ? "border-amber-200 bg-amber-50"
                  : "border-neutral-200 bg-white"
              }`}
            >
              <div className="mt-0.5">
                <input
                  type="checkbox"
                  checked={alertToggles.yellow}
                  onChange={(event) =>
                    setAlertToggles((previous) => ({
                      ...previous,
                      yellow: event.target.checked,
                    }))
                  }
                  className="h-5 w-5 rounded border-neutral-300 text-amber-600 focus:ring-amber-600"
                />
              </div>
              <div>
                <h3 className="flex items-center gap-1.5 text-sm font-bold text-neutral-900">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />{" "}
                  Destructive Actions
                </h3>
                <p className="mt-1 text-xs text-neutral-600">
                  Factory resets, deleting contacts, uninstalling critical apps.
                </p>
              </div>
            </label>

            <label
              className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition-all ${
                alertToggles.info
                  ? "border-blue-200 bg-blue-50"
                  : "border-neutral-200 bg-white"
              }`}
            >
              <div className="mt-0.5">
                <input
                  type="checkbox"
                  checked={alertToggles.info}
                  onChange={(event) =>
                    setAlertToggles((previous) => ({
                      ...previous,
                      info: event.target.checked,
                    }))
                  }
                  className="h-5 w-5 rounded border-neutral-300 text-blue-600 focus:ring-blue-600"
                />
              </div>
              <div>
                <h3 className="flex items-center gap-1.5 text-sm font-bold text-neutral-900">
                  <ShieldCheck className="h-4 w-4 text-blue-500" /> Info & AI
                  Auto-Resolves
                </h3>
                <p className="mt-1 text-xs text-neutral-600">
                  Sahara blocking an ad, deferring a system update, or
                  successfully guiding through a task.
                </p>
              </div>
            </label>
          </div>
        </section>
      </div>
    </div>
  );
}

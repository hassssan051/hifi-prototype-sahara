import React, { useState } from "react";
import { useSafeNavigate } from "../hooks/useSafeRouter";
import {
  ShieldCheck,
  ChevronRight,
  User,
  Globe,
  AlertTriangle,
  ArrowRight,
  Loader2,
  KeyRound,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { flowSaharaLogo } from "../../../components/sahara/flows/flowLogo";
import { MobileFrame } from "../components/MobileFrame";

export const Onboarding = () => {
  const navigate = useSafeNavigate();
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
    <MobileFrame>
      <div className="h-full flex flex-col bg-white px-6 pt-20 pb-10">
        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s) => (
            <div
              key={s.id}
              className={`h-1.5 rounded-full transition-all duration-300 ${step === s.id ? "w-8 bg-[#00695C]" : step > s.id ? "w-4 bg-[#00695C]/30" : "w-4 bg-neutral-200"}`}
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
                className="flex flex-col h-full"
              >
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <div className="w-24 h-24 mb-6 rounded-[2rem] bg-neutral-50 shadow-sm border border-neutral-100 flex items-center justify-center overflow-hidden">
                    <img
                      src={flowSaharaLogo}
                      alt="Sahara Logo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h1 className="text-3xl font-bold text-neutral-900 mb-4 tracking-tight">
                    Sahara Proxy
                  </h1>
                  <p className="text-neutral-500 mb-8 text-[15px] leading-relaxed px-4">
                    Protect your elderly loved ones from digital scams. You
                    handle the setup, they stay safe.
                  </p>

                  <button
                    onClick={nextStep}
                    className="w-full bg-[#00695C] text-white rounded-2xl py-4 font-semibold text-lg flex items-center justify-center gap-2 shadow-lg shadow-[#00695C]/20 hover:bg-[#005a4f] hover:shadow-xl hover:shadow-[#00695C]/30 active:scale-[0.98] transition-all duration-200"
                  >
                    Get Started <ArrowRight className="w-5 h-5" />
                  </button>
                  <button className="w-full mt-4 text-[#00695C] font-semibold">
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
                className="flex flex-col h-full"
              >
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                  Who are you protecting?
                </h2>
                <p className="text-neutral-500 mb-8 text-[15px]">
                  Help Sahara understand the context to provide better AI
                  assistance.
                </p>

                <div className="space-y-5">
                  <div>
                    <label className="text-sm font-semibold text-neutral-700 mb-2 block">
                      Elder's Name
                    </label>
                    <div className="relative">
                      <User className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="text"
                        placeholder="e.g. Aba, Ammi, John"
                        value={elderName}
                        onChange={(e) => setElderName(e.target.value)}
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-[#00695C] focus:ring-1 focus:ring-[#00695C] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-neutral-700 mb-2 block">
                      Relationship
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {["Parent", "Grandparent", "Spouse", "Other"].map(
                        (rel) => (
                          <button
                            key={rel}
                            onClick={() => setRelationship(rel)}
                            className={`py-3 px-4 rounded-xl border font-medium text-sm transition-all text-left ${relationship === rel ? "border-[#00695C] text-[#00695C] bg-[#00695C]/5" : "border-neutral-200 bg-white text-neutral-700 hover:border-[#00695C] hover:text-[#00695C] hover:bg-[#00695C]/5"}`}
                          >
                            {rel}
                          </button>
                        ),
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-neutral-700 mb-2 block">
                      Primary Language
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                      {["English", "Urdu (اردو)", "Roman Urdu"].map((lang) => (
                        <button
                          key={lang}
                          onClick={() => setLanguage(lang)}
                          className={`flex items-center gap-3 py-3 px-4 rounded-xl border transition-all text-left font-semibold text-sm ${language === lang ? "border-2 border-[#00695C] bg-[#00695C]/5 text-[#00695C]" : "border border-neutral-200 bg-white text-neutral-700 hover:border-[#00695C]"}`}
                        >
                          <Globe className="w-4 h-4" /> {lang}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-6">
                  <button
                    onClick={nextStep}
                    disabled={!elderName.trim() || !relationship}
                    className="w-full bg-[#00695C] text-white rounded-2xl py-4 font-semibold text-lg flex items-center justify-center gap-2 shadow-lg shadow-[#00695C]/20 disabled:opacity-50 disabled:shadow-none transition-all active:scale-[0.98]"
                  >
                    Next <ArrowRight className="w-5 h-5" />
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
                className="flex flex-col h-full"
              >
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                  Baseline Assessment
                </h2>
                <p className="text-neutral-500 mb-8 text-[15px]">
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
                      className="flex items-start gap-4 p-4 rounded-2xl border border-neutral-200 bg-white cursor-pointer hover:border-[#00695C] transition-all"
                    >
                      <div className="mt-0.5">
                        <input
                          type="checkbox"
                          className="w-5 h-5 rounded border-neutral-300 text-[#00695C] focus:ring-[#00695C]"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-neutral-900 text-sm">
                          {issue.title}
                        </h3>
                        <p className="text-neutral-500 text-xs mt-0.5">
                          {issue.desc}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="mt-auto pt-6">
                  <button
                    onClick={nextStep}
                    className="w-full bg-[#00695C] text-white rounded-2xl py-4 font-semibold text-lg flex items-center justify-center gap-2 shadow-lg shadow-[#00695C]/20 transition-all active:scale-[0.98]"
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
                className="flex flex-col h-full items-center justify-center text-center py-10"
              >
                <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6">
                  <KeyRound className="w-10 h-10" />
                </div>

                <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                  Link Devices
                </h2>
                <p className="text-neutral-500 mb-10 text-[15px] px-4 leading-relaxed">
                  Open the <strong>Sahara app</strong> on{" "}
                  {elderName || "your elder's"} phone and enter this code to
                  securely pair devices.
                </p>

                <div className="w-full bg-neutral-100 border border-neutral-200 rounded-[2rem] p-8 mb-10 shadow-inner">
                  <div className="text-6xl font-black text-[#00695C] tracking-[0.25em] ml-[0.25em] font-mono">
                    {pairingCode}
                  </div>
                </div>

                <div className="flex items-center gap-3 text-neutral-400 text-sm mb-auto">
                  <Loader2 className="w-4 h-4 animate-spin" /> Waiting for
                  connection...
                </div>

                <div className="w-full mt-8">
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="w-full bg-neutral-900 text-white rounded-2xl py-4 font-semibold text-lg flex items-center justify-center transition-all active:scale-[0.98]"
                  >
                    Skip to Dashboard (Demo)
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </MobileFrame>
  );
};

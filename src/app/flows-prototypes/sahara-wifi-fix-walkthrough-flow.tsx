import React, { useState, useEffect, useRef } from "react";
import {
  Battery,
  Wifi,
  Signal,
  ChevronLeft,
  Phone,
  MoreVertical,
  Send,
  ShieldAlert,
  ShieldCheck,
  X,
  Bot,
  User,
  ArrowUp,
  Globe,
  BellRing,
  CheckCircle2,
  Maximize2,
  Circle,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { flowSaharaLogo as saharaLogo } from "../components/sahara/flows/flowLogo";

type Translatable = {
  en: string;
  ur: string;
};

type WalkthroughStep = "idle" | "step1" | "step2" | "step3" | "completed";

type Message = {
  id: string;
  role: "ai" | "user";
  type: "walkthrough_offer" | "text" | "warning";
  content: Translatable;
  hideButtons?: boolean;
};

const INITIAL_MESSAGE: Message = {
  id: "1",
  role: "ai",
  type: "text",
  content: {
    en: "Hi! I'm Sahara. I can help you navigate your phone safely.",
    ur: "ہیلو! میں صحارا ہوں۔ میں آپ کے فون کو محفوظ طریقے سے استعمال کرنے میں مدد کر سکتا ہوں۔",
  },
};

const QUICK_PROMPTS = [
  {
    id: "fix",
    en: "Fix my error",
    ur: "میری خرابی دور کریں",
  },
  {
    id: "explain",
    en: "Explain what's on my screen",
    ur: "میری سکرین پر کیا ہے، سمجھائیں",
  },
];

const dict = {
  promptTitle: { en: "Sahara AI Agent", ur: "اے آئی ایجنٹ" },
  step1Msg: {
    en: "Step 1 of 3: Go to Home and open the Settings app.",
    ur: "مرحلہ 1 از 3: ہوم پر جائیں اور سیٹنگز ایپ کھولیں۔",
  },
  step2Msg: {
    en: "Step 2 of 3: Tap 'Network & internet'.",
    ur: "مرحلہ 2 از 3: 'نیٹ ورک اور انٹرنیٹ' پر ٹیپ کریں۔",
  },
  step3Msg: {
    en: "Step 3 of 3: Turn on the Wi-Fi toggle.",
    ur: "مرحلہ 3 از 3: وائی فائی ٹوگل کو آن کریں۔",
  },
  completedMsg: {
    en: "Walkthrough Complete! You are now connected to the internet.",
    ur: "واک تھرو مکمل! اب آپ انٹرنیٹ سے منسلک ہیں۔",
  },
  btnDontUnderstand: { en: "I don't understand", ur: "مجھے سمجھ نہیں آ رہا" },
  btnCancel: { en: "Cancel Walkthrough", ur: "واک تھرو منسوخ کریں" },
  btnDone: { en: "Done", ur: "ہو گیا" },
  msgUserDontUnderstand: {
    en: "I don't understand what to do here.",
    ur: "مجھے سمجھ نہیں آ رہا کہ یہاں کیا کرنا ہے۔",
  },
  expStep1: {
    en: "The Settings app has a gear icon. Tap it to continue.",
    ur: "سیٹنگز ایپ میں گیئر کا آئیکن ہے۔ جاری رکھنے کے لیے اسے ٹیپ کریں۔",
  },
  expStep2: {
    en: "Look for 'Network & internet' or 'Wi-Fi' in the list and tap it.",
    ur: "'نیٹ ورک اور انٹرنیٹ' یا 'وائی فائی' تلاش کریں اور اس پر ٹیپ کریں۔",
  },
  expStep3: {
    en: "Tap the switch next to 'Use Wi-Fi' so it turns blue.",
    ur: "'وائی فائی استعمال کریں' کے آگے والے سوئچ پر ٹیپ کریں تاکہ یہ نیلا ہو جائے۔",
  },
};

export default function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [appState, setAppState] = useState<WalkthroughStep>("idle");
  const [blipState, setBlipState] = useState<"red" | "teal">("teal");
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState("");

  const [language, setLanguage] = useState<"en" | "ur">("en");
  const [isNotified, setIsNotified] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  const robotoFont = { fontFamily: '"Roboto", sans-serif' };
  const urduFont = {
    fontFamily: '"Noto Nastaliq Urdu", serif',
    lineHeight: "1.8",
  };
  const getDynamicFont = (lang: "en" | "ur") =>
    lang === "ur" ? urduFont : robotoFont;

  const chatEndRef = useRef<HTMLDivElement>(null);
  const isNotifyEnabled = true;

  // Auto-scroll
  useEffect(() => {
    if (isChatOpen && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isChatOpen, isThinking]);

  const handleStartWalkthrough = () => {
    setIsChatOpen(false);
    setAppState("step1");
    setMessages((prev) =>
      prev.map((msg) =>
        msg.type === "walkthrough_offer" ? { ...msg, hideButtons: true } : msg,
      ),
    );
  };

  const handleOpenChat = () => setIsChatOpen(true);
  const handleDismiss = () => setIsChatOpen(false);

  const handleCancelWalkthrough = () => {
    setAppState("idle");
    setIsChatOpen(true);
  };

  const handleDontUnderstand = () => {
    const aiExplanation =
      appState === "step1"
        ? dict.expStep1
        : appState === "step2"
          ? dict.expStep2
          : dict.expStep3;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: "user",
        type: "text",
        content: dict.msgUserDontUnderstand,
      },
      {
        id: (Date.now() + 1).toString(),
        role: "ai",
        type: "text",
        content: aiExplanation,
      },
    ]);
    setIsChatOpen(true);
  };

  const handleSendMessage = (e?: React.FormEvent, textOverride?: string) => {
    if (e) e.preventDefault();
    const textToSend = textOverride || inputValue.trim();
    if (!textToSend) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      type: "text",
      content: { en: textToSend, ur: textToSend },
    };

    setMessages((prev) => [...prev, newMsg]);
    if (!textOverride) setInputValue("");
    setIsThinking(true);

    if (
      textToSend.toLowerCase() === "fix my error" ||
      textToSend === "میری خرابی دور کریں"
    ) {
      setTimeout(() => {
        setIsThinking(false);
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: "ai",
          type: "walkthrough_offer",
          content: {
            en: "I see you are not connected to the internet. I have created a step-by-step walkthrough to help you turn on Wi-Fi. Would you like to start?",
            ur: "میں دیکھ رہا ہوں کہ آپ انٹرنیٹ سے منسلک نہیں ہیں۔ میں نے آپ کو وائی فائی آن کرنے میں مدد کے لیے ایک قدم بہ قدم واک تھرو بنایا ہے۔ کیا آپ شروع کرنا چاہیں گے؟",
          },
        };
        setMessages((prev) => [...prev, aiResponse]);
      }, 1500);
    } else {
      setTimeout(() => {
        setIsThinking(false);
        const aiReply: Message = {
          id: (Date.now() + 1).toString(),
          role: "ai",
          type: "text",
          content: {
            en: "I am here to help you navigate safely. I have noted your message.",
            ur: "میں محفوظ طریقے سے نیویگیٹ کرنے میں آپ کی مدد کے لیے حاضر ہوں۔ میں نے آپ کا پیغام نوٹ کر لیا ہے۔",
          },
        };
        setMessages((prev) => [...prev, aiReply]);
      }, 1000);
    }
  };

  const sendQuickPrompt = (prompt: { en: string; ur: string }) => {
    handleSendMessage(undefined, prompt[language]);
  };

  const handleNotifyProxy = () => {
    if (!isNotifyEnabled || isNotified) return;
    setIsNotified(true);
  };

  const LanguageToggle = () => (
    <div className="flex bg-neutral-100 p-0.5 rounded-lg border border-neutral-200 shrink-0">
      <button
        onClick={() => setLanguage("en")}
        className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-colors ${language === "en" ? "bg-[#00695C] text-white shadow-sm" : "text-neutral-500 hover:text-neutral-700"}`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage("ur")}
        className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-colors ${language === "ur" ? "bg-[#00695C] text-white shadow-sm" : "text-neutral-500 hover:text-neutral-700"}`}
      >
        UR
      </button>
    </div>
  );

  const isWalkthroughActive =
    appState === "step1" || appState === "step2" || appState === "step3";

  const renderBackground = () => {
    if (appState === "idle") {
      return (
        <div className="absolute inset-0 bg-white flex flex-col pt-12 items-center z-0">
          <div className="w-full bg-neutral-100 flex items-center px-4 py-2 border-b border-neutral-200 shadow-sm relative z-20">
            <div className="w-full bg-white rounded-full px-4 py-1.5 text-[14px] text-neutral-500 shadow-sm flex items-center gap-2">
              <Globe className="w-4 h-4" /> google.com
            </div>
          </div>
          <div className="flex flex-col items-center justify-center p-6 text-center mt-24">
            <Wifi className="w-16 h-16 text-neutral-300 mb-6" />
            <h2 className="text-[22px] font-bold text-neutral-800 mb-2">
              No internet
            </h2>
            <p className="text-neutral-500 mb-6 text-[15px] leading-relaxed">
              Try checking the network cables, modem, and router or reconnecting
              to Wi-Fi.
            </p>
            <div className="text-blue-600 font-medium text-[13px] tracking-wide">
              ERR_INTERNET_DISCONNECTED
            </div>
          </div>
        </div>
      );
    }
    if (appState === "step1") {
      return (
        <div className="absolute inset-0 bg-[#1A1A1A] z-0 overflow-hidden">
          <div className="absolute inset-0 opacity-40 bg-gradient-to-b from-blue-900 to-purple-900" />
          <div className="p-6 grid grid-cols-4 gap-y-8 gap-x-4 mt-20 relative z-10">
            {[...Array(11)].map((_, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-1.5 opacity-80"
              >
                <div className="w-14 h-14 bg-white/10 rounded-2xl backdrop-blur-sm" />
                <div className="w-10 h-1.5 bg-white/20 rounded-full" />
              </div>
            ))}
            <div className="flex flex-col items-center gap-1.5 relative">
              <motion.div
                className="absolute -inset-2 border-[3px] border-blue-500 rounded-[24px] z-50 pointer-events-none"
                animate={{ opacity: [1, 0.5, 1], scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <button
                onClick={() => setAppState("step2")}
                className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center relative z-40 shadow-lg"
              >
                <div className="w-8 h-8 rounded-full border-[5px] border-neutral-700 border-dashed" />
              </button>
              <span className="text-[11px] text-white font-medium drop-shadow-md">
                Settings
              </span>
            </div>
          </div>
        </div>
      );
    }
    if (appState === "step2") {
      return (
        <div className="absolute inset-0 bg-white pt-12 flex flex-col z-0">
          <div className="px-5 py-4 text-[26px] font-semibold text-neutral-900 border-b border-neutral-100">
            Settings
          </div>
          <div className="flex flex-col pt-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={`pre-${i}`}
                className="w-full flex items-center gap-4 px-5 py-3.5"
              >
                <div className="w-9 h-9 rounded-full bg-neutral-100 shrink-0" />
                <div className="flex flex-col items-start gap-2 flex-1">
                  <div className="w-32 h-3.5 bg-neutral-200 rounded-full" />
                  <div className="w-24 h-2.5 bg-neutral-100 rounded-full" />
                </div>
              </div>
            ))}

            <div className="relative">
              <motion.div
                className="absolute inset-1 border-[3px] border-blue-500 rounded-xl z-50 pointer-events-none"
                animate={{ opacity: [1, 0.5, 1], scale: [1, 1.02, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <button
                onClick={() => setAppState("step3")}
                className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-neutral-50 relative z-40"
              >
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <Wifi className="w-5 h-5" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-[16px] text-neutral-900 font-medium">
                    Network & internet
                  </span>
                  <span className="text-[13px] text-neutral-500">
                    Wi-Fi, mobile, data usage
                  </span>
                </div>
              </button>
            </div>

            {[...Array(4)].map((_, i) => (
              <div
                key={`post-${i}`}
                className="w-full flex items-center gap-4 px-5 py-3.5"
              >
                <div className="w-9 h-9 rounded-full bg-neutral-100 shrink-0" />
                <div className="flex flex-col items-start gap-2 flex-1">
                  <div className="w-32 h-3.5 bg-neutral-200 rounded-full" />
                  <div className="w-24 h-2.5 bg-neutral-100 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    if (appState === "step3") {
      return (
        <div className="absolute inset-0 bg-white pt-12 flex flex-col z-0">
          <div className="flex items-center gap-3 px-2 py-3 border-b border-neutral-100">
            <button className="p-2">
              <ChevronLeft className="w-7 h-7 text-neutral-700" />
            </button>
            <div className="text-[20px] font-semibold text-neutral-900">
              Network & internet
            </div>
          </div>
          <div className="p-4 pt-48">
            <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-5 flex items-center justify-between relative shadow-sm">
              <div className="flex flex-col">
                <span className="text-[17px] text-neutral-900 font-medium">
                  Wi-Fi
                </span>
                <span className="text-[14px] text-neutral-500 mt-0.5">Off</span>
              </div>
              <div className="relative">
                <motion.div
                  className="absolute -inset-3 border-[3px] border-blue-500 rounded-full z-50 pointer-events-none"
                  animate={{ opacity: [1, 0.5, 1], scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <button
                  onClick={() => setAppState("completed")}
                  className="w-14 h-7 bg-neutral-300 rounded-full relative z-40 transition-colors shadow-inner"
                >
                  <div className="w-6 h-6 bg-white rounded-full absolute left-0.5 top-0.5 shadow-sm" />
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
    if (appState === "completed") {
      return (
        <div className="absolute inset-0 bg-white flex flex-col pt-12 z-0">
          <div className="w-full bg-neutral-100 flex items-center px-4 py-2 border-b border-neutral-200 relative z-20">
            <div className="w-full bg-white rounded-full px-4 py-1.5 text-[14px] text-neutral-500 shadow-sm flex items-center gap-2">
              <Globe className="w-4 h-4" /> google.com
            </div>
          </div>
          <div className="flex flex-col p-6 mt-8 items-center">
            <div className="flex items-center gap-1 mt-4 mb-8">
              <span className="text-4xl font-bold text-blue-500">G</span>
              <span className="text-4xl font-bold text-red-500">o</span>
              <span className="text-4xl font-bold text-yellow-500">o</span>
              <span className="text-4xl font-bold text-blue-500">g</span>
              <span className="text-4xl font-bold text-green-500">l</span>
              <span className="text-4xl font-bold text-red-500">e</span>
            </div>
            <div className="w-full h-12 bg-white border border-neutral-200 shadow-sm rounded-full mb-8 flex items-center px-4">
              <div className="w-4 h-4 border-2 border-neutral-400 rounded-full" />
            </div>
            <div className="w-full space-y-4">
              <div className="w-full h-24 bg-neutral-50 rounded-xl" />
              <div className="w-full h-24 bg-neutral-50 rounded-xl" />
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative w-full h-full bg-white overflow-hidden flex flex-col">
      {/* Status Bar */}
      <div
        className={`absolute top-0 w-full h-12 flex items-center justify-between px-6 text-sm font-medium z-20 ${appState === "step1" ? "text-white" : "text-neutral-900 bg-transparent"}`}
      >
        <span>9:41</span>
        <div className="flex items-center gap-2">
          <Signal className="w-4 h-4" />
          <Wifi
            className={`w-4 h-4 ${appState === "idle" || appState === "step1" || appState === "step2" || appState === "step3" ? "opacity-30" : ""}`}
          />
          <Battery className="w-5 h-5" />
        </div>
      </div>

      {renderBackground()}

      {/* Global Scrim for completed state */}
      <AnimatePresence>
        {appState === "completed" && !isChatOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 z-30"
            onClick={() => setAppState("idle")}
          />
        )}
      </AnimatePresence>

      {/* Sahara Walkthrough Banners */}
      <AnimatePresence mode="wait">
        {!isChatOpen && appState !== "idle" && (
          <motion.div
            layoutId="sahara-container"
            style={robotoFont}
            className={`absolute z-40 flex flex-col bg-white overflow-hidden shadow-2xl border border-neutral-100
                ${appState === "completed" ? "top-1/2 left-4 right-4 -translate-y-1/2 rounded-3xl" : ""}
                ${isWalkthroughActive ? "top-12 left-2 right-2 rounded-2xl" : ""}
              `}
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-neutral-100 z-10 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-neutral-200 shrink-0">
                  <img
                    src={saharaLogo}
                    className="w-full h-full object-cover"
                    alt="Sahara Logo"
                  />
                </div>
                <div className="flex flex-col">
                  <h2 className="font-bold text-neutral-900 text-[14px] leading-tight flex items-center gap-1.5">
                    Sahara
                    {isWalkthroughActive && (
                      <span className="px-1.5 py-[1px] bg-blue-100 text-blue-700 text-[9px] rounded-sm uppercase tracking-wider font-bold">
                        Walkthrough
                      </span>
                    )}
                  </h2>
                  <p
                    style={getDynamicFont(language)}
                    className="text-[10px] text-[#00695C] font-bold tracking-wide uppercase"
                  >
                    {dict.promptTitle[language]}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {isWalkthroughActive && (
                  <button
                    onClick={handleOpenChat}
                    className="p-1.5 text-neutral-400 hover:text-[#00695C] hover:bg-teal-50 rounded-md transition-colors"
                    title="Expand Chat"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </button>
                )}
                <LanguageToggle />
                {appState === "completed" && (
                  <button
                    onClick={() => setAppState("idle")}
                    className="p-2 text-neutral-400 hover:bg-neutral-100 rounded-full transition-colors ml-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* State: Active Walkthrough (Top Banner) */}
            {isWalkthroughActive && (
              <div className="px-4 py-3 flex flex-col gap-3">
                <div
                  style={getDynamicFont(language)}
                  dir={language === "ur" ? "rtl" : "ltr"}
                  className="text-[14.5px] text-neutral-800 font-semibold leading-snug"
                >
                  {appState === "step1"
                    ? dict.step1Msg[language]
                    : appState === "step2"
                      ? dict.step2Msg[language]
                      : dict.step3Msg[language]}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleDontUnderstand}
                    style={getDynamicFont(language)}
                    className="flex-1 px-3 py-2 bg-neutral-100 text-[#00695C] rounded-lg text-[13px] font-semibold hover:bg-neutral-200 transition-colors border border-transparent hover:border-neutral-300"
                  >
                    {dict.btnDontUnderstand[language]}
                  </button>
                  <button
                    onClick={handleCancelWalkthrough}
                    style={getDynamicFont(language)}
                    className="flex-[0.8] px-3 py-2 text-neutral-600 bg-white border border-neutral-200 rounded-lg font-semibold text-[13px] hover:bg-neutral-50 transition-colors"
                  >
                    {dict.btnCancel[language]}
                  </button>
                </div>
              </div>
            )}

            {/* State: Completed */}
            {appState === "completed" && (
              <div className="p-5 flex flex-col gap-4 items-center text-center">
                <div className="w-12 h-12 rounded-full bg-[#E0F2F1] flex items-center justify-center mb-1">
                  <CheckCircle2 className="w-7 h-7 text-[#00695C]" />
                </div>
                <div
                  style={getDynamicFont(language)}
                  dir={language === "ur" ? "rtl" : "ltr"}
                  className="text-[16px] text-neutral-800 font-medium leading-relaxed"
                >
                  {dict.completedMsg[language]}
                </div>
                <button
                  onClick={() => setAppState("idle")}
                  style={getDynamicFont(language)}
                  className="w-full py-3 mt-2 bg-[#00695C] text-white rounded-xl font-semibold text-[15px] shadow-sm hover:bg-[#004D40] active:scale-[0.98] transition-all"
                >
                  {dict.btnDone[language]}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sahara Element (Blip) */}
      {!isChatOpen && appState === "idle" && (
        <button
          onClick={handleOpenChat}
          className="absolute bottom-24 right-6 w-14 h-14 rounded-full text-white shadow-lg flex items-center justify-center z-30 hover:scale-105 active:scale-95 transition-transform overflow-visible bg-[#00695C]"
          aria-label="Sahara Assistant"
        >
          <div className="relative z-10 w-full h-full rounded-full flex items-center justify-center shadow-inner overflow-hidden border-2 border-white/20 bg-white">
            <img
              src={saharaLogo}
              alt="Sahara Logo"
              className="w-full h-full object-cover"
            />
          </div>
        </button>
      )}

      {/* Sahara AI Chat Window (Bottom Sheet) */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            layoutId="sahara-container"
            style={robotoFont}
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="absolute bottom-0 left-0 right-0 h-[65%] bg-neutral-50 rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.2)] z-50 flex flex-col overflow-hidden border-t border-neutral-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-neutral-100 z-10 shadow-sm shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white overflow-hidden shrink-0 bg-transparent border border-neutral-200 shadow-sm">
                  <img
                    src={saharaLogo}
                    className="w-full h-full object-cover"
                    alt="Sahara Logo"
                  />
                </div>
                <div className="flex flex-col">
                  <h2 className="font-bold text-neutral-900 text-[15px] leading-tight">
                    Sahara
                  </h2>
                  <p
                    style={getDynamicFont(language)}
                    className="text-[10px] text-[#00695C] font-bold tracking-wide uppercase"
                  >
                    {language === "en" ? "AI Agent" : "اے آئی ایجنٹ"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Language Toggle */}
                <LanguageToggle />

                {/* Notify Proxy */}
                <button
                  onClick={handleNotifyProxy}
                  disabled={!isNotifyEnabled || isNotified}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all border ${
                    isNotified
                      ? "bg-green-50 text-green-700 border-green-200"
                      : isNotifyEnabled
                        ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 active:scale-95"
                        : "bg-neutral-50 text-neutral-400 border-neutral-100 opacity-70"
                  }`}
                >
                  {isNotified ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <BellRing className="w-3.5 h-3.5" />
                  )}
                  <span
                    style={getDynamicFont(language)}
                    className="text-[11px] font-bold hidden sm:inline-block"
                  >
                    {isNotified
                      ? language === "en"
                        ? "Notified"
                        : "مطلع کر دیا"
                      : language === "en"
                        ? "Notify Proxy"
                        : "پراکسی کو بتائیں"}
                  </span>
                </button>

                {/* Close */}
                <button
                  onClick={handleDismiss}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200 transition-colors ml-1"
                  aria-label="Close Chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              {messages.map((msg) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id}
                  className={`flex flex-col max-w-[88%] ${msg.role === "user" ? "self-end items-end" : "self-start items-start"}`}
                >
                  {/* Role Icon & Label */}
                  <div
                    className={`flex items-center gap-1.5 mb-1 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 overflow-hidden ${
                        msg.role === "ai"
                          ? "bg-transparent shadow-sm border border-neutral-200"
                          : "bg-blue-100 text-blue-500"
                      }`}
                    >
                      {msg.role === "ai" ? (
                        <img
                          src={saharaLogo}
                          className="w-full h-full object-cover"
                          alt="Sahara Logo"
                        />
                      ) : (
                        <User className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <span
                      style={getDynamicFont(language)}
                      className="text-[11px] font-medium text-neutral-500"
                    >
                      {msg.role === "ai"
                        ? "Sahara"
                        : language === "en"
                          ? "You"
                          : "آپ"}
                    </span>
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`
                      rounded-2xl px-4 py-3 shadow-sm text-[15px]
                      ${
                        msg.role === "user"
                          ? "bg-neutral-800 text-white rounded-tr-sm"
                          : "bg-white border border-neutral-100 text-neutral-900 rounded-tl-sm"
                      }
                    `}
                  >
                    <div
                      style={getDynamicFont(language)}
                      dir={language === "ur" ? "rtl" : "ltr"}
                    >
                      {msg.content[language]}
                    </div>

                    {/* Walkthrough Offer Buttons */}
                    {msg.type === "walkthrough_offer" && !msg.hideButtons && (
                      <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-neutral-200/50">
                        <button
                          onClick={handleStartWalkthrough}
                          style={getDynamicFont(language)}
                          className="w-full py-2.5 px-4 bg-[#00695C] text-white rounded-xl font-semibold text-sm hover:bg-[#004D40] active:scale-[0.98] transition-all shadow-sm"
                        >
                          {language === "en"
                            ? "Yes, start walkthrough"
                            : "ہاں، واک تھرو شروع کریں"}
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {isThinking && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col max-w-[88%] self-start items-start"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 overflow-hidden bg-transparent shadow-sm border border-neutral-200">
                      <img
                        src={saharaLogo}
                        className="w-full h-full object-cover"
                        alt="Sahara Logo"
                      />
                    </div>
                    <span
                      style={getDynamicFont(language)}
                      className="text-[11px] font-medium text-neutral-500"
                    >
                      Sahara
                    </span>
                  </div>
                  <div className="rounded-2xl px-5 py-4 shadow-sm bg-white border border-neutral-100 text-neutral-900 rounded-tl-sm flex items-center gap-1">
                    <motion.div
                      className="w-1.5 h-1.5 bg-neutral-400 rounded-full"
                      animate={{ y: [0, -4, 0] }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: 0,
                      }}
                    />
                    <motion.div
                      className="w-1.5 h-1.5 bg-neutral-400 rounded-full"
                      animate={{ y: [0, -4, 0] }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: 0.2,
                      }}
                    />
                    <motion.div
                      className="w-1.5 h-1.5 bg-neutral-400 rounded-full"
                      animate={{ y: [0, -4, 0] }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: 0.4,
                      }}
                    />
                  </div>
                </motion.div>
              )}

              <div ref={chatEndRef} className="h-1" />
            </div>

            {/* Chat Input Area */}
            <div className="bg-white border-t border-neutral-100 pb-6 flex flex-col">
              {/* Quick Prompts */}
              <div
                className="px-3 py-3 flex overflow-x-auto gap-2 w-full max-w-full [&::-webkit-scrollbar]:hidden"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt.id}
                    onClick={() =>
                      sendQuickPrompt({ en: prompt.en, ur: prompt.ur })
                    }
                    style={getDynamicFont(language)}
                    className="whitespace-nowrap px-3.5 py-2 bg-white hover:bg-neutral-50 text-[#00695C] font-semibold text-[13px] rounded-full border border-neutral-200 shadow-sm transition-all active:scale-95 flex-shrink-0"
                  >
                    {prompt[language]}
                  </button>
                ))}
              </div>

              {/* Text Input */}
              <div className="px-3">
                <form
                  onSubmit={handleSendMessage}
                  className="flex items-center gap-2 bg-neutral-100 rounded-full px-2 py-1"
                >
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    style={getDynamicFont(language)}
                    placeholder={
                      language === "en"
                        ? "Ask Sahara a question..."
                        : "صحارا سے کوئی سوال پوچھیں..."
                    }
                    dir={language === "ur" ? "rtl" : "ltr"}
                    className="flex-1 bg-transparent px-3 py-2 text-[15px] text-neutral-900 placeholder:text-neutral-400 outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim()}
                    className="w-8 h-8 flex items-center justify-center bg-neutral-900 text-white rounded-full disabled:bg-neutral-300 disabled:text-neutral-500 transition-colors flex-shrink-0"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import React, { useState, useEffect, useRef } from "react";
import {
  Battery,
  Wifi,
  Signal,
  ChevronLeft,
  Search,
  Smartphone,
  Bell,
  Database,
  Trash2,
  X,
  Bot,
  User,
  ArrowUp,
  Globe,
  BellRing,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { flowSaharaLogo } from "../components/sahara/flows/flowLogo";

type Translatable = {
  en: string;
  ur: string;
};

type Message = {
  id: string;
  role: "ai" | "user";
  type: "warning" | "text";
  content: Translatable;
  hideButtons?: boolean;
};

const YELLOW_WARNING: Message = {
  id: "warning-1",
  role: "ai",
  type: "warning",
  content: {
    en: "Careful! Clicking this will permanently delete your data.",
    ur: "محتاط رہیں! اس پر کلک کرنے سے آپ کا ڈیٹا ہمیشہ کے لیے ڈیلیٹ ہو جائے گا۔",
  },
  hideButtons: false,
};

const CALM_MESSAGE: Message = {
  id: "calm-1",
  role: "ai",
  type: "text",
  content: {
    en: "You have no active alerts. How can I help you today?",
    ur: "آپ کے پاس کوئی فعال الرٹ نہیں ہے۔ میں آج آپ کی کیسے مدد کر سکتا ہوں؟",
  },
};

const QUICK_PROMPTS = [
  {
    id: "explain",
    en: "Explain what's on my screen",
    ur: "میری سکرین پر کیا ہے، سمجھائیں",
  },
  {
    id: "safe",
    en: "Is this action safe?",
    ur: "کیا یہ عمل محفوظ ہے؟",
  },
  {
    id: "family",
    en: "Help me contact my family",
    ur: "میرے گھر والوں سے رابطہ کریں",
  },
];

const SETTINGS_LIST = [
  {
    icon: Wifi,
    title: "Network & internet",
    desc: "Wi-Fi, mobile, data usage",
  },
  { icon: Smartphone, title: "Connected devices", desc: "Bluetooth, pairing" },
  {
    icon: Bell,
    title: "Apps & notifications",
    desc: "Recent apps, default apps",
  },
  { icon: Battery, title: "Battery", desc: "100% - full" },
  { icon: Database, title: "Storage", desc: "45% used" },
  { icon: User, title: "Accounts", desc: "Google, System" },
];

export default function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [appState, setAppState] = useState<"normal" | "intercepted">("normal");
  const [messages, setMessages] = useState<Message[]>([CALM_MESSAGE]);
  const [inputValue, setInputValue] = useState("");

  const [language, setLanguage] = useState<"en" | "ur">("en");
  const [isNotified, setIsNotified] = useState(false);

  const robotoFont = { fontFamily: '"Roboto", sans-serif' };
  const urduFont = {
    fontFamily: '"Noto Nastaliq Urdu", serif',
    lineHeight: "1.8",
  };
  const getDynamicFont = (lang: "en" | "ur") =>
    lang === "ur" ? urduFont : robotoFont;

  const chatEndRef = useRef<HTMLDivElement>(null);

  const isNotifyEnabled =
    messages.some((m) => m.type === "warning") || messages.length > 1;

  useEffect(() => {
    if (isChatOpen && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isChatOpen]);

  const handleFactoryResetClick = () => {
    setAppState("intercepted");
    setMessages([YELLOW_WARNING]);
    setIsChatOpen(true);
  };

  const handleDismiss = () => {
    setIsChatOpen(false);
    setAppState("normal");
  };

  const handleOpenChat = () => {
    setIsChatOpen(true);
    if (appState === "normal") {
      if (!messages.length || messages[0].type === "warning") {
        setMessages([CALM_MESSAGE]);
      }
    }
  };

  const handleCancelAction = () => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === "warning-1" ? { ...msg, hideButtons: true } : msg,
      ),
    );

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      type: "text",
      content: { en: "Cancel Action", ur: "عمل منسوخ کریں" },
    };
    setMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      const aiReply: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        type: "text",
        content: {
          en: "Action cancelled. Your data is safe. Let me know if you need anything else.",
          ur: "عمل منسوخ کر دیا گیا۔ آپ کا ڈیٹا محفوظ ہے۔ اگر آپ کو کسی اور چیز کی ضرورت ہو تو مجھے بتائیں۔",
        },
      };
      setMessages((prev) => [...prev, aiReply]);
      setTimeout(() => setAppState("normal"), 800); // Remove yellow highlight
    }, 600);
  };

  const handleContinueAnyway = () => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === "warning-1" ? { ...msg, hideButtons: true } : msg,
      ),
    );

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      type: "text",
      content: { en: "Continue Anyway", ur: "پھر بھی جاری رکھیں" },
    };
    setMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      const aiReply: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        type: "text",
        content: {
          en: "Proceeding... please be aware this action cannot be undone.",
          ur: "آگے بڑھ رہا ہے... براہ کرم آگاہ رہیں کہ یہ عمل واپس نہیں کیا جا سکتا۔",
        },
      };
      setMessages((prev) => [...prev, aiReply]);
      setTimeout(() => setAppState("normal"), 800);
    }, 600);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      type: "text",
      content: { en: inputValue, ur: inputValue },
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputValue("");

    setTimeout(() => {
      const aiReply: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        type: "text",
        content: {
          en: "I am here to protect your device. I have noted your message.",
          ur: "میں آپ کے آلے کی حفاظت کے لیے حاضر ہوں۔ میں نے آپ کا پیغام نوٹ کر لیا ہے۔",
        },
      };
      setMessages((prev) => [...prev, aiReply]);
    }, 1000);
  };

  const sendQuickPrompt = (prompt: { en: string; ur: string }) => {
    const newMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      type: "text",
      content: prompt,
    };

    setMessages((prev) => [...prev, newMsg]);

    setTimeout(() => {
      const aiReply: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        type: "text",
        content: {
          en: "I can certainly help you with that. Let me take a look...",
          ur: "میں یقیناً اس میں آپ کی مدد کر سکتا ہوں۔ مجھے دیکھنے دیں...",
        },
      };
      setMessages((prev) => [...prev, aiReply]);
    }, 1000);
  };

  const handleNotifyProxy = () => {
    if (!isNotifyEnabled || isNotified) return;
    setIsNotified(true);
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "ur" : "en"));
  };

  return (
    <div
      className="relative flex h-full w-full flex-col bg-neutral-50"
      style={getDynamicFont(language)}
    >
      {/* Status Bar */}
      <div className="h-12 flex items-center justify-between px-6 text-neutral-900 text-sm font-medium z-10 bg-neutral-50/80 backdrop-blur-sm relative shrink-0">
        <span>9:41</span>
        <div className="flex items-center gap-2">
          <Signal className="w-4 h-4" />
          <Wifi className="w-4 h-4" />
          <Battery className="w-5 h-5" />
        </div>
      </div>

      {/* 50% Scrim Overlay when intercepted */}
      <AnimatePresence>
        {appState === "intercepted" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 z-20 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center gap-4 px-4 py-3 bg-neutral-50 relative z-10 shrink-0">
        <button className="text-neutral-900">
          <ChevronLeft className="w-7 h-7" />
        </button>
        <span className="text-2xl font-normal text-neutral-900 flex-1">
          Settings
        </span>
        <button className="text-neutral-900 w-10 h-10 flex items-center justify-center rounded-full hover:bg-neutral-200/50">
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* Settings List */}
      <div className="flex-1 overflow-y-auto flex flex-col relative z-10">
        <div className="flex flex-col py-2">
          {SETTINGS_LIST.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-4 px-5 py-4 hover:bg-neutral-200/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <item.icon className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-medium text-neutral-900">
                  {item.title}
                </span>
                <span className="text-[13px] text-neutral-500">
                  {item.desc}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex-1" />

        {/* Factory Data Reset Button */}
        <div
          className={`mt-auto mb-10 mx-4 transition-all duration-500 rounded-2xl ${
            appState === "intercepted"
              ? "relative z-50 ring-4 ring-[#FFC107] bg-white shadow-[0_0_30px_rgba(255,193,7,0.4)] scale-[1.02]"
              : "bg-white shadow-sm border border-neutral-200/50"
          }`}
        >
          <button
            onClick={handleFactoryResetClick}
            className="w-full flex items-center gap-4 p-4 text-left rounded-2xl"
          >
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500 shrink-0">
              <Trash2 className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-medium text-red-600">
                Factory Data Reset
              </span>
              <span className="text-[13px] text-neutral-500">
                Erase all data on phone
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Sahara Element (Blip) */}
      {!isChatOpen && (
        <button
          onClick={handleOpenChat}
          className="absolute top-[92px] right-4 w-11 h-11 rounded-full text-white shadow-md flex items-center justify-center z-30 hover:scale-105 active:scale-95 transition-transform overflow-visible bg-[#00695C]"
          aria-label="Sahara Assistant"
        >
          <div className="relative z-10 w-full h-full rounded-full flex items-center justify-center shadow-inner overflow-hidden border-2 border-white/20 bg-white">
            <img
              src={flowSaharaLogo}
              alt="Sahara Logo"
              className="w-full h-full object-cover"
            />
          </div>
        </button>
      )}

      {/* Sahara AI Chat Window (Top Sheet) */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            style={robotoFont}
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.5 }}
            className="absolute top-0 left-0 right-0 h-[68%] bg-neutral-50 rounded-b-[32px] shadow-[0_10px_40px_rgba(0,0,0,0.2)] z-40 flex flex-col overflow-hidden border-b border-neutral-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-neutral-100 z-10 shadow-sm shrink-0 pt-12">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-white overflow-hidden shrink-0 ${appState === "intercepted" ? "bg-[#FFF8E1] border border-[#FFE082]" : "bg-transparent border border-neutral-200 shadow-sm"}`}
                >
                  {appState === "intercepted" ? (
                    <AlertTriangle className="w-5 h-5 text-[#FFB300]" />
                  ) : (
                    <img
                      src={flowSaharaLogo}
                      className="w-full h-full object-cover"
                      alt="Sahara Logo"
                    />
                  )}
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
                <button
                  onClick={toggleLanguage}
                  className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 bg-neutral-100 text-neutral-600 hover:bg-neutral-200 rounded-lg transition-colors border border-neutral-200"
                  aria-label="Toggle Language"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-bold">
                    {language === "en" ? "اردو" : "EN"}
                  </span>
                </button>

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
                          ? msg.type === "warning"
                            ? "bg-[#FFF8E1] text-[#FFB300]"
                            : "bg-transparent shadow-sm border border-neutral-200"
                          : "bg-blue-100 text-blue-500"
                      }`}
                    >
                      {msg.role === "ai" ? (
                        msg.type === "warning" ? (
                          <AlertTriangle className="w-3.5 h-3.5" />
                        ) : (
                          <img
                            src={flowSaharaLogo}
                            className="w-full h-full object-cover"
                            alt="Sahara Logo"
                          />
                        )
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
                          : msg.type === "warning"
                            ? "bg-[#FFF8E1] border border-[#FFE082] text-neutral-900 rounded-tl-sm"
                            : "bg-white border border-neutral-100 text-neutral-900 rounded-tl-sm"
                      }
                    `}
                  >
                    <div
                      style={getDynamicFont(language)}
                      dir={language === "ur" ? "rtl" : "ltr"}
                      className={msg.type === "warning" ? "font-bold" : ""}
                    >
                      {msg.content[language]}
                    </div>

                    {/* Warning Specific Buttons */}
                    {msg.type === "warning" && !msg.hideButtons && (
                      <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-[#FFE082]/60">
                        <button
                          onClick={handleCancelAction}
                          style={getDynamicFont(language)}
                          className="w-full py-2.5 px-4 bg-[#00695C] text-white rounded-xl font-semibold text-sm hover:bg-[#004D40] active:scale-[0.98] transition-all shadow-sm"
                        >
                          {language === "en"
                            ? "Cancel Action"
                            : "عمل منسوخ کریں"}
                        </button>
                        <button
                          onClick={handleContinueAnyway}
                          style={getDynamicFont(language)}
                          className="w-full py-2.5 px-4 text-[#00695C] bg-white border border-[#00695C]/40 rounded-xl font-semibold text-sm hover:bg-[#00695C]/5 hover:border-[#00695C] active:scale-[0.98] transition-all"
                        >
                          {language === "en"
                            ? "Continue Anyway"
                            : "پھر بھی جاری رکھیں"}
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
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

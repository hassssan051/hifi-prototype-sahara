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

const INITIAL_WARNING: Message = {
  id: "1",
  role: "ai",
  type: "warning",
  content: {
    en: "Warning: This message looks like a scam trying to steal your information.",
    ur: "انتباہ: یہ پیغام ایک دھوکہ لگتا ہے جو آپ کی معلومات چرانے کی کوشش کر رہا ہے۔",
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
    en: "Is this message safe?",
    ur: "کیا یہ پیغام محفوظ ہے؟",
  },
  {
    id: "family",
    en: "Help me contact my family",
    ur: "میرے گھر والوں سے رابطہ کریں",
  },
];

export default function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [blipState, setBlipState] = useState<"red" | "teal">("red");
  const [messages, setMessages] = useState<Message[]>([INITIAL_WARNING]);
  const [inputValue, setInputValue] = useState("");

  // New States
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

  // Derived state for Notify Proxy
  const isNotifyEnabled =
    messages.some((m) => m.type === "warning") || messages.length > 1;

  // Auto-scroll to bottom of chat when new messages arrive
  useEffect(() => {
    if (isChatOpen && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isChatOpen]);

  const handleDismiss = () => {
    setIsChatOpen(false);
    setBlipState("teal");
  };

  const handleOpenChat = () => {
    setIsChatOpen(true);
    // If opening from red state, ensure warning is there. If teal, show calm message.
    if (blipState === "red") {
      if (!messages.some((m) => m.type === "warning")) {
        setMessages([{ ...INITIAL_WARNING, hideButtons: false }]);
      }
    } else {
      if (
        messages.length === 0 ||
        (messages.length === 1 && messages[0].type === "warning")
      ) {
        setMessages([CALM_MESSAGE]);
      }
    }
  };

  const handleLearnMore = () => {
    // Hide buttons on the warning message
    setMessages((prev) =>
      prev.map((msg) => (msg.id === "1" ? { ...msg, hideButtons: true } : msg)),
    );

    // Add User response
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      type: "text",
      content: {
        en: "Learn More",
        ur: "مزید جانیں",
      },
    };

    setMessages((prev) => [...prev, userMsg]);

    // Add AI response after a tiny delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        type: "text",
        content: {
          en: "This text contains a fake link (`http://fake-bisp.pk`). Official BISP communications never ask you to click unofficial links to claim funds. Scammers use these links to trick you into providing personal information or stealing your money. Do not click the link or reply to this sender.",
          ur: "اس متن میں ایک جعلی لنک (`http://fake-bisp.pk`) ہے۔ سرکاری BISP مواصلات کبھی بھی آپ کو فنڈز کا دعوی کرنے کے لیے غیر سرکاری لنکس پر کلک کرنے کا نہیں کہتیں۔ دھوکے باز ان لنکس کو آپ کی ذاتی معلومات فراہم کرنے یا آپ کے پیسے چرانے کے لیے استعمال کرتے ہیں۔ لنک پر کلک نہ کریں یا اس بھیجنے والے کو جواب نہ دیں۔",
        },
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 600);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      type: "text",
      content: {
        en: inputValue,
        ur: inputValue, // In a real app, we'd translate this input or store it as is.
      },
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputValue("");

    // Simulated AI response for demo purposes
    setTimeout(() => {
      const aiReply: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        type: "text",
        content: {
          en: "I am here to protect you from suspicious messages. I have noted your message.",
          ur: "میں آپ کو مشکوک پیغامات سے بچانے کے لیے حاضر ہوں۔ میں نے آپ کا پیغام نوٹ کر لیا ہے۔",
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

  return (
    <div
      className="relative flex h-full w-full flex-col bg-white"
      style={getDynamicFont(language)}
    >
      {/* Status Bar */}
      <div className="h-12 flex items-center justify-between px-6 text-neutral-900 text-sm font-medium z-10 bg-white/80 backdrop-blur-sm relative">
        <span>9:41</span>
        <div className="flex items-center gap-2">
          <Signal className="w-4 h-4" />
          <Wifi className="w-4 h-4" />
          <Battery className="w-5 h-5" />
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-neutral-200 relative z-10">
        <div className="flex items-center gap-3">
          <button className="text-blue-500 hover:bg-blue-50 p-1 rounded-full transition-colors">
            <ChevronLeft className="w-7 h-7" />
          </button>
          <div className="flex flex-col">
            <span className="font-semibold text-neutral-900 text-[17px]">
              8171
            </span>
            <span className="text-xs text-neutral-500">Text Message</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-blue-500">
          <button className="hover:bg-blue-50 p-1.5 rounded-full transition-colors">
            <Phone className="w-5 h-5" />
          </button>
          <button className="hover:bg-blue-50 p-1.5 rounded-full transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Message Area */}
      <div className="flex-1 bg-neutral-50 p-4 flex flex-col overflow-y-auto relative z-10">
        <div className="text-center text-xs text-neutral-400 font-medium my-4 uppercase tracking-wider">
          Today 9:41 AM
        </div>

        <div className="flex flex-col items-start max-w-[85%] relative">
          <div
            className={`px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm leading-relaxed text-[15px] transition-all duration-300 ${
              isChatOpen
                ? "bg-white text-neutral-900 ring-2 ring-red-500 relative z-30 shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                : "bg-[#E9E9EB] text-neutral-900 relative z-10"
            }`}
          >
            BISP: You have received Rs. 25000. Click link to claim:{" "}
            <a href="#" className="text-blue-600 underline underline-offset-2">
              http://fake-bisp.pk
            </a>
          </div>
        </div>
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-white border-t border-neutral-200 flex items-end gap-3 pb-8 relative z-10">
        <div className="flex-1 bg-neutral-100 rounded-full px-4 py-2.5 flex items-center min-h-[40px]">
          <span className="text-neutral-400 text-sm">Text Message</span>
        </div>
        <button className="bg-blue-500 text-white p-2 rounded-full flex-shrink-0 flex items-center justify-center w-10 h-10 shadow-sm">
          <Send className="w-5 h-5 ml-0.5" />
        </button>
      </div>

      {/* Sahara Element (Blip) */}
      {!isChatOpen && (
        <button
          onClick={handleOpenChat}
          className={`absolute bottom-24 right-6 w-14 h-14 rounded-full text-white shadow-lg flex items-center justify-center z-30 hover:scale-105 active:scale-95 transition-transform overflow-visible ${
            blipState === "red" ? "bg-red-500" : "bg-[#00695C]"
          }`}
          aria-label="Sahara Assistant"
        >
          {blipState === "red" && (
            <>
              {/* Pulsing rings */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-red-500"
                animate={{ scale: [1, 1.5], opacity: [0.8, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-red-500"
                animate={{ scale: [1, 1.5], opacity: [0.8, 0] }}
                transition={{
                  duration: 1.5,
                  delay: 0.75,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
            </>
          )}

          {/* Main Blip Core */}
          {blipState === "red" ? (
            <div className="relative z-10 w-full h-full rounded-full flex items-center justify-center shadow-inner bg-gradient-to-tr from-red-600 to-red-400">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
          ) : (
            <div className="relative z-10 w-full h-full rounded-full flex items-center justify-center shadow-inner overflow-hidden border-2 border-white/20 bg-white">
              <img
                src={flowSaharaLogo}
                alt="Sahara Logo"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </button>
      )}

      {/* Sahara AI Chat Window (Bottom Sheet) */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            style={robotoFont}
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="absolute bottom-0 left-0 right-0 h-[65%] bg-neutral-50 rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.2)] z-40 flex flex-col overflow-hidden border-t border-neutral-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-neutral-100 z-10 shadow-sm shrink-0">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-white overflow-hidden shrink-0 ${blipState === "red" ? "bg-red-500" : "bg-transparent border border-neutral-200 shadow-sm"}`}
                >
                  {blipState === "red" ? (
                    <ShieldAlert className="w-5 h-5" />
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
                          ? msg.type === "warning"
                            ? "bg-red-100 text-red-500"
                            : "bg-transparent shadow-sm border border-neutral-200"
                          : "bg-blue-100 text-blue-500"
                      }`}
                    >
                      {msg.role === "ai" ? (
                        msg.type === "warning" ? (
                          <Bot className="w-3.5 h-3.5" />
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
                            ? "bg-red-50 border border-red-100 text-neutral-900 rounded-tl-sm"
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
                      <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-red-200/50">
                        <button
                          onClick={handleDismiss}
                          style={getDynamicFont(language)}
                          className="w-full py-2.5 px-4 bg-[#00695C] text-white rounded-xl font-semibold text-sm hover:bg-[#004D40] active:scale-[0.98] transition-all shadow-sm"
                        >
                          {language === "en"
                            ? "Dismiss / Go Back"
                            : "برخاست کریں / واپس جائیں"}
                        </button>
                        <button
                          onClick={handleLearnMore}
                          style={getDynamicFont(language)}
                          className="w-full py-2.5 px-4 text-[#00695C] bg-white border border-[#00695C]/30 rounded-xl font-semibold text-sm hover:bg-[#00695C]/5 hover:border-[#00695C] active:scale-[0.98] transition-all"
                        >
                          {language === "en" ? "Learn More" : "مزید جانیں"}
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

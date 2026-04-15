import { useEffect, useRef, useState } from "react";
import {
  ArrowUp,
  Battery,
  BellRing,
  Bot,
  CheckCircle2,
  ChevronLeft,
  Globe,
  MoreVertical,
  Phone,
  Send,
  ShieldAlert,
  ShieldCheck,
  Signal,
  User,
  Wifi,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

type ScenarioKey = "scam-trap" | "irreversible-action";

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

type ElderDeviceScreenProps = {
  activeScenario: ScenarioKey;
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

export default function ElderDeviceScreen({
  activeScenario,
}: ElderDeviceScreenProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [blipState, setBlipState] = useState<"red" | "teal">("red");
  const [messages, setMessages] = useState<Message[]>([INITIAL_WARNING]);
  const [inputValue, setInputValue] = useState("");
  const [language, setLanguage] = useState<"en" | "ur">("en");
  const [isNotified, setIsNotified] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const isNotifyEnabled =
    messages.some((message) => message.type === "warning") ||
    messages.length > 1;

  useEffect(() => {
    if (isChatOpen && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isChatOpen]);

  useEffect(() => {
    const isScamScenario = activeScenario === "scam-trap";
    setIsChatOpen(false);
    setBlipState(isScamScenario ? "red" : "teal");
    setIsNotified(false);
    setInputValue("");
    setMessages(isScamScenario ? [INITIAL_WARNING] : [CALM_MESSAGE]);
  }, [activeScenario]);

  const handleDismiss = () => {
    setIsChatOpen(false);
    setBlipState("teal");
  };

  const handleOpenChat = () => {
    setIsChatOpen(true);

    if (blipState === "red") {
      if (!messages.some((message) => message.type === "warning")) {
        setMessages([{ ...INITIAL_WARNING, hideButtons: false }]);
      }
    } else if (
      messages.length === 0 ||
      (messages.length === 1 && messages[0].type === "warning")
    ) {
      setMessages([CALM_MESSAGE]);
    }
  };

  const handleLearnMore = () => {
    setMessages((previous) =>
      previous.map((message) =>
        message.id === "1" ? { ...message, hideButtons: true } : message,
      ),
    );

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      type: "text",
      content: {
        en: "Learn More",
        ur: "مزید جانیں",
      },
    };

    setMessages((previous) => [...previous, userMessage]);

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        type: "text",
        content: {
          en: "This text contains a fake link (`http://fake-bisp.pk`). Official BISP messages never ask you to click unofficial links to claim funds. Do not click the link or reply to this sender.",
          ur: "اس متن میں ایک جعلی لنک (`http://fake-bisp.pk`) ہے۔ سرکاری BISP پیغامات کبھی بھی فنڈز کا دعویٰ کرنے کے لیے غیر سرکاری لنکس پر کلک کرنے کا نہیں کہتے۔ لنک پر کلک نہ کریں اور جواب نہ دیں۔",
        },
      };
      setMessages((previous) => [...previous, aiResponse]);
    }, 600);
  };

  const handleSendMessage = (event: React.FormEvent) => {
    event.preventDefault();
    if (!inputValue.trim()) {
      return;
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      type: "text",
      content: {
        en: inputValue,
        ur: inputValue,
      },
    };

    setMessages((previous) => [...previous, newMessage]);
    setInputValue("");

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
      setMessages((previous) => [...previous, aiReply]);
    }, 1000);
  };

  const sendQuickPrompt = (prompt: { en: string; ur: string }) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      type: "text",
      content: prompt,
    };

    setMessages((previous) => [...previous, newMessage]);

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
      setMessages((previous) => [...previous, aiReply]);
    }, 1000);
  };

  const handleNotifyProxy = () => {
    if (!isNotifyEnabled || isNotified) {
      return;
    }

    setIsNotified(true);
  };

  const toggleLanguage = () => {
    setLanguage((previous) => (previous === "en" ? "ur" : "en"));
  };

  const inboundText =
    activeScenario === "scam-trap"
      ? "BISP: You have received Rs. 25000. Click link to claim:"
      : "Android System: This action permanently deletes selected photos.";

  const inboundActionText =
    activeScenario === "scam-trap" ? "http://fake-bisp.pk" : "Delete now";

  return (
    <div className="relative flex h-full w-full flex-col bg-white">
      <div className="relative z-10 flex h-12 items-center justify-between bg-white/80 px-6 text-sm font-medium text-neutral-900 backdrop-blur-sm">
        <span>9:41</span>
        <div className="flex items-center gap-2">
          <Signal className="h-4 w-4" />
          <Wifi className="h-4 w-4" />
          <Battery className="h-5 w-5" />
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-3">
        <div className="flex items-center gap-3">
          <button className="rounded-full p-1 text-blue-500 transition-colors hover:bg-blue-50">
            <ChevronLeft className="h-7 w-7" />
          </button>
          <div className="flex flex-col">
            <span className="text-[17px] font-semibold text-neutral-900">
              8171
            </span>
            <span className="text-xs text-neutral-500">Text Message</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-blue-500">
          <button className="rounded-full p-1.5 transition-colors hover:bg-blue-50">
            <Phone className="h-5 w-5" />
          </button>
          <button className="rounded-full p-1.5 transition-colors hover:bg-blue-50">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="relative z-10 flex flex-1 flex-col overflow-y-auto bg-neutral-50 p-4">
        <div className="my-4 text-center text-xs font-medium tracking-wider text-neutral-400 uppercase">
          Today 9:41 AM
        </div>

        <div className="relative flex max-w-[85%] flex-col items-start">
          <div
            className={`rounded-2xl rounded-tl-sm px-4 py-3 text-[15px] leading-relaxed shadow-sm transition-all duration-300 ${
              isChatOpen
                ? "relative z-30 bg-white text-neutral-900 ring-2 ring-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                : "relative z-10 bg-[#E9E9EB] text-neutral-900"
            }`}
          >
            {inboundText}{" "}
            <a href="#" className="text-blue-600 underline underline-offset-2">
              {inboundActionText}
            </a>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex items-end gap-3 border-t border-neutral-200 bg-white p-3 pb-8">
        <div className="flex min-h-[40px] flex-1 items-center rounded-full bg-neutral-100 px-4 py-2.5">
          <span className="text-sm text-neutral-400">Text Message</span>
        </div>
        <button className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-white shadow-sm">
          <Send className="ml-0.5 h-5 w-5" />
        </button>
      </div>

      {!isChatOpen && (
        <button
          onClick={handleOpenChat}
          className={`absolute right-6 bottom-24 z-30 flex h-14 w-14 items-center justify-center overflow-visible rounded-full text-white shadow-lg transition-transform hover:scale-105 active:scale-95 ${
            blipState === "red" ? "bg-red-500" : "bg-[#008080]"
          }`}
          aria-label="Sahara Assistant"
        >
          {blipState === "red" && (
            <>
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

          <div
            className={`relative z-10 flex h-full w-full items-center justify-center rounded-full shadow-inner ${
              blipState === "red"
                ? "bg-gradient-to-tr from-red-600 to-red-400"
                : "bg-gradient-to-tr from-[#008080] to-[#20b2b2]"
            }`}
          >
            {blipState === "red" ? (
              <ShieldAlert className="h-6 w-6 text-white" />
            ) : (
              <ShieldCheck className="h-6 w-6 text-white" />
            )}
          </div>
        </button>
      )}

      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="absolute right-0 bottom-0 left-0 z-40 flex h-[65%] flex-col overflow-hidden rounded-t-[32px] border-t border-neutral-200 bg-neutral-50 shadow-[0_-10px_40px_rgba(0,0,0,0.2)]"
          >
            <div className="z-10 flex shrink-0 items-center justify-between border-b border-neutral-100 bg-white px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-white ${
                    blipState === "red" ? "bg-red-500" : "bg-[#008080]"
                  }`}
                >
                  {blipState === "red" ? (
                    <ShieldAlert className="h-5 w-5" />
                  ) : (
                    <ShieldCheck className="h-5 w-5" />
                  )}
                </div>
                <div className="flex flex-col">
                  <h2 className="text-[15px] leading-tight font-bold text-neutral-900">
                    Sahara
                  </h2>
                  <p className="text-[10px] font-bold tracking-wide text-[#008080] uppercase">
                    {language === "en" ? "AI Agent" : "اے آئی ایجنٹ"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleLanguage}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-neutral-200 bg-neutral-100 px-2.5 py-1.5 text-neutral-600 transition-colors hover:bg-neutral-200"
                  aria-label="Toggle Language"
                >
                  <Globe className="h-3.5 w-3.5" />
                  <span className="text-[11px] font-bold">
                    {language === "en" ? "اردو" : "EN"}
                  </span>
                </button>

                <button
                  onClick={handleNotifyProxy}
                  disabled={!isNotifyEnabled || isNotified}
                  className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 transition-all ${
                    isNotified
                      ? "border-green-200 bg-green-50 text-green-700"
                      : isNotifyEnabled
                        ? "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 active:scale-95"
                        : "border-neutral-100 bg-neutral-50 text-neutral-400 opacity-70"
                  }`}
                >
                  {isNotified ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : (
                    <BellRing className="h-3.5 w-3.5" />
                  )}
                  <span className="hidden text-[11px] font-bold sm:inline-block">
                    {isNotified
                      ? language === "en"
                        ? "Notified"
                        : "مطلع کر دیا"
                      : language === "en"
                        ? "Notify Proxy"
                        : "پراکسی کو بتائیں"}
                  </span>
                </button>

                <button
                  onClick={handleDismiss}
                  className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 transition-colors hover:bg-neutral-200"
                  aria-label="Close Chat"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
              {messages.map((message) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={message.id}
                  className={`flex max-w-[88%] flex-col ${
                    message.role === "user"
                      ? "self-end items-end"
                      : "self-start items-start"
                  }`}
                >
                  <div
                    className={`mb-1 flex items-center gap-1.5 ${
                      message.role === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full ${
                        message.role === "ai"
                          ? message.type === "warning"
                            ? "bg-red-100 text-red-500"
                            : "bg-[#008080]/10 text-[#008080]"
                          : "bg-blue-100 text-blue-500"
                      }`}
                    >
                      {message.role === "ai" ? (
                        <Bot className="h-3 w-3" />
                      ) : (
                        <User className="h-3 w-3" />
                      )}
                    </div>
                    <span className="text-[11px] font-medium text-neutral-500">
                      {message.role === "ai"
                        ? "Sahara"
                        : language === "en"
                          ? "You"
                          : "آپ"}
                    </span>
                  </div>

                  <div
                    className={`rounded-2xl px-4 py-3 text-[15px] shadow-sm ${
                      message.role === "user"
                        ? "rounded-tr-sm bg-neutral-800 text-white"
                        : message.type === "warning"
                          ? "rounded-tl-sm border border-red-100 bg-red-50 text-neutral-900"
                          : "rounded-tl-sm border border-neutral-100 bg-white text-neutral-900"
                    }`}
                  >
                    <div
                      dir={language === "ur" ? "rtl" : "ltr"}
                      className={message.type === "warning" ? "font-bold" : ""}
                    >
                      {message.content[language]}
                    </div>

                    {message.type === "warning" && !message.hideButtons && (
                      <div className="mt-4 flex flex-col gap-2 border-t border-red-200/50 pt-4">
                        <button
                          onClick={handleDismiss}
                          className="w-full rounded-xl bg-[#008080] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#006666] active:scale-[0.98]"
                        >
                          {language === "en"
                            ? "Dismiss / Go Back"
                            : "برخاست کریں / واپس جائیں"}
                        </button>
                        <button
                          onClick={handleLearnMore}
                          className="w-full rounded-xl border border-[#008080]/30 bg-white px-4 py-2.5 text-sm font-semibold text-[#008080] transition-all hover:border-[#008080] hover:bg-teal-50 active:scale-[0.98]"
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

            <div className="flex flex-col border-t border-neutral-100 bg-white pb-6">
              <div
                className="flex w-full max-w-full gap-2 overflow-x-auto px-3 py-3 [&::-webkit-scrollbar]:hidden"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt.id}
                    onClick={() =>
                      sendQuickPrompt({ en: prompt.en, ur: prompt.ur })
                    }
                    className="whitespace-nowrap rounded-full border border-neutral-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-[#008080] shadow-sm transition-all hover:bg-neutral-50 active:scale-95"
                  >
                    {prompt[language]}
                  </button>
                ))}
              </div>

              <div className="px-3">
                <form
                  onSubmit={handleSendMessage}
                  className="flex items-center gap-2 rounded-full bg-neutral-100 px-2 py-1"
                >
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
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
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-neutral-900 text-white transition-colors disabled:bg-neutral-300 disabled:text-neutral-500"
                  >
                    <ArrowUp className="h-4 w-4" />
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

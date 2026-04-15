import React, { useState, useRef, useEffect } from "react";
import {
  Battery,
  Wifi,
  Signal,
  ChevronLeft,
  Phone,
  MoreVertical,
  Video,
  Smile,
  Paperclip,
  Camera,
  Mic,
  Image as ImageIcon,
  FileText,
  MapPin,
  User,
  Music,
  Maximize2,
  CheckCircle2,
  Circle,
  Globe,
  X,
  BellRing,
  Send,
  Bot,
  ArrowUp,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { flowSaharaLogo as saharaLogo } from "../components/sahara/flows/flowLogo";

// --- Types & Dictionary ---

type WalkthroughStep =
  | "idle"
  | "prompt"
  | "step1"
  | "step2"
  | "step3"
  | "completed";
type Language = "en" | "ur";
type Message = {
  id: string;
  role: "user" | "ai";
  content: { en: string; ur: string };
  type?: "normal" | "warning";
};

const dict = {
  promptTitle: { en: "Sahara AI Agent", ur: "اے آئی ایجنٹ" },
  promptMsg: {
    en: "We've sent a photo together before! Step-by-step reminder?",
    ur: "ہم نے پہلے بھی ایک ساتھ تصویر بھیجی ہے! کیا قدم بہ قدم یاد دہانی چاہیے؟",
  },
  btnYes: { en: "Yes, start walkthrough", ur: "ہاں، واک تھرو شروع کریں" },
  btnOpenChat: { en: "No, just open chat", ur: "نہیں، بس چیٹ کھولیں" },
  step1Msg: {
    en: "Step 1 of 3: Tap the paperclip icon.",
    ur: "مرحلہ 1 از 3: پیپر کلپ آئیکن پر ٹیپ کریں۔",
  },
  step2Msg: {
    en: "Step 2 of 3: Tap 'Gallery'.",
    ur: "مرحلہ 2 از 3: 'گیلری' پر ٹیپ کریں۔",
  },
  step3Msg: {
    en: "Step 3 of 3: Select your photo.",
    ur: "مرحلہ 3 از 3: اپنی تصویر منتخب کریں۔",
  },
  completedMsg: {
    en: "Walkthrough Complete! You can now send the photo.",
    ur: "واک تھرو مکمل! اب آپ تصویر بھیج سکتے ہیں۔",
  },
  btnDontUnderstand: { en: "I don't understand", ur: "مجھے سمجھ نہیں آ رہا" },
  btnCancel: { en: "Cancel Walkthrough", ur: "واک تھرو منسوخ کریں" },
  btnDone: { en: "Done", ur: "ہو گیا" },
  btnNotify: { en: "Notify Proxy", ur: "پراکسی کو بتائیں" },
  notified: { en: "Notified", ur: "مطلع کر دیا" },
  timeline1: { en: "Tap the paperclip icon", ur: "پیپر کلپ آئیکن پر ٹیپ کریں" },
  timeline2: { en: "Tap 'Gallery'", ur: "'گیلری' پر ٹیپ کریں" },
  timeline3: { en: "Select your photo", ur: "اپنی تصویر منتخب کریں" },
  walkthroughProgress: { en: "Walkthrough Progress", ur: "واک تھرو کی پیشرفت" },
  msgUserDontUnderstand: {
    en: "I don't understand what to do here.",
    ur: "مجھے سمجھ نہیں آ رہا کہ یہاں کیا کرنا ہے۔",
  },
  expStep1: {
    en: "The paperclip icon lets you attach things. It's highlighted in blue at the bottom right. Tap it to continue.",
    ur: "پیپر کلپ آئیکن آپ کو چیزیں منسلک کرنے دیتا ہے۔ یہ نیچے دائیں جانب نیلے رنگ میں نمایاں ہے۔ جاری رکھنے کے لیے اسے ٹیپ کریں۔",
  },
  expStep2: {
    en: "The Gallery is where your phone stores photos. Tap the purple Gallery icon highlighted in blue.",
    ur: "گیلری وہ جگہ ہے جہاں آپ کے فون کی تصاویر ہوتی ہیں۔ نیلے رنگ میں نمایاں جامنی گیلری آئیکن پر ٹیپ کریں۔",
  },
  expStep3: {
    en: "Now you are in your Gallery. Tap the photo you want to send. It's highlighted in blue.",
    ur: "اب آپ اپنی گیلری میں ہیں۔ وہ تصویر ٹیپ کریں جو آپ بھیجنا چاہتے ہیں۔ یہ نیلے رنگ میں نمایاں ہے۔",
  },
  askPlaceholder: {
    en: "Ask Sahara a question...",
    ur: "صحارا سے کوئی سوال پوچھیں...",
  },
  you: { en: "You", ur: "آپ" },
  quickPrompt1: {
    en: "Explain what's on my screen",
    ur: "میری سکرین پر کیا ہے؟",
  },
  quickPrompt2: { en: "Is this message safe?", ur: "کیا یہ پیغام محفوظ ہے؟" },
  quickPrompt3: { en: "Help me reply", ur: "جواب دینے میں مدد کریں" },
};

export default function App() {
  // --- State ---
  const [appState, setAppState] = useState<WalkthroughStep>("idle");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [language, setLanguage] = useState<Language>("en");
  const [isNotified, setIsNotified] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "ai",
      content: {
        en: "Hi! I'm Sahara. I'm here to help you navigate your phone safely.",
        ur: "ہیلو! میں صحارا ہوں۔ میں آپ کے فون کو محفوظ طریقے سے نیویگیٹ کرنے میں مدد کے لیے حاضر ہوں۔",
      },
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  const chatEndRef = useRef<HTMLDivElement>(null);

  // --- Fonts ---
  const robotoFont = { fontFamily: '"Roboto", sans-serif' };
  const urduFont = {
    fontFamily: '"Noto Nastaliq Urdu", serif',
    lineHeight: "1.8",
  };
  const getDynamicFont = (lang: Language) =>
    lang === "ur" ? urduFont : robotoFont;

  // --- Auto Scroll Chat ---
  useEffect(() => {
    if (isChatOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isChatOpen]);

  // --- Handlers ---
  const handleBlipClick = () => setAppState("prompt");
  const handleYes = () => setAppState("step1");
  const handleOpenChatOnly = () => {
    setAppState("idle");
    setIsChatOpen(true);
  };

  const handlePaperclipClick = () => {
    if (appState === "step1") setAppState("step2");
  };
  const handleGalleryClick = () => {
    if (appState === "step2") setAppState("step3");
  };
  const handlePhotoClick = () => {
    if (appState === "step3") setAppState("completed");
  };

  const handleExpandChat = () => setIsChatOpen(true);

  const handleCancelWalkthrough = () => {
    setAppState("idle");
    setIsChatOpen(true);
  };

  const handleCloseChat = () => setIsChatOpen(false);

  const handleNotifyProxy = () => {
    if (!isNotified) setIsNotified(true);
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
        content: dict.msgUserDontUnderstand,
      },
      { id: (Date.now() + 1).toString(), role: "ai", content: aiExplanation },
    ]);
    setIsChatOpen(true);
  };

  const handleSendMessage = (e?: React.FormEvent, textOverride?: string) => {
    if (e) e.preventDefault();
    const textToSend = textOverride || inputValue.trim();
    if (!textToSend) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: "user",
        content: { en: textToSend, ur: textToSend },
      },
    ]);
    if (!textOverride) setInputValue("");

    // Fake AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "ai",
          content: {
            en: "I'm currently focused on helping you with this walkthrough. Feel free to follow the highlighted steps!",
            ur: "میں فی الحال آپ کو اس واک تھرو میں مدد کرنے پر توجہ مرکوز کر رہا ہوں۔ نمایاں مراحل پر عمل کریں!",
          },
        },
      ]);
    }, 1000);
  };

  // --- UI Components ---

  const renderTimelineItem = (
    status: "done" | "active" | "pending",
    textKey: keyof typeof dict,
    isLast = false,
  ) => (
    <div className="flex items-start gap-3 relative">
      {!isLast && (
        <div
          className={`absolute left-[11px] top-6 bottom-[-16px] w-[2px] ${status === "done" ? "bg-[#00695C]" : "bg-neutral-200"}`}
        />
      )}
      <div className="relative z-10 shrink-0 mt-0.5 bg-white">
        {status === "done" && (
          <CheckCircle2 className="w-6 h-6 text-[#00695C]" fill="#E0F2F1" />
        )}
        {status === "active" && (
          <div className="w-6 h-6 rounded-full border-2 border-blue-500 flex items-center justify-center bg-blue-50 shadow-[0_0_0_4px_rgba(59,130,246,0.1)]">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
          </div>
        )}
        {status === "pending" && (
          <Circle className="w-6 h-6 text-neutral-300" />
        )}
      </div>
      <div
        style={getDynamicFont(language)}
        className={`pb-6 text-[15px] pt-0.5 ${status === "active" ? "font-semibold text-neutral-900" : status === "done" ? "text-neutral-700" : "text-neutral-400"}`}
      >
        {dict[textKey][language]}
      </div>
    </div>
  );

  const renderTimeline = () => {
    const s1 =
      appState === "step2" || appState === "step3" || appState === "completed"
        ? "done"
        : appState === "step1"
          ? "active"
          : "pending";
    const s2 =
      appState === "step3" || appState === "completed"
        ? "done"
        : appState === "step2"
          ? "active"
          : "pending";
    const s3 =
      appState === "completed"
        ? "done"
        : appState === "step3"
          ? "active"
          : "pending";

    return (
      <div className="flex flex-col" dir={language === "ur" ? "rtl" : "ltr"}>
        {renderTimelineItem(s1, "timeline1")}
        {renderTimelineItem(s2, "timeline2")}
        {renderTimelineItem(s3, "timeline3", true)}
      </div>
    );
  };

  const isWalkthroughActive =
    appState === "step1" || appState === "step2" || appState === "step3";

  return (
    <div className="relative w-full h-full bg-[#E5DDD5] flex flex-col overflow-hidden">
      {/* Fake WA Pattern Background */}
      <div
        className="absolute inset-0 mix-blend-multiply opacity-40 pointer-events-none"
        style={{
          backgroundImage:
            "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')",
          backgroundSize: "cover",
        }}
      />{" "}
      {/* --- BACKGROUND VIEW (WHATSAPP OR GALLERY) --- */}
      {appState === "step3" || appState === "completed" ? (
        /* GALLERY VIEW */
        <div className="absolute inset-0 bg-white z-0 flex flex-col">
          <div className="h-12 bg-white flex items-center justify-between px-6 text-neutral-900 text-sm font-medium z-10 pt-2">
            <span>9:41</span>
            <div className="flex items-center gap-2">
              <Signal className="w-4 h-4" />
              <Wifi className="w-4 h-4" />
              <Battery className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-4 px-4 py-3 border-b border-neutral-100">
            <button className="text-neutral-800">
              <ChevronLeft className="w-7 h-7" />
            </button>
            <h1 className="text-xl font-semibold text-neutral-800">
              Send to Sarah
            </h1>
          </div>
          <div className="flex-1 relative p-1 overflow-y-auto">
            <div className="grid grid-cols-3 gap-1 relative z-20">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                <div
                  key={i}
                  className="aspect-square bg-neutral-200 relative overflow-hidden group"
                >
                  <img
                    src={`https://images.unsplash.com/photo-${1500000000000 + i}?auto=format&fit=crop&w=300&q=80`}
                    alt="Gallery item"
                    className="w-full h-full object-cover"
                  />

                  {i === 1 && appState === "step3" && (
                    <motion.div
                      className="absolute inset-0 border-[4px] border-blue-500 z-40 pointer-events-none bg-blue-500/20"
                      animate={{ opacity: [1, 0.5, 1], scale: [1, 1.05, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}

                  {i === 1 && (
                    <button
                      onClick={handlePhotoClick}
                      className="absolute inset-0 z-30 w-full h-full cursor-pointer"
                      aria-label="Select photo"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* WHATSAPP VIEW */
        <>
          <div className="h-12 flex items-center justify-between px-6 text-neutral-900 text-sm font-medium z-10 bg-[#008069] text-white relative">
            <span>9:41</span>
            <div className="flex items-center gap-2">
              <Signal className="w-4 h-4" />
              <Wifi className="w-4 h-4" />
              <Battery className="w-5 h-5" />
            </div>
          </div>

          <div className="flex items-center justify-between px-2 py-2 bg-[#008069] text-white shadow-sm relative z-10">
            <div className="flex items-center gap-1">
              <button className="p-1 rounded-full active:bg-white/20 transition-colors">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div className="w-9 h-9 rounded-full bg-neutral-300 overflow-hidden ml-1">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col ml-2">
                <span className="font-semibold text-[16px] leading-tight">
                  Sarah (Daughter)
                </span>
                <span className="text-[12px] text-white/80">online</span>
              </div>
            </div>
            <div className="flex items-center gap-4 px-2">
              <Video className="w-5 h-5" />
              <Phone className="w-5 h-5" />
              <MoreVertical className="w-5 h-5" />
            </div>
          </div>

          <div className="flex-1 p-4 flex flex-col overflow-y-auto relative z-10 gap-3">
            <div className="self-center bg-[#D1EAF1] px-3 py-1 rounded-lg text-[11px] text-neutral-600 shadow-sm uppercase tracking-wide">
              Today
            </div>
            <div className="self-start bg-white rounded-lg rounded-tl-none p-2.5 max-w-[80%] shadow-sm relative text-[15px]">
              Hi Mom! Did you find those old photos we talked about?
              <span className="text-[10px] text-neutral-400 float-right mt-2 ml-3">
                9:30 AM
              </span>
            </div>
            <div className="self-end bg-[#E7FFDB] rounded-lg rounded-tr-none p-2.5 max-w-[80%] shadow-sm relative text-[15px]">
              Yes! I have them right here.
              <span className="text-[10px] text-neutral-400 float-right mt-2 ml-3 flex items-center gap-1">
                9:35 AM
              </span>
            </div>
            <div className="self-start bg-white rounded-lg rounded-tl-none p-2.5 max-w-[80%] shadow-sm relative text-[15px]">
              Can you send them to me?
              <span className="text-[10px] text-neutral-400 float-right mt-2 ml-3">
                9:40 AM
              </span>
            </div>
          </div>

          {/* Attachment Menu (Screen 3.4) */}
          <AnimatePresence>
            {appState === "step2" && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="absolute bottom-16 left-2 right-2 bg-white rounded-2xl p-4 shadow-xl z-20"
              >
                <div className="grid grid-cols-3 gap-y-6 gap-x-2">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-[52px] h-[52px] rounded-full bg-indigo-500 flex items-center justify-center text-white">
                      <FileText className="w-6 h-6" />
                    </div>
                    <span className="text-[12px] text-neutral-600 font-medium">
                      Document
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-[52px] h-[52px] rounded-full bg-pink-500 flex items-center justify-center text-white">
                      <Camera className="w-6 h-6" />
                    </div>
                    <span className="text-[12px] text-neutral-600 font-medium">
                      Camera
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-2 relative">
                    {appState === "step2" && (
                      <>
                        <motion.div
                          className="absolute -inset-3 border-[3px] border-blue-500 rounded-full z-50 pointer-events-none"
                          animate={{
                            opacity: [1, 0.5, 1],
                            scale: [1, 1.1, 1],
                          }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                        <div className="absolute inset-0 top-0 bottom-6 bg-blue-500/20 rounded-full z-40 pointer-events-none animate-pulse" />
                      </>
                    )}
                    <button
                      onClick={handleGalleryClick}
                      className="w-[52px] h-[52px] rounded-full bg-purple-500 flex items-center justify-center text-white relative z-40 hover:bg-purple-600 transition-colors shadow-md"
                    >
                      <ImageIcon className="w-6 h-6" />
                    </button>
                    <span className="text-[12px] text-neutral-600 font-medium relative z-40 bg-white px-1">
                      Gallery
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="p-2 bg-transparent flex items-end gap-1.5 pb-6 relative z-30">
            <div className="flex-1 bg-white rounded-full flex items-center px-2 min-h-[44px] shadow-sm">
              <button className="p-2 text-neutral-400">
                <Smile className="w-6 h-6" />
              </button>
              <input
                type="text"
                placeholder="Message"
                className="flex-1 bg-transparent px-1 text-[16px] outline-none placeholder:text-neutral-400"
                readOnly
              />
              <div className="flex items-center gap-1 pr-1">
                <div className="relative">
                  {appState === "step1" && (
                    <>
                      <motion.div
                        className="absolute -inset-2 border-[3px] border-blue-500 rounded-full z-50 pointer-events-none"
                        animate={{ opacity: [1, 0.5, 1], scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                      <div className="absolute inset-0 bg-blue-500/20 rounded-full z-40 pointer-events-none animate-pulse" />
                    </>
                  )}
                  <button
                    onClick={handlePaperclipClick}
                    className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-full transition-colors relative z-40"
                  >
                    <Paperclip className="w-5 h-5 -rotate-45" />
                  </button>
                </div>
                <button className="p-2 text-neutral-500">
                  <Camera className="w-6 h-6" />
                </button>
              </div>
            </div>
            <button className="w-[44px] h-[44px] rounded-full bg-[#008069] flex items-center justify-center text-white shadow-sm flex-shrink-0">
              <Mic className="w-6 h-6" />
            </button>
          </div>
        </>
      )}
      {/* --- GLOBAL SCRIM --- */}
      <AnimatePresence>
        {(appState === "prompt" || appState === "completed" || isChatOpen) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 z-40"
            onClick={() => {
              if (isChatOpen) handleCloseChat();
              if (appState === "completed" || appState === "prompt")
                setAppState("idle");
            }}
          />
        )}
      </AnimatePresence>
      {/* --- SAHARA ELEMENTS --- */}
      {/* Floating Blip (Idle State) */}
      <AnimatePresence>
        {appState === "idle" && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={handleBlipClick}
            className="absolute bottom-24 right-6 w-14 h-14 rounded-full bg-blue-500 text-white shadow-[0_4px_20px_rgba(59,130,246,0.5)] flex items-center justify-center z-50 hover:scale-105 transition-transform"
          >
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-blue-500"
              animate={{ scale: [1, 1.5], opacity: [0.8, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
            <div className="relative z-10 w-full h-full rounded-full overflow-hidden border-2 border-white/20 bg-white">
              <img
                src={saharaLogo}
                alt="Sahara Logo"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.button>
        )}
      </AnimatePresence>
      {/* Central Prompts / Top Banner (Non-Chat) */}
      <AnimatePresence mode="wait">
        {!isChatOpen && appState !== "idle" && (
          <motion.div
            layoutId="sahara-container"
            style={robotoFont}
            className={`absolute z-50 flex flex-col bg-white overflow-hidden shadow-2xl border border-neutral-100
                ${appState === "prompt" || appState === "completed" ? "top-1/2 left-4 right-4 -translate-y-1/2 rounded-3xl" : ""}
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
                      <span className="px-2 py-[1px] bg-blue-100 text-blue-700 text-[9px] rounded-sm uppercase tracking-wider font-bold">
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
                    onClick={handleExpandChat}
                    className="p-1.5 text-neutral-400 hover:text-[#00695C] hover:bg-teal-50 rounded-md transition-colors"
                    title="Expand Chat"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </button>
                )}
                <LanguageToggle />
                {(appState === "prompt" || appState === "completed") && (
                  <button
                    onClick={() => setAppState("idle")}
                    className="p-2 text-neutral-400 hover:bg-neutral-100 rounded-full transition-colors ml-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* State: Prompt */}
            {appState === "prompt" && (
              <div className="p-5 flex flex-col gap-5">
                <div
                  style={getDynamicFont(language)}
                  dir={language === "ur" ? "rtl" : "ltr"}
                  className="text-[16px] text-neutral-800 font-medium leading-relaxed text-center"
                >
                  {dict.promptMsg[language]}
                </div>
                <div className="flex flex-col gap-2.5">
                  <button
                    onClick={handleYes}
                    style={getDynamicFont(language)}
                    className="w-full py-3 bg-[#00695C] text-white rounded-xl font-semibold text-[15px] shadow-sm hover:bg-[#004D40] active:scale-[0.98] transition-all"
                  >
                    {dict.btnYes[language]}
                  </button>
                  <button
                    onClick={handleOpenChatOnly}
                    style={getDynamicFont(language)}
                    className="w-full py-3 text-neutral-600 bg-white border-2 border-neutral-200 rounded-xl font-semibold text-[15px] hover:bg-neutral-50 active:scale-[0.98] transition-all"
                  >
                    {dict.btnOpenChat[language]}
                  </button>
                </div>
              </div>
            )}

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
      {/* --- CHAT BOTTOM SHEET --- */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            layoutId="sahara-container"
            style={robotoFont}
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="absolute bottom-0 left-0 right-0 h-[80%] bg-neutral-50 rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.2)] z-50 flex flex-col overflow-hidden border-t border-neutral-200"
          >
            {/* Chat Header */}
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
                    {dict.promptTitle[language]}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <LanguageToggle />
                <button
                  onClick={handleNotifyProxy}
                  disabled={isNotified}
                  className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg transition-all border shadow-sm ${
                    isNotified
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 active:scale-95"
                  }`}
                >
                  {isNotified ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <BellRing className="w-3.5 h-3.5" />
                  )}
                  <span
                    style={getDynamicFont(language)}
                    className="text-[11px] font-bold whitespace-nowrap hidden sm:inline-block"
                  >
                    {isNotified
                      ? dict.notified[language]
                      : dict.btnNotify[language]}
                  </span>
                </button>

                <button
                  onClick={handleCloseChat}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200 transition-colors ml-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Content & Timeline */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              {/* Embedded Timeline Widget */}
              {(isWalkthroughActive || appState === "completed") && (
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100 mb-2">
                  <div
                    style={getDynamicFont(language)}
                    className="text-[13px] font-bold text-neutral-800 mb-4 pb-3 border-b border-neutral-100 flex justify-between items-center"
                    dir={language === "ur" ? "rtl" : "ltr"}
                  >
                    {dict.walkthroughProgress[language]}
                    {appState !== "completed" && (
                      <button
                        onClick={handleCancelWalkthrough}
                        className="text-red-500 hover:bg-red-50 px-2 py-1 rounded-md transition-colors text-[11px]"
                      >
                        {dict.btnCancel[language]}
                      </button>
                    )}
                  </div>
                  {renderTimeline()}
                </div>
              )}

              {/* Conversation */}
              {messages.map((msg) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id}
                  className={`flex flex-col max-w-[88%] ${msg.role === "user" ? "self-end items-end" : "self-start items-start"}`}
                >
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
                          alt="Sahara"
                        />
                      ) : (
                        <User className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <span
                      style={getDynamicFont(language)}
                      className="text-[11px] font-medium text-neutral-500"
                    >
                      {msg.role === "ai" ? "Sahara" : dict.you[language]}
                    </span>
                  </div>

                  <div
                    className={`rounded-2xl px-4 py-3 shadow-sm text-[15px] ${
                      msg.role === "user"
                        ? "bg-[#00695C] text-white rounded-tr-sm"
                        : "bg-white border border-neutral-100 text-neutral-900 rounded-tl-sm"
                    }`}
                  >
                    <div
                      style={getDynamicFont(language)}
                      dir={language === "ur" ? "rtl" : "ltr"}
                    >
                      {msg.content[language]}
                    </div>
                  </div>
                </motion.div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div className="bg-white border-t border-neutral-100 pb-3 pt-2">
              {/* Quick Prompts */}
              {messages.length < 5 && (
                <div
                  className="flex items-center gap-2.5 overflow-x-auto px-4 pb-3 w-full whitespace-nowrap [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                  dir={language === "ur" ? "rtl" : "ltr"}
                >
                  {["quickPrompt1", "quickPrompt2", "quickPrompt3"].map(
                    (key) => (
                      <button
                        key={key}
                        onClick={() =>
                          handleSendMessage(
                            undefined,
                            dict[key as keyof typeof dict][language],
                          )
                        }
                        style={getDynamicFont(language)}
                        className="px-4 py-2 bg-white text-[#00695C] border border-neutral-200 rounded-full text-[14px] font-semibold hover:bg-neutral-50 active:scale-95 transition-all shadow-sm shrink-0"
                      >
                        {dict[key as keyof typeof dict][language]}
                      </button>
                    ),
                  )}
                </div>
              )}
              <form
                onSubmit={(e) => handleSendMessage(e)}
                className="flex items-center gap-2 bg-[#F3F4F6] rounded-full px-1.5 py-1.5 mx-4"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  style={getDynamicFont(language)}
                  placeholder={dict.askPlaceholder[language]}
                  dir={language === "ur" ? "rtl" : "ltr"}
                  className="flex-1 bg-transparent px-3 py-1.5 text-[15px] text-neutral-900 placeholder:text-neutral-400 outline-none"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="w-8 h-8 flex items-center justify-center bg-[#D1D5DB] text-neutral-500 rounded-full data-[active=true]:bg-[#00695C] data-[active=true]:text-white transition-colors flex-shrink-0"
                  data-active={inputValue.trim().length > 0}
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

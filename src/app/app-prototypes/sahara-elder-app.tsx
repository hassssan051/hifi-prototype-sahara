import React, { useState, useEffect, useRef } from "react";
import { ShieldCheck, Phone, Pause, Mic, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { flowSaharaLogo as saharaLogo } from "../components/sahara/flows/flowLogo";

type Screen = "pairing" | "home" | "overlay";
type BlipColor = "green" | "red" | "yellow" | "blue";
type Language = "en" | "ur";

type Translatable = {
  en: string;
  ur: string;
};

type Message = {
  id: string;
  role: "ai" | "user";
  content: Translatable;
};

const QUICK_PROMPTS: Translatable[] = [
  {
    en: "Explain what's on my screen",
    ur: "میری سکرین پر کیا ہے، سمجھائیں",
  },
  {
    en: "Is this message safe?",
    ur: "کیا یہ پیغام محفوظ ہے؟",
  },
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("pairing");
  const [pairingCode, setPairingCode] = useState<string[]>(["", "", "", ""]);
  const [language, setLanguage] = useState<Language>("en");
  const [blipColor, setBlipColor] = useState<BlipColor>("green");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [pauseEndTime, setPauseEndTime] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [blipPosition, setBlipPosition] = useState({ x: 280, y: 600 });
  const [isDragging, setIsDragging] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const blipRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });

  const robotoFont = { fontFamily: '"Roboto", sans-serif' };
  const urduFont = {
    fontFamily: '"Noto Nastaliq Urdu", serif',
    lineHeight: "1.8",
  };
  const getDynamicFont = (lang: Language) =>
    lang === "ur" ? urduFont : robotoFont;

  // Auto-submit pairing code when all 4 digits are entered
  useEffect(() => {
    if (pairingCode.every((digit) => digit !== "")) {
      setTimeout(() => {
        setCurrentScreen("home");
      }, 300);
    }
  }, [pairingCode]);

  // Timer countdown effect
  useEffect(() => {
    if (!isPaused || !pauseEndTime) {
      setTimeRemaining("");
      return;
    }

    const updateTimer = () => {
      const now = Date.now();
      const remaining = pauseEndTime - now;

      if (remaining <= 0) {
        setIsPaused(false);
        setPauseEndTime(null);
        setTimeRemaining("");
        return;
      }

      const minutes = Math.floor(remaining / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);
      setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, "0")}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [isPaused, pauseEndTime]);

  const handleCodeInput = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...pairingCode];
    newCode[index] = value.slice(-1);
    setPairingCode(newCode);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !pairingCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePause = () => {
    setIsPaused(true);
    setPauseEndTime(Date.now() + 3600000); // 1 hour from now
  };

  const handleEnable = () => {
    setIsPaused(false);
    setPauseEndTime(null);
    setTimeRemaining("");
  };

  const handleCallProxy = () => {
    alert("Calling proxy...");
  };

  const handleUnpair = () => {
    setCurrentScreen("pairing");
    setPairingCode(["", "", "", ""]);
  };

  const handleOpenChat = () => {
    setIsChatOpen(true);
    if (messages.length === 0) {
      setMessages([
        {
          id: "1",
          role: "ai",
          content: {
            en: "Hello! I am Sahara, your safety assistant. How can I help you today?",
            ur: "السلام علیکم! میں صحارا ہوں، آپ کا حفاظتی معاون۔ میں آج آپ کی کیسے مدد کر سکتا ہوں؟",
          },
        },
      ]);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: {
        en: inputValue,
        ur: inputValue,
      },
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputValue("");

    setTimeout(() => {
      const aiReply: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: {
          en: "I understand your concern. Let me help you with that.",
          ur: "میں آپ کی تشویش سمجھتا ہوں۔ میں اس میں آپ کی مدد کروں گا۔",
        },
      };
      setMessages((prev) => [...prev, aiReply]);
    }, 1000);
  };

  const sendQuickPrompt = (prompt: Translatable) => {
    const newMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: prompt,
    };

    setMessages((prev) => [...prev, newMsg]);

    setTimeout(() => {
      const aiReply: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: {
          en: "Let me analyze your screen for you...",
          ur: "مجھے آپ کی سکرین کا تجزیہ کرنے دیں...",
        },
      };
      setMessages((prev) => [...prev, aiReply]);
    }, 1000);
  };

  const handleNotifyProxy = () => {
    alert("Proxy has been notified with conversation summary.");
  };

  // Blip drag handlers
  const handleBlipMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartPos.current = {
      x: e.clientX - blipPosition.x,
      y: e.clientY - blipPosition.y,
    };
  };

  const handleBlipTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsDragging(true);
    dragStartPos.current = {
      x: touch.clientX - blipPosition.x,
      y: touch.clientY - blipPosition.y,
    };
  };

  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      if (!isDragging) return;

      const newX = clientX - dragStartPos.current.x;
      const newY = clientY - dragStartPos.current.y;

      setBlipPosition({
        x: Math.max(20, Math.min(newX, 315)),
        y: Math.max(60, Math.min(newY, 740)),
      });
    };

    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleEnd = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleEnd);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleEnd);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging]);

  const renderPairingScreen = () => (
    <div
      className="flex-1 flex flex-col items-center justify-center px-8 bg-white"
      style={robotoFont}
    >
      <div className="w-20 h-20 mb-8 rounded-full overflow-hidden shadow-lg">
        <img
          src={saharaLogo}
          alt="Sahara Logo"
          className="w-full h-full object-cover"
        />
      </div>
      <h1 className="text-3xl font-bold text-neutral-900 mb-2">
        Welcome to Sahara
      </h1>
      <p className="text-lg text-neutral-600 mb-2 text-center leading-relaxed">
        Enter your 4-digit pairing code
      </p>
      <p className="text-sm text-neutral-400 mb-12 text-center">
        (enter any number)
      </p>
      <div className="flex gap-4 mb-8">
        {pairingCode.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleCodeInput(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="w-16 h-20 text-4xl font-bold text-center border-4 border-[#00695C] rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#00695C]/30 bg-white text-neutral-900"
            autoFocus={index === 0}
          />
        ))}
      </div>
    </div>
  );

  const renderHomeScreen = () => (
    <div
      className="flex-1 flex flex-col items-center justify-center px-8 bg-neutral-50"
      style={robotoFont}
    >
      {/* Status Section */}
      <div className="flex flex-col items-center mb-12">
        <div
          className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 shadow-lg ${isPaused ? "bg-neutral-200" : "bg-green-100"}`}
        >
          <ShieldCheck
            className={`w-20 h-20 ${isPaused ? "text-neutral-500" : "text-green-600"}`}
          />
        </div>
        <h2 className="text-2xl font-bold text-neutral-900 text-center leading-snug px-4">
          {isPaused
            ? "Sahara is paused."
            : "Sahara is awake and keeping you safe."}
        </h2>
        {isPaused && timeRemaining && (
          <p className="text-xl font-semibold text-neutral-600 mt-4">
            Resumes in {timeRemaining}
          </p>
        )}
      </div>

      {/* Primary Actions */}
      <div className="w-full space-y-4 mb-8">
        {isPaused ? (
          <button
            onClick={handleEnable}
            className="w-full min-h-[72px] bg-[#00695C] hover:bg-[#004D40] text-white rounded-2xl font-bold text-xl px-6 py-4 shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            <ShieldCheck className="w-7 h-7" />
            Enable Sahara
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="w-full min-h-[72px] bg-[#00695C] hover:bg-[#004D40] text-white rounded-2xl font-bold text-xl px-6 py-4 shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            <Pause className="w-7 h-7" />
            Pause Sahara for 1 Hour
          </button>
        )}

        <button
          onClick={handleCallProxy}
          className="w-full min-h-[72px] bg-white hover:bg-neutral-50 text-[#00695C] border-4 border-[#00695C] rounded-2xl font-bold text-xl px-6 py-4 shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-3"
        >
          <Phone className="w-7 h-7" />
          Call Ahmed
        </button>
      </div>

      {/* Unpair Link */}
      <button
        onClick={handleUnpair}
        className="text-neutral-500 text-sm underline mt-8"
      >
        Unpair this device
      </button>

      {/* Button to access overlay for demo */}
      <button
        onClick={() => setCurrentScreen("overlay")}
        className="mt-8 text-[#00695C] text-sm font-semibold"
      >
        → View Widget Demo
      </button>
    </div>
  );

  const renderOverlayScreen = () => (
    <div className="flex-1 bg-neutral-100 relative">
      {/* Simulated background app */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-neutral-400 px-8">
          <p className="text-lg mb-4">Your phone screen</p>
          <p className="text-sm">
            The floating Sahara widget appears on top of all apps
          </p>
          <button
            onClick={() => setCurrentScreen("home")}
            className="mt-6 text-[#00695C] text-sm font-semibold"
          >
            ← Back to Home
          </button>
        </div>
      </div>

      {/* Scrim when chat is open */}
      {isChatOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 z-30"
          onClick={() => setIsChatOpen(false)}
        />
      )}

      {/* Floating Blip */}
      {!isChatOpen && (
        <motion.div
          ref={blipRef}
          className="absolute w-16 h-16 rounded-full shadow-2xl cursor-move z-40"
          style={{
            left: blipPosition.x,
            top: blipPosition.y,
            backgroundColor:
              blipColor === "green"
                ? "#00695C"
                : blipColor === "red"
                  ? "#EF4444"
                  : blipColor === "yellow"
                    ? "#F59E0B"
                    : "#3B82F6",
          }}
          onMouseDown={handleBlipMouseDown}
          onTouchStart={handleBlipTouchStart}
          onClick={(e) => {
            if (!isDragging) {
              e.stopPropagation();
              handleOpenChat();
            }
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center border-4 border-white">
            <img
              src={saharaLogo}
              alt="Sahara"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
            className="absolute bottom-0 left-0 right-0 h-[70%] bg-white rounded-t-3xl shadow-2xl z-40 flex flex-col"
            style={robotoFont}
          >
            {/* Chat Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-white rounded-t-3xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden shadow-md">
                  <img
                    src={saharaLogo}
                    alt="Sahara"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-900">Sahara</h3>
                  <p className="text-sm text-[#00695C] font-semibold">
                    Safety Assistant
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Language Toggle */}
                <div className="flex bg-neutral-100 p-1 rounded-lg border-2 border-neutral-200">
                  <button
                    onClick={() => setLanguage("en")}
                    className={`px-3 py-1.5 text-sm font-bold rounded-md transition-colors ${language === "en" ? "bg-[#00695C] text-white" : "text-neutral-600"}`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => setLanguage("ur")}
                    className={`px-3 py-1.5 text-sm font-bold rounded-md transition-colors ${language === "ur" ? "bg-[#00695C] text-white" : "text-neutral-600"}`}
                  >
                    UR
                  </button>
                </div>

                {/* Notify Proxy */}
                <button
                  onClick={handleNotifyProxy}
                  className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg font-semibold text-sm border-2 border-amber-300 transition-colors min-h-[44px]"
                  style={getDynamicFont(language)}
                >
                  {language === "en" ? "Notify Proxy" : "پراکسی کو بتائیں"}
                </button>

                {/* Close */}
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-neutral-50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-6 py-4 text-lg leading-relaxed ${
                      msg.role === "user"
                        ? "bg-[#00695C] text-white"
                        : "bg-white border-2 border-neutral-200 text-neutral-900"
                    }`}
                    style={getDynamicFont(language)}
                    dir={language === "ur" ? "rtl" : "ltr"}
                  >
                    {msg.content[language]}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Prompts */}
            <div className="px-6 py-4 bg-white border-t border-neutral-200 flex gap-3 overflow-x-auto">
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => sendQuickPrompt(prompt)}
                  className="whitespace-nowrap px-5 py-3 bg-[#00695C]/10 hover:bg-[#00695C]/20 text-[#00695C] font-bold text-base rounded-full border-2 border-[#00695C]/30 transition-colors min-h-[56px]"
                  style={getDynamicFont(language)}
                >
                  {prompt[language]}
                </button>
              ))}
            </div>

            {/* Input Area */}
            <div className="px-6 py-4 bg-white border-t-2 border-neutral-200">
              <form
                onSubmit={handleSendMessage}
                className="flex items-center gap-3"
              >
                <button
                  type="button"
                  className="w-14 h-14 flex-shrink-0 flex items-center justify-center bg-neutral-100 hover:bg-neutral-200 rounded-full transition-colors"
                >
                  <Mic className="w-7 h-7 text-neutral-700" />
                </button>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={
                    language === "en"
                      ? "Type your message..."
                      : "اپنا پیغام لکھیں..."
                  }
                  dir={language === "ur" ? "rtl" : "ltr"}
                  className="flex-1 px-5 py-4 bg-neutral-100 rounded-full text-lg outline-none focus:ring-4 focus:ring-[#00695C]/30 min-h-[56px]"
                  style={getDynamicFont(language)}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="w-14 h-14 flex-shrink-0 flex items-center justify-center bg-[#00695C] hover:bg-[#004D40] disabled:bg-neutral-300 text-white rounded-full transition-colors"
                >
                  <Send className="w-6 h-6" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
      {/* Mobile Device Mockup */}
      <div className="relative w-full max-w-[375px] h-[812px] bg-white rounded-[40px] overflow-hidden shadow-2xl ring-8 ring-neutral-800 flex flex-col">
        {currentScreen === "pairing" && renderPairingScreen()}
        {currentScreen === "home" && renderHomeScreen()}
        {currentScreen === "overlay" && renderOverlayScreen()}
      </div>
    </div>
  );
}

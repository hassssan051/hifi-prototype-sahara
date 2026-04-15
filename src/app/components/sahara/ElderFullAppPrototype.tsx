import React, { useState, useEffect, useRef } from "react";
import { ShieldCheck, Phone, Pause, Mic, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { flowSaharaLogo } from "./flows/flowLogo";

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

export default function ElderFullAppPrototype() {
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

  useEffect(() => {
    if (pairingCode.every((digit) => digit !== "")) {
      const timer = setTimeout(() => {
        setCurrentScreen("home");
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [pairingCode]);

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
    if (!/^\d*$/.test(value)) {
      return;
    }

    const newCode = [...pairingCode];
    newCode[index] = value.slice(-1);
    setPairingCode(newCode);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace" && !pairingCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePause = () => {
    setIsPaused(true);
    setPauseEndTime(Date.now() + 3600000);
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

  const handleSendMessage = (event: React.FormEvent) => {
    event.preventDefault();
    if (!inputValue.trim()) {
      return;
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
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
        content: {
          en: "I understand your concern. Let me help you with that.",
          ur: "میں آپ کی تشویش سمجھتا ہوں۔ میں اس میں آپ کی مدد کروں گا۔",
        },
      };
      setMessages((previous) => [...previous, aiReply]);
    }, 1000);
  };

  const sendQuickPrompt = (prompt: Translatable) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: prompt,
    };

    setMessages((previous) => [...previous, newMessage]);

    setTimeout(() => {
      const aiReply: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: {
          en: "Let me analyze your screen for you...",
          ur: "مجھے آپ کی سکرین کا تجزیہ کرنے دیں...",
        },
      };
      setMessages((previous) => [...previous, aiReply]);
    }, 1000);
  };

  const handleNotifyProxy = () => {
    alert("Proxy has been notified with conversation summary.");
  };

  const handleBlipMouseDown = (event: React.MouseEvent) => {
    setIsDragging(true);
    dragStartPos.current = {
      x: event.clientX - blipPosition.x,
      y: event.clientY - blipPosition.y,
    };
  };

  const handleBlipTouchStart = (event: React.TouchEvent) => {
    const touch = event.touches[0];
    setIsDragging(true);
    dragStartPos.current = {
      x: touch.clientX - blipPosition.x,
      y: touch.clientY - blipPosition.y,
    };
  };

  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      if (!isDragging) {
        return;
      }

      const newX = clientX - dragStartPos.current.x;
      const newY = clientY - dragStartPos.current.y;

      setBlipPosition({
        x: Math.max(20, Math.min(newX, 315)),
        y: Math.max(60, Math.min(newY, 740)),
      });
    };

    const handleMouseMove = (event: MouseEvent) =>
      handleMove(event.clientX, event.clientY);
    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        handleMove(event.touches[0].clientX, event.touches[0].clientY);
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
  }, [isDragging, blipPosition.x, blipPosition.y]);

  const renderPairingScreen = () => (
    <div
      className="flex flex-1 flex-col items-center justify-center bg-white px-8"
      style={robotoFont}
    >
      <div className="mb-8 h-20 w-20 overflow-hidden rounded-full shadow-lg">
        <img
          src={flowSaharaLogo}
          alt="Sahara Logo"
          className="h-full w-full object-cover"
        />
      </div>
      <h1 className="mb-2 text-center text-3xl font-bold text-neutral-900">
        Welcome to Sahara
      </h1>
      <p className="mb-2 text-center text-lg leading-relaxed text-neutral-600">
        Enter your 4-digit pairing code
      </p>
      <p className="mb-12 text-center text-sm text-neutral-400">
        (enter any number)
      </p>
      <div className="mb-8 flex gap-4">
        {pairingCode.map((digit, index) => (
          <input
            key={index}
            ref={(element) => {
              inputRefs.current[index] = element;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(event) => handleCodeInput(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            className="h-20 w-16 rounded-2xl border-4 border-[#00695C] bg-white text-center text-4xl font-bold text-neutral-900 focus:ring-4 focus:ring-[#00695C]/30 focus:outline-none"
            autoFocus={index === 0}
          />
        ))}
      </div>
    </div>
  );

  const renderHomeScreen = () => (
    <div
      className="flex flex-1 flex-col items-center justify-center bg-neutral-50 px-8"
      style={robotoFont}
    >
      <div className="mb-12 flex flex-col items-center">
        <div
          className={`mb-6 flex h-32 w-32 items-center justify-center rounded-full shadow-lg ${isPaused ? "bg-neutral-200" : "bg-green-100"}`}
        >
          <ShieldCheck
            className={`h-20 w-20 ${isPaused ? "text-neutral-500" : "text-green-600"}`}
          />
        </div>
        <h2 className="px-4 text-center text-2xl leading-snug font-bold text-neutral-900">
          {isPaused
            ? "Sahara is paused."
            : "Sahara is awake and keeping you safe."}
        </h2>
        {isPaused && timeRemaining && (
          <p className="mt-4 text-xl font-semibold text-neutral-600">
            Resumes in {timeRemaining}
          </p>
        )}
      </div>

      <div className="mb-8 w-full space-y-4">
        {isPaused ? (
          <button
            onClick={handleEnable}
            className="flex min-h-[72px] w-full items-center justify-center gap-3 rounded-2xl bg-[#00695C] px-6 py-4 text-xl font-bold text-white shadow-lg transition-all hover:bg-[#004D40] active:scale-[0.98]"
          >
            <ShieldCheck className="h-7 w-7" />
            Enable Sahara
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="flex min-h-[72px] w-full items-center justify-center gap-3 rounded-2xl bg-[#00695C] px-6 py-4 text-xl font-bold text-white shadow-lg transition-all hover:bg-[#004D40] active:scale-[0.98]"
          >
            <Pause className="h-7 w-7" />
            Pause Sahara for 1 Hour
          </button>
        )}

        <button
          onClick={handleCallProxy}
          className="flex min-h-[72px] w-full items-center justify-center gap-3 rounded-2xl border-4 border-[#00695C] bg-white px-6 py-4 text-xl font-bold text-[#00695C] shadow-lg transition-all hover:bg-neutral-50 active:scale-[0.98]"
        >
          <Phone className="h-7 w-7" />
          Call Ahmed
        </button>
      </div>

      <button
        onClick={handleUnpair}
        className="mt-8 text-sm text-neutral-500 underline"
      >
        Unpair this device
      </button>

      <button
        onClick={() => setCurrentScreen("overlay")}
        className="mt-8 text-sm font-semibold text-[#00695C]"
      >
        → View Widget Demo
      </button>
    </div>
  );

  const renderOverlayScreen = () => (
    <div className="relative flex-1 bg-neutral-100">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="px-8 text-center text-neutral-400">
          <p className="mb-4 text-lg">Your phone screen</p>
          <p className="text-sm">
            The floating Sahara widget appears on top of all apps
          </p>
          <button
            onClick={() => setCurrentScreen("home")}
            className="mt-6 text-sm font-semibold text-[#00695C]"
          >
            ← Back to Home
          </button>
        </div>
      </div>

      {isChatOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-30 bg-black/60"
          onClick={() => setIsChatOpen(false)}
        />
      )}

      {!isChatOpen && (
        <motion.div
          ref={blipRef}
          className="absolute z-40 h-16 w-16 cursor-move rounded-full shadow-2xl"
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
          onClick={(event) => {
            if (!isDragging) {
              event.stopPropagation();
              handleOpenChat();
            }
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-4 border-white">
            <img
              src={flowSaharaLogo}
              alt="Sahara"
              className="h-full w-full object-cover"
            />
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
            className="absolute right-0 bottom-0 left-0 z-40 flex h-[70%] flex-col rounded-t-3xl bg-white shadow-2xl"
            style={robotoFont}
          >
            <div className="flex items-center justify-between rounded-t-3xl border-b border-neutral-200 bg-white px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 overflow-hidden rounded-full shadow-md">
                  <img
                    src={flowSaharaLogo}
                    alt="Sahara"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-900">Sahara</h3>
                  <p className="text-sm font-semibold text-[#00695C]">
                    Safety Assistant
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex rounded-lg border-2 border-neutral-200 bg-neutral-100 p-1">
                  <button
                    onClick={() => setLanguage("en")}
                    className={`rounded-md px-3 py-1.5 text-sm font-bold transition-colors ${language === "en" ? "bg-[#00695C] text-white" : "text-neutral-600"}`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => setLanguage("ur")}
                    className={`rounded-md px-3 py-1.5 text-sm font-bold transition-colors ${language === "ur" ? "bg-[#00695C] text-white" : "text-neutral-600"}`}
                  >
                    UR
                  </button>
                </div>

                <button
                  onClick={handleNotifyProxy}
                  className="min-h-[44px] rounded-lg border-2 border-amber-300 bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-900 transition-colors hover:bg-amber-200"
                  style={getDynamicFont(language)}
                >
                  {language === "en" ? "Notify Proxy" : "پراکسی کو بتائیں"}
                </button>

                <button
                  onClick={() => setIsChatOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 transition-colors hover:bg-neutral-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto bg-neutral-50 p-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-6 py-4 text-lg leading-relaxed ${
                      message.role === "user"
                        ? "bg-[#00695C] text-white"
                        : "border-2 border-neutral-200 bg-white text-neutral-900"
                    }`}
                    style={getDynamicFont(language)}
                    dir={language === "ur" ? "rtl" : "ltr"}
                  >
                    {message.content[language]}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 overflow-x-auto border-t border-neutral-200 bg-white px-6 py-4">
              {QUICK_PROMPTS.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => sendQuickPrompt(prompt)}
                  className="min-h-[56px] whitespace-nowrap rounded-full border-2 border-[#00695C]/30 bg-[#00695C]/10 px-5 py-3 text-base font-bold text-[#00695C] transition-colors hover:bg-[#00695C]/20"
                  style={getDynamicFont(language)}
                >
                  {prompt[language]}
                </button>
              ))}
            </div>

            <div className="border-t-2 border-neutral-200 bg-white px-6 py-4">
              <form
                onSubmit={handleSendMessage}
                className="flex items-center gap-3"
              >
                <button
                  type="button"
                  className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-neutral-100 transition-colors hover:bg-neutral-200"
                >
                  <Mic className="h-7 w-7 text-neutral-700" />
                </button>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                  placeholder={
                    language === "en"
                      ? "Type your message..."
                      : "اپنا پیغام لکھیں..."
                  }
                  dir={language === "ur" ? "rtl" : "ltr"}
                  className="min-h-[56px] flex-1 rounded-full bg-neutral-100 px-5 py-4 text-lg outline-none focus:ring-4 focus:ring-[#00695C]/30"
                  style={getDynamicFont(language)}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-[#00695C] text-white transition-colors hover:bg-[#004D40] disabled:bg-neutral-300"
                >
                  <Send className="h-6 w-6" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div
      className="flex h-full w-full flex-col bg-white"
      style={getDynamicFont(language)}
    >
      {currentScreen === "pairing" && renderPairingScreen()}
      {currentScreen === "home" && renderHomeScreen()}
      {currentScreen === "overlay" && renderOverlayScreen()}
    </div>
  );
}

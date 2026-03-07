import { useCallback, useEffect, useRef, useState } from "react";

// ────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────
type Page = "login" | "countdown" | "surprise";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface LightboxItem {
  src: string | null;
  caption?: string;
  index: number;
}

// ────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────

/** Returns the next March 11 00:00:00 local time (or this year's if still future). */
function getTargetDate(): Date {
  const now = new Date();
  const year = now.getFullYear();
  const thisYear = new Date(year, 2, 11, 0, 0, 0); // March = 2 (0-indexed)
  if (now < thisYear) return thisYear;
  return new Date(year + 1, 2, 11, 0, 0, 0);
}

function getTimeLeft(target: Date): TimeLeft {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const totalSecs = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSecs / 86400),
    hours: Math.floor((totalSecs % 86400) / 3600),
    minutes: Math.floor((totalSecs % 3600) / 60),
    seconds: totalSecs % 60,
  };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

// ────────────────────────────────────────────────
// Floating Hearts Background
// ────────────────────────────────────────────────

const HEART_EMOJIS = ["💜", "🩷", "✨", "💫", "🌸", "💜", "💜", "✨"];

function FloatingHearts({ count = 16 }: { count?: number }) {
  const items = useRef(
    Array.from({ length: count }, (_, i) => ({
      id: i,
      emoji: HEART_EMOJIS[i % HEART_EMOJIS.length],
      left: `${5 + ((i * 93) % 90)}%`,
      size: `${0.8 + ((i * 0.37) % 1.2)}rem`,
      delay: `${(i * 0.7) % 7}s`,
      duration: `${5 + ((i * 1.3) % 6)}s`,
    })),
  ).current;

  return (
    <div className="hearts-bg" aria-hidden="true">
      {items.map((h) => (
        <span
          key={h.id}
          className="heart"
          style={{
            left: h.left,
            fontSize: h.size,
            animationDelay: h.delay,
            animationDuration: h.duration,
          }}
        >
          {h.emoji}
        </span>
      ))}
    </div>
  );
}

// ────────────────────────────────────────────────
// Login Page
// ────────────────────────────────────────────────

function LoginPage({ onSuccess }: { onSuccess: () => void }) {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (id.trim() === "gudda" && pw === "manna") {
      setError(false);
      onSuccess();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  }

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-lavender-gradient"
      style={{ isolation: "isolate" }}
    >
      <FloatingHearts count={20} />

      {/* Decorative blobs */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-30 blur-3xl pointer-events-none"
        style={{ background: "oklch(0.80 0.12 310)" }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-25 blur-3xl pointer-events-none"
        style={{ background: "oklch(0.78 0.12 340)" }}
        aria-hidden="true"
      />

      <div
        className={`relative z-10 w-full max-w-md mx-4 animate-fade-in-up ${shake ? "animate-shake" : ""}`}
        style={{ animationDelay: "0.1s" }}
      >
        <div
          className="rounded-3xl p-8 sm:p-10"
          style={{
            background: "oklch(0.99 0.005 295 / 0.88)",
            boxShadow:
              "0 8px 48px oklch(0.52 0.18 295 / 0.22), 0 2px 8px oklch(0.52 0.18 295 / 0.12)",
            backdropFilter: "blur(20px)",
            border: "1.5px solid oklch(0.80 0.10 295 / 0.4)",
          }}
        >
          {/* Lock icon */}
          <div className="flex justify-center mb-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
              style={{ background: "oklch(0.88 0.08 295 / 0.6)" }}
            >
              💜
            </div>
          </div>

          <h1
            className="font-display text-center text-3xl sm:text-4xl font-bold mb-2"
            style={{ color: "oklch(0.40 0.18 295)" }}
          >
            A Special Surprise Awaits
          </h1>
          <p
            className="font-body text-center text-sm mb-8"
            style={{ color: "oklch(0.55 0.08 295)" }}
          >
            Enter your details to continue...
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="login-id"
                className="font-body block text-sm font-semibold mb-1.5"
                style={{ color: "oklch(0.45 0.12 295)" }}
              >
                Login ID
              </label>
              <input
                id="login-id"
                type="text"
                value={id}
                onChange={(e) => {
                  setId(e.target.value);
                  setError(false);
                }}
                placeholder="Enter your login ID"
                autoComplete="username"
                data-ocid="login.input"
                className="font-body w-full px-4 py-3 rounded-xl outline-none transition-all"
                style={{
                  background: "oklch(0.95 0.03 295)",
                  border: error
                    ? "2px solid oklch(0.65 0.18 22)"
                    : "2px solid oklch(0.85 0.06 295)",
                  color: "oklch(0.25 0.06 295)",
                  fontSize: "1rem",
                  boxShadow: "inset 0 1px 3px oklch(0.52 0.18 295 / 0.06)",
                }}
                onFocus={(e) => {
                  if (!error)
                    e.currentTarget.style.borderColor = "oklch(0.65 0.15 295)";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px oklch(0.52 0.18 295 / 0.15)";
                }}
                onBlur={(e) => {
                  if (!error)
                    e.currentTarget.style.borderColor = "oklch(0.85 0.06 295)";
                  e.currentTarget.style.boxShadow =
                    "inset 0 1px 3px oklch(0.52 0.18 295 / 0.06)";
                }}
              />
            </div>

            <div>
              <label
                htmlFor="login-pw"
                className="font-body block text-sm font-semibold mb-1.5"
                style={{ color: "oklch(0.45 0.12 295)" }}
              >
                Password
              </label>
              <input
                id="login-pw"
                type="password"
                value={pw}
                onChange={(e) => {
                  setPw(e.target.value);
                  setError(false);
                }}
                placeholder="Enter your password"
                autoComplete="current-password"
                data-ocid="login.password_input"
                className="font-body w-full px-4 py-3 rounded-xl outline-none transition-all"
                style={{
                  background: "oklch(0.95 0.03 295)",
                  border: error
                    ? "2px solid oklch(0.65 0.18 22)"
                    : "2px solid oklch(0.85 0.06 295)",
                  color: "oklch(0.25 0.06 295)",
                  fontSize: "1rem",
                  boxShadow: "inset 0 1px 3px oklch(0.52 0.18 295 / 0.06)",
                }}
                onFocus={(e) => {
                  if (!error)
                    e.currentTarget.style.borderColor = "oklch(0.65 0.15 295)";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px oklch(0.52 0.18 295 / 0.15)";
                }}
                onBlur={(e) => {
                  if (!error)
                    e.currentTarget.style.borderColor = "oklch(0.85 0.06 295)";
                  e.currentTarget.style.boxShadow =
                    "inset 0 1px 3px oklch(0.52 0.18 295 / 0.06)";
                }}
              />
            </div>

            {error && (
              <div
                className="font-body flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm"
                style={{
                  background: "oklch(0.95 0.05 22)",
                  border: "1.5px solid oklch(0.80 0.12 22)",
                  color: "oklch(0.45 0.18 22)",
                }}
                data-ocid="login.error_state"
                role="alert"
                aria-live="polite"
              >
                <span>💔</span>
                <span>Wrong login details</span>
              </div>
            )}

            <button
              type="submit"
              data-ocid="login.submit_button"
              className="font-body w-full py-3.5 rounded-xl font-bold text-lg transition-all duration-200 btn-pulse"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.55 0.18 295) 0%, oklch(0.48 0.20 285) 100%)",
                color: "oklch(0.99 0 0)",
                border: "none",
                boxShadow: "0 4px 20px oklch(0.52 0.18 295 / 0.40)",
                cursor: "pointer",
                letterSpacing: "0.02em",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 28px oklch(0.52 0.18 295 / 0.50)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 20px oklch(0.52 0.18 295 / 0.40)";
              }}
            >
              Enter 💜
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
        .animate-shake { animation: shake 0.5s ease; }
      `}</style>
    </div>
  );
}

// ────────────────────────────────────────────────
// Countdown Page
// ────────────────────────────────────────────────

function CountdownPage({ onComplete }: { onComplete: () => void }) {
  const target = useRef(getTargetDate());
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(
    getTimeLeft(target.current),
  );
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Check immediately if already past
    const remaining = getTimeLeft(target.current);
    if (
      remaining.days === 0 &&
      remaining.hours === 0 &&
      remaining.minutes === 0 &&
      remaining.seconds === 0
    ) {
      setDone(true);
      return;
    }

    const interval = setInterval(() => {
      const tl = getTimeLeft(target.current);
      setTimeLeft(tl);
      if (
        tl.days === 0 &&
        tl.hours === 0 &&
        tl.minutes === 0 &&
        tl.seconds === 0
      ) {
        clearInterval(interval);
        setDone(true);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (done) {
      const timer = setTimeout(() => onComplete(), 1800);
      return () => clearTimeout(timer);
    }
  }, [done, onComplete]);

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg, oklch(0.90 0.07 295) 0%, oklch(0.93 0.05 310) 40%, oklch(0.95 0.04 340) 70%, oklch(0.91 0.07 285) 100%)",
      }}
      data-ocid="countdown.section"
    >
      <FloatingHearts count={24} />

      {/* Top sparkle row */}
      <div
        className="relative z-10 mb-6 flex gap-3 text-2xl"
        aria-hidden="true"
      >
        {["✨", "💜", "✨", "💜", "✨"].map((c, i) => (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: static decorative list, order never changes
            key={i}
            className="sparkle"
            style={{ animationDelay: `${i * 0.3}s`, animationDuration: "2s" }}
          >
            {c}
          </span>
        ))}
      </div>

      <p
        className="relative z-10 font-display text-xl sm:text-2xl italic text-center mb-12 px-6 animate-fade-in-up"
        style={{ color: "oklch(0.40 0.18 295)", animationDelay: "0.2s" }}
      >
        Something special is waiting for you...
      </p>

      {done ? (
        <div
          className="relative z-10 font-display text-3xl sm:text-4xl text-center animate-fade-in"
          style={{ color: "oklch(0.40 0.18 295)" }}
        >
          🎉 It&apos;s time! Opening your surprise... 💜
        </div>
      ) : (
        <div
          className="relative z-10 flex flex-wrap justify-center gap-4 sm:gap-6 px-4 animate-fade-in-up"
          style={{ animationDelay: "0.4s" }}
          data-ocid="countdown.timer_card"
        >
          {units.map((u, i) => (
            <div
              key={u.label}
              className="countdown-card"
              style={{ animationDelay: `${0.1 * i}s` }}
            >
              <div className="countdown-number">{pad(u.value)}</div>
              <div className="countdown-label">{u.label}</div>
            </div>
          ))}
        </div>
      )}

      <p
        className="relative z-10 font-body text-center mt-10 text-base px-6 animate-fade-in-up"
        style={{ color: "oklch(0.52 0.10 295)", animationDelay: "0.6s" }}
      >
        A little patience... it&apos;ll be worth the wait 💜
      </p>

      {/* Target date display */}
      <p
        className="relative z-10 font-body text-center mt-4 text-sm px-6"
        style={{ color: "oklch(0.62 0.08 295)" }}
      >
        Counting down to March 11 at midnight 🌙
      </p>
    </div>
  );
}

// ────────────────────────────────────────────────
// Gallery
// ────────────────────────────────────────────────

interface GalleryItem {
  id: string;
  dataOcid: string;
  caption?: string;
  bg: string;
  icon: string;
  label: string;
  src?: string;
}

function GalleryCard({
  item,
  onClick,
}: {
  item: GalleryItem;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="gallery-card w-full focus-visible:outline-2 focus-visible:outline-offset-2"
      style={{ outlineColor: "oklch(0.52 0.18 295)" }}
      onClick={onClick}
      data-ocid={item.dataOcid}
      aria-label={item.caption ? `View photo: ${item.caption}` : "View photo"}
    >
      {/* Image area */}
      <div
        className="aspect-square flex flex-col items-center justify-center gap-3 overflow-hidden"
        style={{ background: item.bg }}
      >
        {item.src ? (
          <img
            src={item.src}
            alt={item.caption ?? item.label}
            className="w-full h-full object-cover"
          />
        ) : (
          <>
            <span className="text-4xl sm:text-5xl">{item.icon}</span>
            <span
              className="font-body text-xs sm:text-sm font-medium px-3 text-center"
              style={{ color: "oklch(0.40 0.14 295)" }}
            >
              {item.label}
            </span>
          </>
        )}
      </div>
      {item.caption && (
        <div
          className="font-body text-xs sm:text-sm italic text-center py-3 px-3"
          style={{
            background: "oklch(0.97 0.02 295)",
            color: "oklch(0.45 0.12 295)",
            borderTop: "1.5px solid oklch(0.88 0.06 295)",
          }}
        >
          {item.caption}
        </div>
      )}
    </button>
  );
}

interface LightboxProps {
  item: LightboxItem;
  items: GalleryItem[];
  onClose: () => void;
  ocidModal: string;
  ocidClose: string;
}

function Lightbox({
  item,
  items,
  onClose,
  ocidModal,
  ocidClose,
}: LightboxProps) {
  const current = items[item.index];

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <dialog
      className="lightbox-overlay"
      data-ocid={ocidModal}
      aria-label="Photo lightbox"
      open
      style={{
        padding: 0,
        border: "none",
        background: "transparent",
        maxWidth: "100%",
        width: "100%",
      }}
    >
      {/* Backdrop click handler */}
      <div
        className="absolute inset-0"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onClose();
        }}
        role="button"
        tabIndex={-1}
        aria-label="Close lightbox"
      />
      <div
        className="relative max-w-lg w-full mx-4"
        style={{
          background: "oklch(0.97 0.03 295)",
          borderRadius: "1.5rem",
          overflow: "hidden",
          boxShadow: "0 24px 80px oklch(0.20 0.15 295 / 0.60)",
          border: "2px solid oklch(0.80 0.12 295 / 0.5)",
        }}
      >
        {/* Image area */}
        <div
          className="aspect-square flex flex-col items-center justify-center gap-4 overflow-hidden"
          style={{ background: current?.bg ?? "oklch(0.92 0.05 295)" }}
        >
          {current?.src ? (
            <img
              src={current.src}
              alt={current.caption ?? current.label}
              className="w-full h-full object-cover"
            />
          ) : (
            <>
              <span className="text-7xl">{current?.icon ?? "📸"}</span>
              <span
                className="font-body text-sm px-6 text-center"
                style={{ color: "oklch(0.40 0.14 295)" }}
              >
                {current?.label ?? "Photo"}
              </span>
            </>
          )}
        </div>
        {current?.caption && (
          <div
            className="font-body text-sm italic text-center py-4 px-6"
            style={{ color: "oklch(0.45 0.12 295)" }}
          >
            {current.caption}
          </div>
        )}
        <button
          type="button"
          className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold transition-all"
          style={{
            background: "oklch(0.52 0.18 295)",
            color: "oklch(0.99 0 0)",
            border: "none",
            cursor: "pointer",
          }}
          onClick={onClose}
          data-ocid={ocidClose}
          aria-label="Close lightbox"
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "oklch(0.42 0.20 295)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "oklch(0.52 0.18 295)";
          }}
        >
          ×
        </button>
      </div>
    </dialog>
  );
}

// ────────────────────────────────────────────────
// Surprise Page
// ────────────────────────────────────────────────

const MEMORIES: GalleryItem[] = [
  {
    id: "m1",
    dataOcid: "memories.item.1",
    bg: "linear-gradient(135deg, oklch(0.88 0.10 295) 0%, oklch(0.92 0.07 310) 100%)",
    icon: "📸",
    label: "Together",
    src: "/assets/uploads/Screenshot_20260308_022432_Gallery-1.jpg",
  },
  {
    id: "m2",
    dataOcid: "memories.item.2",
    bg: "linear-gradient(135deg, oklch(0.90 0.08 310) 0%, oklch(0.93 0.06 330) 100%)",
    icon: "🤝",
    label: "Our first memory",
  },
  {
    id: "m3",
    dataOcid: "memories.item.3",
    bg: "linear-gradient(135deg, oklch(0.87 0.09 285) 0%, oklch(0.91 0.07 300) 100%)",
    icon: "💜",
    label: "Friends forever",
  },
  {
    id: "m4",
    dataOcid: "memories.item.4",
    bg: "linear-gradient(135deg, oklch(0.91 0.07 300) 0%, oklch(0.89 0.09 315) 100%)",
    icon: "🌸",
    label: "Beautiful day together",
  },
  {
    id: "m5",
    dataOcid: "memories.item.5",
    bg: "linear-gradient(135deg, oklch(0.89 0.08 290) 0%, oklch(0.93 0.06 310) 100%)",
    icon: "⭐",
    label: "Special moments",
  },
  {
    id: "m6",
    dataOcid: "memories.item.6",
    bg: "linear-gradient(135deg, oklch(0.90 0.06 320) 0%, oklch(0.88 0.10 295) 100%)",
    icon: "✨",
    label: "Our journey together",
  },
];

const DEEPTI_PHOTOS: GalleryItem[] = [
  {
    id: "d1",
    dataOcid: "deepti.item.1",
    bg: "linear-gradient(135deg, oklch(0.87 0.10 295) 0%, oklch(0.92 0.07 315) 100%)",
    icon: "🌺",
    label: "Deepti",
    caption: "Your smile makes everything brighter.",
  },
  {
    id: "d2",
    dataOcid: "deepti.item.2",
    bg: "linear-gradient(135deg, oklch(0.90 0.07 310) 0%, oklch(0.93 0.05 340) 100%)",
    icon: "🌟",
    label: "Deepti",
    caption: "Always stay this happy.",
  },
  {
    id: "d3",
    dataOcid: "deepti.item.3",
    bg: "linear-gradient(135deg, oklch(0.88 0.09 285) 0%, oklch(0.92 0.07 300) 100%)",
    icon: "💐",
    label: "Deepti",
    caption: "The world is better with you in it.",
  },
  {
    id: "d4",
    dataOcid: "deepti.item.4",
    bg: "linear-gradient(135deg, oklch(0.91 0.06 300) 0%, oklch(0.89 0.10 320) 100%)",
    icon: "✨",
    label: "Deepti",
    caption: "Keep shining like the star you are.",
  },
];

function SurprisePage() {
  const [memoriesLightbox, setMemoriesLightbox] = useState<LightboxItem | null>(
    null,
  );
  const [deeptiLightbox, setDeetiLightbox] = useState<LightboxItem | null>(
    null,
  );
  const burstContainerRef = useRef<HTMLDivElement>(null);

  const triggerHeartBurst = useCallback(() => {
    const container = burstContainerRef.current;
    if (!container) return;

    const EMOJIS = ["💜", "🩷", "💗", "💫", "✨", "🌸", "💜", "💜"];
    const COUNT = 24;

    for (let i = 0; i < COUNT; i++) {
      const el = document.createElement("span");
      el.className = "burst-heart";
      el.textContent = EMOJIS[i % EMOJIS.length];
      const angle = (i / COUNT) * 2 * Math.PI;
      const radius = 80 + Math.random() * 140;
      const tx = Math.round(Math.cos(angle) * radius);
      const ty = Math.round(Math.sin(angle) * radius - 60);
      const rot = Math.round((Math.random() - 0.5) * 60);
      el.style.setProperty("--tx", `${tx}px`);
      el.style.setProperty("--ty", `${ty}px`);
      el.style.setProperty("--rot", `${rot}deg`);
      el.style.left = "50%";
      el.style.top = "50%";
      el.style.animationDelay = `${(i / COUNT) * 0.3}s`;
      container.appendChild(el);
      setTimeout(() => el.remove(), 1800 + (i / COUNT) * 300);
    }
  }, []);

  return (
    <div
      className="min-h-screen font-body"
      style={{ background: "oklch(0.96 0.03 295)" }}
    >
      {/* ── Section A: Hero ── */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 py-20"
        style={{
          background:
            "linear-gradient(160deg, oklch(0.87 0.09 295) 0%, oklch(0.85 0.12 308) 30%, oklch(0.88 0.10 325) 60%, oklch(0.86 0.11 288) 100%)",
        }}
      >
        <FloatingHearts count={30} />

        {/* Decorative orbs */}
        <div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-30 blur-3xl pointer-events-none"
          style={{ background: "oklch(0.70 0.18 295)" }}
          aria-hidden="true"
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full opacity-25 blur-3xl pointer-events-none"
          style={{ background: "oklch(0.75 0.15 340)" }}
          aria-hidden="true"
        />

        <div className="relative z-10 text-center max-w-3xl mx-auto">
          {/* Top sparkles */}
          <div
            className="flex justify-center gap-3 mb-6 text-2xl sm:text-3xl"
            aria-hidden="true"
          >
            {["✨", "💜", "🌸", "💜", "✨"].map((c, i) => (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: static decorative list, order never changes
                key={i}
                className="sparkle"
                style={{
                  animationDelay: `${i * 0.25}s`,
                  animationDuration: "2.2s",
                }}
              >
                {c}
              </span>
            ))}
          </div>

          <h1
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 animate-fade-in-up"
            style={{
              color: "oklch(0.30 0.18 295)",
              textShadow: "0 2px 20px oklch(0.52 0.18 295 / 0.3)",
              animationDelay: "0.2s",
            }}
          >
            Happy Birthday
            <br />
            My Best Friend
            <br />
            Deepti 💜
          </h1>

          <p
            className="font-body text-lg sm:text-xl animate-fade-in-up"
            style={{ color: "oklch(0.42 0.12 295)", animationDelay: "0.5s" }}
          >
            Wishing you all the magic and love in the world 🌸
          </p>

          {/* Scroll hint */}
          <div
            className="mt-12 flex flex-col items-center gap-1 animate-fade-in-up"
            style={{ animationDelay: "0.9s", color: "oklch(0.52 0.10 295)" }}
          >
            <span className="font-body text-sm">
              Scroll down for your surprise
            </span>
            <span className="text-lg animate-bounce">💜</span>
          </div>
        </div>
      </section>

      {/* ── Section B: Birthday Message ── */}
      <section
        className="py-20 px-4"
        style={{ background: "oklch(0.97 0.025 295)" }}
      >
        <div className="max-w-2xl mx-auto">
          <h2
            className="font-display text-3xl sm:text-4xl font-bold text-center mb-10 animate-fade-in"
            style={{ color: "oklch(0.40 0.18 295)" }}
          >
            From My Heart to Yours 💌
          </h2>

          <div
            className="rounded-3xl p-8 sm:p-10 relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.97 0.03 295) 0%, oklch(0.98 0.02 318) 50%, oklch(0.97 0.03 338) 100%)",
              border: "2px solid oklch(0.85 0.07 295)",
              boxShadow:
                "0 8px 48px oklch(0.52 0.18 295 / 0.14), 0 2px 8px oklch(0.52 0.18 295 / 0.08)",
            }}
          >
            {/* Decorative corner hearts */}
            <span
              className="absolute top-5 left-5 text-2xl opacity-30"
              aria-hidden="true"
            >
              💜
            </span>
            <span
              className="absolute top-5 right-5 text-2xl opacity-30"
              aria-hidden="true"
            >
              💜
            </span>
            <span
              className="absolute bottom-5 left-5 text-2xl opacity-30"
              aria-hidden="true"
            >
              💜
            </span>
            <span
              className="absolute bottom-5 right-5 text-2xl opacity-30"
              aria-hidden="true"
            >
              💜
            </span>

            <div
              className="font-body text-base sm:text-lg leading-relaxed space-y-5 relative z-10"
              style={{ color: "oklch(0.28 0.06 295)" }}
            >
              <p>
                I met you in 11th class, and I had no idea that one day we would
                become such incredible friends. It has been almost five
                beautiful years since our friendship began, and honestly, I
                cannot imagine my life without you.
              </p>
              <p>
                I am forever grateful to God for bringing you into my life. You
                are one of the sweetest, most genuine souls I have ever known.
                No matter what life throws our way, I promise I will always be
                right here by your side, Deepti.
              </p>
              <p>
                You are not just my best friend — you are one of the most
                beautiful parts of my life. Thank you for every laugh, every
                memory, every moment we have shared together. I hope your life
                is always overflowing with happiness, success, and love.
              </p>
              <p>
                Today and always, I wish nothing but the very best for you. You
                deserve all the joy in this world. Happy Birthday, my dearest
                Deepti 💜
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section C: Memories Gallery ── */}
      <section
        className="py-20 px-4"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.96 0.025 295) 0%, oklch(0.94 0.04 300) 100%)",
        }}
      >
        <div className="max-w-3xl mx-auto">
          <h2
            className="font-display text-3xl sm:text-4xl font-bold text-center mb-3"
            style={{ color: "oklch(0.38 0.18 295)" }}
          >
            Our Memories Together 📸
          </h2>
          <p
            className="font-body text-center text-base mb-10"
            style={{ color: "oklch(0.55 0.08 295)" }}
          >
            Every moment with you is a treasure
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
            {MEMORIES.map((item, idx) => (
              <GalleryCard
                key={item.id}
                item={item}
                onClick={() => setMemoriesLightbox({ src: null, index: idx })}
              />
            ))}
          </div>
        </div>

        {memoriesLightbox && (
          <Lightbox
            item={memoriesLightbox}
            items={MEMORIES}
            onClose={() => setMemoriesLightbox(null)}
            ocidModal="memories.lightbox.modal"
            ocidClose="memories.lightbox.close_button"
          />
        )}
      </section>

      {/* ── Section D: Deepti Gallery ── */}
      <section
        className="py-20 px-4"
        style={{ background: "oklch(0.97 0.025 295)" }}
      >
        <div className="max-w-3xl mx-auto">
          <h2
            className="font-display text-3xl sm:text-4xl font-bold text-center mb-3"
            style={{ color: "oklch(0.38 0.18 295)" }}
          >
            Beautiful Moments of Deepti 💜
          </h2>
          <p
            className="font-body text-center text-base mb-10"
            style={{ color: "oklch(0.55 0.08 295)" }}
          >
            Capturing your radiance, one photo at a time
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 max-w-2xl mx-auto">
            {DEEPTI_PHOTOS.map((item, idx) => (
              <GalleryCard
                key={item.id}
                item={item}
                onClick={() => setDeetiLightbox({ src: null, index: idx })}
              />
            ))}
          </div>
        </div>

        {deeptiLightbox && (
          <Lightbox
            item={deeptiLightbox}
            items={DEEPTI_PHOTOS}
            onClose={() => setDeetiLightbox(null)}
            ocidModal="deepti.lightbox.modal"
            ocidClose="deepti.lightbox.close_button"
          />
        )}
      </section>

      {/* ── Section E: Ending ── */}
      <section
        className="py-24 px-4 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, oklch(0.89 0.09 295) 0%, oklch(0.86 0.12 310) 40%, oklch(0.90 0.08 330) 70%, oklch(0.88 0.10 288) 100%)",
        }}
      >
        <FloatingHearts count={16} />
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <div className="mb-8 text-5xl" aria-hidden="true">
            💜
          </div>

          <h2
            className="font-display text-3xl sm:text-4xl md:text-5xl font-bold leading-relaxed mb-6"
            style={{
              color: "oklch(0.30 0.18 295)",
              textShadow: "0 2px 12px oklch(0.52 0.18 295 / 0.2)",
            }}
          >
            Once again,
            <br />
            Happy Birthday Deepti.
            <br />
            <span style={{ color: "oklch(0.42 0.15 295)" }}>
              Thank you for being my best friend.
            </span>
          </h2>

          <p
            className="font-display text-xl sm:text-2xl italic mb-12"
            style={{ color: "oklch(0.45 0.14 295)" }}
          >
            Our friendship means the world to me.
          </p>

          {/* Burst container */}
          <div className="relative inline-block" ref={burstContainerRef}>
            <button
              type="button"
              data-ocid="ending.primary_button"
              className="btn-pulse font-body px-8 py-4 rounded-full text-lg sm:text-xl font-bold transition-all duration-300"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.55 0.18 295) 0%, oklch(0.65 0.16 320) 50%, oklch(0.58 0.19 285) 100%)",
                color: "oklch(0.99 0 0)",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 6px 32px oklch(0.52 0.18 295 / 0.45)",
                letterSpacing: "0.02em",
              }}
              onClick={triggerHeartBurst}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform =
                  "scale(1.05) translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 12px 48px oklch(0.52 0.18 295 / 0.55)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1) translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 6px 32px oklch(0.52 0.18 295 / 0.45)";
              }}
            >
              Forever Best Friends 💜
            </button>
          </div>

          <p
            className="font-body mt-6 text-sm"
            style={{ color: "oklch(0.50 0.10 295)" }}
          >
            Click the button for a little surprise ✨
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-6 px-4 text-center font-body text-sm"
        style={{
          background: "oklch(0.93 0.04 295)",
          borderTop: "1.5px solid oklch(0.88 0.06 295)",
          color: "oklch(0.52 0.08 295)",
        }}
      >
        © {new Date().getFullYear()}. Built with{" "}
        <span aria-label="love" role="img">
          💜
        </span>{" "}
        using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "oklch(0.52 0.18 295)", textDecoration: "underline" }}
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}

// ────────────────────────────────────────────────
// App Root
// ────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>("login");

  return (
    <>
      {page === "login" && <LoginPage onSuccess={() => setPage("countdown")} />}
      {page === "countdown" && (
        <CountdownPage onComplete={() => setPage("surprise")} />
      )}
      {page === "surprise" && <SurprisePage />}
    </>
  );
}

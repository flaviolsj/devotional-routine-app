import React, { useEffect, useMemo, useRef, useState } from "react";

const initialWeeklyThemes = [
  {
    day: "Monday",
    theme: "Traffic + Research",
    focus: ["Google Ads", "Keyword Research", "Campaign Structure"],
  },
  {
    day: "Tuesday",
    theme: "Copy + Offer",
    focus: ["Headlines", "Objections", "Ad Angles"],
  },
  {
    day: "Wednesday",
    theme: "Funnel + Page",
    focus: ["Bridge Page", "CTA", "Funnel Structure"],
  },
  {
    day: "Thursday",
    theme: "Data + Risk Management",
    focus: ["CTR", "CPA", "Pauses and Scaling"],
  },
  {
    day: "Friday",
    theme: "A/B Testing + Optimization",
    focus: ["Variations", "Hypotheses", "Fine-Tuning"],
  },
  {
    day: "Saturday",
    theme: "YouTube Dark + Editing",
    focus: ["Script", "Premiere", "Video Pipeline"],
  },
  {
    day: "Sunday",
    theme: "Review + Planning",
    focus: ["Lessons Learned", "Metrics", "Next Week Plan"],
  },
];

const initialCourses = [
  { id: 1, name: "Paid Traffic", type: "principal", progress: 32 },
  { id: 2, name: "Copy", type: "principal", progress: 18 },
  { id: 3, name: "Sales Funnel", type: "principal", progress: 12 },
  { id: 4, name: "Data Analysis", type: "principal", progress: 9 },
  { id: 5, name: "Risk Management", type: "principal", progress: 6 },
  { id: 6, name: "A/B Testing", type: "principal", progress: 4 },
  { id: 7, name: "Web Design", type: "support", progress: 10 },
  { id: 8, name: "Mindset", type: "support", progress: 15 },
  { id: 9, name: "Premiere / Editing", type: "support", progress: 8 },
  { id: 10, name: "Real Estate Equity", type: "incubated", progress: 2 },
];

const initialDailyBlocks = [
  {
    id: "deep",
    title: "Deep Block",
    duration: "2h-3h",
    description: "Guided study of the main topic with practical action extraction.",
  },
  {
    id: "execution",
    title: "Practical Execution",
    duration: "1h30m-2h",
    description: "Apply it to the real project: campaign, copy, funnel, landing page, or test.",
  },
  {
    id: "operational",
    title: "Operational",
    duration: "1h30m-2h",
    description: "Organization, research, editing, structuring, and asset production.",
  },
  {
    id: "support",
    title: "Support Skill",
    duration: "45m-1h",
    description: "Web design, mindset, editing, or light supporting studies.",
  },
  {
    id: "review",
    title: "Success",
    duration: "20m-30m",
    description: "Record takeaways, deliveries, and define the next objective action.",
  },
];

const DAILY_BLOCKS_STORAGE_KEY = "routine.dailyBlocks";
const ALARM_SETTINGS_STORAGE_KEY = "routine.alarmProfile";
const WEEKLY_THEMES_STORAGE_KEY = "routine.weeklyThemes";
const WEEKLY_SPIRIT_STORAGE_KEY = "routine.weeklySpirit";
const COURSES_STORAGE_KEY = "routine.courses";
const WEEKLY_KPI_STORAGE_KEY = "routine.weeklyKpiNotes";

const alarmProfiles = [
  {
    id: "soft",
    name: "Soft",
    description: "A light, short tone for a discreet alert.",
  },
  {
    id: "digital",
    name: "Digital",
    description: "Sharper digital beeps that are easier to notice.",
  },
  {
    id: "bell",
    name: "Bell",
    description: "A fuller sound with a classic bell feel.",
  },
  {
    id: "alert-voice",
    name: "Loud + voice",
    description: "A stronger alarm followed by an English voice prompt.",
  },
];

function getFromStorage(key, fallback) {
  if (typeof window === "undefined") return fallback;
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(fallback)) {
      return Array.isArray(parsed) && parsed.length ? parsed : fallback;
    }
    return { ...fallback, ...parsed };
  } catch {
    return fallback;
  }
}

function buildInitialWeeklySpirit() {
  return initialWeeklyThemes.reduce((acc, item) => {
    acc[item.day] = false;
    return acc;
  }, {});
}

function buildInitialWeeklyKpiNotes() {
  return initialWeeklyThemes.reduce((acc, item) => {
    acc[item.day] = "";
    return acc;
  }, {});
}

function buildInitialTasks(blocks) {
  return [
    { id: 1, title: "Review affiliate campaign in Google Ads", category: "A", done: false },
    { id: 2, title: "Create 3 new ad headlines", category: "B", done: false },
    { id: 3, title: "Analyze keyword CTR and CPC", category: "A", done: true },
    ...blocks.map((block) => ({
      id: `block-${block.id}`,
      title: block.title,
      category: "C",
      done: false,
    })),
  ];
}

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function clampProgress(value) {
  return Math.max(0, Math.min(100, value));
}

function calculateCompletion(tasks) {
  if (!tasks.length) return 0;
  const done = tasks.filter((task) => task.done).length;
  return Math.round((done / tasks.length) * 100);
}

function parseDurationToSeconds(duration) {
  if (!duration) return null;

  const normalized = String(duration).trim().toLowerCase().split(/[-–]/)[0].trim();
  const hoursMatch = normalized.match(/(\d+)\s*h/);
  const minutesMatch = normalized.match(/(\d+)\s*m/);

  const hours = hoursMatch ? Number(hoursMatch[1]) : 0;
  const minutes = minutesMatch ? Number(minutesMatch[1]) : 0;

  if (!hours && !minutes) return null;
  return hours * 3600 + minutes * 60;
}

function formatCountdown(totalSeconds) {
  const safeSeconds = Math.max(0, totalSeconds);
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function playAlarm(profileId) {
  if (typeof window === "undefined") return;

  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const masterGain = audioContext.createGain();
    masterGain.connect(audioContext.destination);

    const beep = ({ frequency, start, duration, volume, type = "sine" }) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, start);
      gainNode.gain.setValueAtTime(0.001, start);
      gainNode.gain.exponentialRampToValueAtTime(volume, start + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, start + duration);

      oscillator.connect(gainNode);
      gainNode.connect(masterGain);
      oscillator.start(start);
      oscillator.stop(start + duration + 0.03);
    };

    const now = audioContext.currentTime + 0.02;

    if (profileId === "soft") {
      beep({ frequency: 784, start: now, duration: 0.32, volume: 0.08, type: "sine" });
      beep({ frequency: 988, start: now + 0.36, duration: 0.45, volume: 0.08, type: "sine" });
    } else if (profileId === "digital") {
      [0, 0.22, 0.44, 0.66].forEach((offset, index) => {
        beep({
          frequency: index % 2 === 0 ? 1046 : 1318,
          start: now + offset,
          duration: 0.14,
          volume: 0.14,
          type: "square",
        });
      });
    } else if (profileId === "bell") {
      [0, 0.42, 0.84].forEach((offset) => {
        beep({ frequency: 880, start: now + offset, duration: 0.38, volume: 0.2, type: "triangle" });
        beep({ frequency: 1320, start: now + offset + 0.05, duration: 0.26, volume: 0.12, type: "sine" });
      });
    } else {
      [0, 0.25, 0.5, 0.75, 1, 1.25].forEach((offset, index) => {
        beep({
          frequency: index % 2 === 0 ? 880 : 660,
          start: now + offset,
          duration: 0.18,
          volume: 0.35,
          type: "sawtooth",
        });
      });

      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        window.setTimeout(() => {
          const utterance = new SpeechSynthesisUtterance("take a break now");
          utterance.lang = "en-US";
          utterance.rate = 0.95;
          utterance.pitch = 0.95;
          utterance.volume = 1;
          window.speechSynthesis.speak(utterance);
        }, 1700);
      }
    }
  } catch {
    // Ignore audio errors when the browser blocks autoplay.
  }
}

function getWeekGuardian(day) {
  const guardians = {
    Monday: {
      title: "Guardian of Focus",
      subtitle: "Start strong and cut the noise.",
      symbol: "◎",
      colors: "from-amber-200 via-orange-100 to-yellow-50 border-amber-300",
      message:
        "Focus means choosing what matters most and sustaining attention on it until it produces real progress. Protect your energy and keep moving without distraction.",
    },
    Tuesday: {
      title: "Architect of Consistency",
      subtitle: "Small pieces build big wins.",
      symbol: "▲",
      colors: "from-sky-200 via-cyan-100 to-white border-sky-300",
      message:
        "Consistency means repeating what matters even when enthusiasm fluctuates. Small steady steps build lasting results.",
    },
    Wednesday: {
      title: "Master of the Turnaround",
      subtitle: "Breathe, adjust, and keep going with presence.",
      symbol: "✦",
      colors: "from-emerald-200 via-lime-100 to-white border-emerald-300",
      message:
        "A turnaround is noticing what needs correction without losing momentum. Adjust with clarity and turn pressure into movement.",
    },
    Thursday: {
      title: "Sentinel of Discipline",
      subtitle: "Discipline is well-directed energy.",
      symbol: "◆",
      colors: "from-rose-200 via-pink-100 to-white border-rose-300",
      message:
        "Discipline means keeping the commitment even without immediate applause. Do what is necessary with firmness and let consistency work for you.",
    },
    Friday: {
      title: "Driver of Progress",
      subtitle: "Finish strong and consolidate the week.",
      symbol: "◉",
      colors: "from-violet-200 via-fuchsia-100 to-white border-violet-300",
      message:
        "Progress is forward movement with direction, not empty speed. Keep refining, adding improvements, and consolidating what has already evolved.",
    },
    Saturday: {
      title: "Inventor of Persistence",
      subtitle: "Creativity is also continuous practice.",
      symbol: "⬢",
      colors: "from-teal-200 via-cyan-100 to-white border-teal-300",
      message:
        "Persistence is continuing to create, test, and refine until the idea takes shape. What persists with intelligence matures.",
    },
    Sunday: {
      title: "Sage of Renewal",
      subtitle: "Planning well means entering next week ahead.",
      symbol: "☼",
      colors: "from-slate-200 via-zinc-100 to-white border-slate-300",
      message:
        "Wise renewal means looking back with learning and forward with intention. Close cycles with clarity and make room for the next leap.",
    },
  };

  return guardians[day] || guardians.Monday;
}

function categoryLabel(category) {
  if (category === "A") return "Drives results - do not postpone!";
  if (category === "B") return "Builds capacity";
  return "Interesting, not urgent";
}

function categoryPill(category) {
  if (category === "A") return "bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-200";
  if (category === "B") return "bg-amber-500/10 text-amber-700 ring-1 ring-amber-200";
  return "bg-slate-500/10 text-slate-700 ring-1 ring-slate-200";
}

function Card({ children, className = "" }) {
  return <div className={cn("rounded-3xl border border-slate-200 bg-white shadow-sm", className)}>{children}</div>;
}

function CardHeader({ children, className = "" }) {
  return <div className={cn("p-5 pb-3", className)}>{children}</div>;
}

function CardTitle({ children, className = "" }) {
  return <h3 className={cn("text-lg font-semibold text-slate-900", className)}>{children}</h3>;
}

function CardDescription({ children, className = "" }) {
  return <p className={cn("text-sm text-slate-500", className)}>{children}</p>;
}

function CardContent({ children, className = "" }) {
  return <div className={cn("p-5 pt-0", className)}>{children}</div>;
}

function Button({ children, className = "", variant = "primary", type = "button", ...props }) {
  const variants = {
    primary: "bg-slate-900 text-white hover:bg-slate-800",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
    outline: "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900",
  };

  return (
    <button
      type={type}
      className={cn("rounded-2xl px-4 py-2 text-sm font-medium whitespace-nowrap transition", variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}

function Input({ className = "", ...props }) {
  return (
    <input
      className={cn(
        "w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500",
        className
      )}
      {...props}
    />
  );
}

function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={cn(
        "w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500",
        className
      )}
      {...props}
    />
  );
}

function Badge({ children, className = "", variant = "default" }) {
  const variants = {
    default: "bg-slate-900 text-white",
    secondary: "bg-slate-100 text-slate-700",
    success: "bg-emerald-100 text-emerald-700",
  };

  return (
    <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-medium", variants[variant], className)}>
      {children}
    </span>
  );
}

function Progress({ value }) {
  const safeValue = clampProgress(Number.isFinite(value) ? value : 0);
  return (
    <div className="h-2 w-full rounded-full bg-slate-200">
      <div className="h-2 rounded-full bg-slate-900 transition-all" style={{ width: `${safeValue}%` }} />
    </div>
  );
}

function Tabs({ active, setActive, items }) {
  return (
    <div
      className="flex w-full gap-2 overflow-x-auto rounded-2xl bg-slate-100 p-1 md:grid"
      style={{ gridTemplateColumns: items.length ? `repeat(${items.length}, minmax(0, 1fr))` : undefined }}
    >
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          onClick={() => setActive(item.value)}
          className={cn(
            "min-w-[112px] shrink-0 rounded-2xl px-3 py-2 text-sm font-medium transition md:min-w-0",
            active === item.value ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

function MetricCard({ label, value, helper }) {
  return (
    <Card className="rounded-2xl">
      <CardContent className="p-4">
        <p className="text-sm text-slate-500">{label}</p>
        <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{value}</p>
        <p className="mt-1 text-xs text-slate-500">{helper}</p>
      </CardContent>
    </Card>
  );
}

function SectionTitle({ title, description, action = null }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <div>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription className="mt-1">{description}</CardDescription> : null}
      </div>
      {action}
    </div>
  );
}

function CourseColumn({
  title,
  description,
  courses,
  onAdjust,
  editingCourseId,
  courseNameDraft,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onDraftChange,
}) {
  return (
    <Card>
      <CardHeader>
        <SectionTitle title={title} description={description} />
      </CardHeader>
      <CardContent className="space-y-4">
        {courses.map((course) => (
          <div key={course.id} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {editingCourseId === course.id ? (
                <div className="flex w-full flex-col gap-3">
                  <Input value={courseNameDraft} onChange={(e) => onDraftChange(e.target.value)} />
                  <div className="flex flex-wrap gap-2">
                    <Button onClick={() => onSaveEdit(course.id)}>Save</Button>
                    <Button variant="outline" onClick={onCancelEdit}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="font-medium text-slate-900">{course.name}</p>
                  <span className="text-sm text-slate-500">Approx. completion {course.progress}%</span>
                </>
              )}
            </div>
            <Progress value={course.progress} />
            <div className="mt-3 flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => onAdjust(course.id, -5)}>
                -5
              </Button>
              <Button onClick={() => onAdjust(course.id, 5)}>+5</Button>
              {editingCourseId === course.id ? null : (
                <Button variant="outline" onClick={() => onStartEdit(course)}>
                  Edit
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function MiniSaaSRotina() {
  const sectionTabsRef = useRef(null);

  const [weeklyThemes, setWeeklyThemes] = useState(() => getFromStorage(WEEKLY_THEMES_STORAGE_KEY, initialWeeklyThemes));
  const [weeklySpirit, setWeeklySpirit] = useState(() => getFromStorage(WEEKLY_SPIRIT_STORAGE_KEY, buildInitialWeeklySpirit()));
  const [weeklyKpiNotes, setWeeklyKpiNotes] = useState(() => getFromStorage(WEEKLY_KPI_STORAGE_KEY, buildInitialWeeklyKpiNotes()));
  const [dailyBlocks, setDailyBlocks] = useState(() => getFromStorage(DAILY_BLOCKS_STORAGE_KEY, initialDailyBlocks));
  const [courses, setCourses] = useState(() => getFromStorage(COURSES_STORAGE_KEY, initialCourses));

  const [editingCourseId, setEditingCourseId] = useState(null);
  const [courseNameDraft, setCourseNameDraft] = useState("");
  const [tasks, setTasks] = useState(() => buildInitialTasks(getFromStorage(DAILY_BLOCKS_STORAGE_KEY, initialDailyBlocks)));
  const [alarmProfile, setAlarmProfile] = useState(() => {
    if (typeof window === "undefined") return "alert-voice";
    const stored = window.localStorage.getItem(ALARM_SETTINGS_STORAGE_KEY);
    return alarmProfiles.some((profile) => profile.id === stored) ? stored : "alert-voice";
  });
  const [activeTimers, setActiveTimers] = useState({});
  const [timerTick, setTimerTick] = useState(Date.now());
  const [editingBlockId, setEditingBlockId] = useState(null);
  const [blockDraft, setBlockDraft] = useState({ title: "", duration: "", description: "" });
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState("A");
  const [taskFilter, setTaskFilter] = useState("ALL");
  const [dailyGoal, setDailyGoal] = useState("Launch 1 new campaign with a better intent structure");
  const [weeklyObjective, setWeeklyObjective] = useState(
    "Advance in Google Ads for affiliate work and turn study into daily execution"
  );
  const [savedDailyGoal, setSavedDailyGoal] = useState("Launch 1 new campaign with a better intent structure");
  const [savedWeeklyObjective, setSavedWeeklyObjective] = useState(
    "Advance in Google Ads for affiliate work and turn study into daily execution"
  );
  const [isDirectionEditing, setIsDirectionEditing] = useState(false);
  const [editingWeekDay, setEditingWeekDay] = useState(null);
  const [weeklyThemeDraft, setWeeklyThemeDraft] = useState({ focus: ["", "", ""] });
  const [review, setReview] = useState({ learned: "", applied: "", result: "", next: "" });

  const completion = useMemo(() => calculateCompletion(tasks), [tasks]);
  const principalCourses = courses.filter((course) => course.type === "principal");
  const supportCourses = courses.filter((course) => course.type === "support");
  const incubatedCourses = courses.filter((course) => course.type === "incubated");
  const orderedCourseNames = courses.map((course) => course.name);
  const weeklyThemesWithCourseNames = weeklyThemes.map((item, index) => ({
    ...item,
    theme: orderedCourseNames[index] || item.theme,
  }));
  const completedTasks = tasks.filter((task) => task.done).length;
  const taskA = tasks.filter((task) => task.category === "A").length;
  const filteredTasks = tasks.filter((task) => taskFilter === "ALL" || task.category === taskFilter);
  const reviewHighlights = [review.learned, review.applied, review.result, review.next].filter((item) => item.trim());
  const reviewCallout =
    reviewHighlights.length > 0
      ? reviewHighlights.slice(0, 2).join(" ").trim()
      : "Your day already produced valuable material. Now consolidate that progress calmly and turn it into a clear record.";

  useEffect(() => {
    window.localStorage.setItem(DAILY_BLOCKS_STORAGE_KEY, JSON.stringify(dailyBlocks));
  }, [dailyBlocks]);

  useEffect(() => {
    window.localStorage.setItem(WEEKLY_THEMES_STORAGE_KEY, JSON.stringify(weeklyThemes));
  }, [weeklyThemes]);

  useEffect(() => {
    window.localStorage.setItem(WEEKLY_SPIRIT_STORAGE_KEY, JSON.stringify(weeklySpirit));
  }, [weeklySpirit]);

  useEffect(() => {
    window.localStorage.setItem(WEEKLY_KPI_STORAGE_KEY, JSON.stringify(weeklyKpiNotes));
  }, [weeklyKpiNotes]);

  useEffect(() => {
    window.localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    window.localStorage.setItem(ALARM_SETTINGS_STORAGE_KEY, alarmProfile);
  }, [alarmProfile]);

  useEffect(() => {
    const timerIds = Object.keys(activeTimers);
    if (!timerIds.length) return undefined;

    const intervalId = window.setInterval(() => {
      setTimerTick(Date.now());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [activeTimers]);

  useEffect(() => {
    const now = Date.now();
    const completedTimerIds = Object.entries(activeTimers)
      .filter(([, timer]) => !timer.isPaused && timer.endsAt <= now)
      .map(([taskId]) => taskId);

    if (!completedTimerIds.length) return;

    setTasks((prev) => prev.map((task) => (completedTimerIds.includes(String(task.id)) ? { ...task, done: true } : task)));
    setActiveTimers((prev) => {
      const next = { ...prev };
      completedTimerIds.forEach((taskId) => {
        delete next[taskId];
      });
      return next;
    });
    playAlarm(alarmProfile);
  }, [activeTimers, timerTick, alarmProfile]);

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks((prev) => [{ id: Date.now(), title: newTask.trim(), category: newTaskCategory, done: false }, ...prev]);
    setNewTask("");
  };

  const toggleTask = (id) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, done: !task.done } : task)));
    setActiveTimers((prev) => {
      const key = String(id);
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    setActiveTimers((prev) => {
      const key = String(id);
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const updateCourseProgress = (id, change) => {
    setCourses((prev) =>
      prev.map((course) => (course.id === id ? { ...course, progress: clampProgress(course.progress + change) } : course))
    );
  };

  const startCourseEdit = (course) => {
    setEditingCourseId(course.id);
    setCourseNameDraft(course.name);
  };

  const cancelCourseEdit = () => {
    setEditingCourseId(null);
    setCourseNameDraft("");
  };

  const saveCourseEdit = (id) => {
    const nextName = courseNameDraft.trim() || "Course";
    setCourses((prev) => prev.map((course) => (course.id === id ? { ...course, name: nextName } : course)));
    cancelCourseEdit();
  };

  const saveDirection = () => {
    setSavedWeeklyObjective(weeklyObjective.trim() || "Define a weekly objective");
    setSavedDailyGoal(dailyGoal.trim() || "Define a main goal of the day");
    setIsDirectionEditing(false);
  };

  const editDirection = () => {
    setWeeklyObjective(savedWeeklyObjective);
    setDailyGoal(savedDailyGoal);
    setIsDirectionEditing(true);
  };

  const startBlockEdit = (block) => {
    setEditingBlockId(block.id);
    setBlockDraft({
      title: block.title,
      duration: block.duration,
      description: block.description,
    });
  };

  const cancelBlockEdit = () => {
    setEditingBlockId(null);
    setBlockDraft({ title: "", duration: "", description: "" });
  };

  const saveBlockEdit = (blockId) => {
    const nextTitle = blockDraft.title.trim() || "Block";
    const nextDuration = blockDraft.duration.trim() || "-";
    const nextDescription = blockDraft.description.trim() || "No description.";

    setDailyBlocks((prev) =>
      prev.map((block) =>
        block.id === blockId ? { ...block, title: nextTitle, duration: nextDuration, description: nextDescription } : block
      )
    );
    setTasks((prev) => prev.map((task) => (task.id === `block-${blockId}` ? { ...task, title: nextTitle } : task)));
    cancelBlockEdit();
  };

  const startTaskTimer = (task) => {
    if (typeof task.id !== "string" || !task.id.startsWith("block-")) return;

    const blockId = task.id.replace("block-", "");
    const block = dailyBlocks.find((item) => item.id === blockId);
    const durationInSeconds = parseDurationToSeconds(block?.duration);
    if (!durationInSeconds) return;

    setTasks((prev) => prev.map((item) => (item.id === task.id ? { ...item, done: false } : item)));
    setActiveTimers((prev) => ({
      ...prev,
      [task.id]: {
        endsAt: Date.now() + durationInSeconds * 1000,
        remainingSeconds: durationInSeconds,
        isPaused: false,
      },
    }));
    setTimerTick(Date.now());
  };

  const getTaskTimerLabel = (task) => {
    const timer = activeTimers[String(task.id)];
    if (!timer) return null;
    const remainingSeconds = timer.isPaused ? timer.remainingSeconds : Math.ceil((timer.endsAt - timerTick) / 1000);
    return formatCountdown(remainingSeconds);
  };

  const startWeeklyThemeEdit = (item) => {
    setEditingWeekDay(item.day);
    setWeeklyThemeDraft({
      focus: [...item.focus],
    });
  };

  const cancelWeeklyThemeEdit = () => {
    setEditingWeekDay(null);
    setWeeklyThemeDraft({ focus: ["", "", ""] });
  };

  const saveWeeklyThemeEdit = (day) => {
    const nextFocus = weeklyThemeDraft.focus.map((item) => item.trim() || "New focus");
    setWeeklyThemes((prev) => prev.map((item) => (item.day === day ? { ...item, focus: nextFocus } : item)));
    cancelWeeklyThemeEdit();
  };

  const toggleWeeklySpirit = (day) => {
    setWeeklySpirit((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  const resetWeeklySpirit = () => {
    setWeeklySpirit(
      weeklyThemes.reduce((acc, item) => {
        acc[item.day] = false;
        return acc;
      }, {})
    );
    scrollToContentTop();
  };

  const toggleTaskTimerPause = (task) => {
    const key = String(task.id);

    setActiveTimers((prev) => {
      const timer = prev[key];
      if (!timer) return prev;

      if (timer.isPaused) {
        return {
          ...prev,
          [key]: {
            ...timer,
            isPaused: false,
            endsAt: Date.now() + timer.remainingSeconds * 1000,
          },
        };
      }

      const remainingSeconds = Math.max(0, Math.ceil((timer.endsAt - Date.now()) / 1000));
      return {
        ...prev,
        [key]: {
          ...timer,
          isPaused: true,
          remainingSeconds,
        },
      };
    });
    setTimerTick(Date.now());
  };

  const scrollToContentTop = () => {
    window.setTimeout(() => {
      const targetTop = sectionTabsRef.current?.getBoundingClientRect().top;
      if (typeof targetTop !== "number") return;

      window.scrollTo({
        top: Math.max(0, window.scrollY + targetTop - 8),
        behavior: "smooth",
      });
    }, 0);
  };

  const scrollToPageTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSectionChange = (nextTab) => {
    if (nextTab === "__top__") {
      setIsMobileMenuOpen(false);
      scrollToPageTop();
      return;
    }

    setActiveTab(nextTab);
    setIsMobileMenuOpen(false);
    scrollToContentTop();
  };

  const navigationItems = [
    { value: "dashboard", label: "Dashboard", desc: "Overview and execution" },
    { value: "week", label: "Week", desc: "Themes and cadence" },
    { value: "courses", label: "Courses", desc: "Tracks and progress" },
    { value: "review", label: "Review", desc: "Learnings and check-ins" },
    { value: "settings", label: "Settings", desc: "Alarms and preferences" },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="hidden border-r border-slate-200 bg-slate-950 text-slate-100 lg:flex lg:flex-col">
          <div className="border-b border-slate-800 px-6 py-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Routine OS</p>
            <h1 className="mt-2 text-xl font-semibold">Strategic Productivity</h1>
            <p className="mt-2 text-sm text-slate-400">Execution system for study with practical application.</p>
          </div>

          <nav className="flex-1 space-y-1 px-4 py-6">
            {navigationItems.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => handleSectionChange(item.value)}
                className={cn(
                  "w-full rounded-2xl px-4 py-3 text-left transition",
                  activeTab === item.value ? "bg-white/10" : "hover:bg-white/5"
                )}
              >
                <p className="font-medium text-slate-100">{item.label}</p>
                <p className="mt-1 text-xs text-slate-400">{item.desc}</p>
              </button>
            ))}
          </nav>

          <div className="border-t border-slate-800 px-4 py-4">
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Core rule</p>
              <p className="mt-2 text-sm text-slate-200">Study -&gt; application -&gt; measurement -&gt; adjustment -&gt; order and progress</p>

            </div>
          </div>
        </aside>

        {isMobileMenuOpen ? (
          <div className="fixed inset-0 z-40 bg-slate-950/45 lg:hidden" onClick={() => setIsMobileMenuOpen(false)}>
            <aside
              className="h-full w-[min(88vw,288px)] overflow-y-auto border-r border-slate-800 bg-slate-950 text-slate-100 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between border-b border-slate-800 px-6 py-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Routine OS</p>
                  <h1 className="mt-2 text-xl font-semibold">Strategic Productivity</h1>
                  <p className="mt-2 text-sm text-slate-400">Execution system for study with practical application.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-2xl border border-slate-700 px-3 py-2 text-sm text-slate-200"
                >
                  Close
                </button>
              </div>

              <nav className="space-y-1 px-4 py-6">
                {navigationItems.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => handleSectionChange(item.value)}
                    className={cn(
                      "w-full rounded-2xl px-4 py-3 text-left transition",
                      activeTab === item.value ? "bg-white/10" : "hover:bg-white/5"
                    )}
                  >
                    <p className="font-medium text-slate-100">{item.label}</p>
                    <p className="mt-1 text-xs text-slate-400">{item.desc}</p>
                  </button>
                ))}
              </nav>
            </aside>
          </div>
        ) : null}

        <main className="min-w-0">
          <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 md:px-8 md:py-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-500">Routine operating system</p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">Strategic Execution Dashboard</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-3xl border border-slate-200 bg-white shadow-sm lg:hidden"
                  aria-label="Open side menu"
                >
                  <span className="flex flex-col gap-1.5">
                    <span className="block h-0.5 w-6 rounded-full bg-slate-900" />
                    <span className="block h-0.5 w-6 rounded-full bg-slate-900" />
                    <span className="block h-0.5 w-6 rounded-full bg-slate-900" />
                  </span>
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-2 md:gap-3">
                <Badge variant="secondary">Main focus</Badge>
                <Badge>Google Ads</Badge>
                <Button variant="outline">Export routine</Button>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-7xl space-y-6 px-4 py-5 md:px-8 md:py-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard label="Daily completion" value={`${completion}%`} helper={`${completedTasks} of ${tasks.length} completed tasks`} />
              <MetricCard label="Priority A" value={`${taskA}`} helper="Items that drive income now" />
              <MetricCard label="Active courses" value={`${principalCourses.length}`} helper="Tracks in the main focus" />
              <MetricCard label="Weekly cadence" value="7 blocks" helper="Week structured by theme" />
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
              <Card>
                <CardHeader>
                  <SectionTitle
                    title="Weekly direction"
                    description="Define the central objective and the daily operational goal to reduce distraction."
                    action={
                      <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
                        <Badge variant="secondary">Current sprint</Badge>
                        {isDirectionEditing ? (
                          <Button onClick={saveDirection}>Save</Button>
                        ) : (
                          <Button variant="outline" onClick={editDirection}>
                            Edit
                          </Button>
                        )}
                      </div>
                    }
                  />
                </CardHeader>
                <CardContent className="space-y-4">
                  {isDirectionEditing ? (
                    <>
                      <div>
                        <p className="mb-2 text-sm font-medium text-slate-600">Weekly objective</p>
                        <Textarea value={weeklyObjective} onChange={(e) => setWeeklyObjective(e.target.value)} rows={4} />
                      </div>
                      <div>
                        <p className="mb-2 text-sm font-medium text-slate-600">Main goal of the day</p>
                        <Input value={dailyGoal} onChange={(e) => setDailyGoal(e.target.value)} />
                      </div>
                    </>
                  ) : (
                    <div className="grid gap-4 lg:grid-cols-2">
                      <div className="rounded-[2rem] border border-amber-200 bg-gradient-to-br from-amber-200 via-yellow-100 to-amber-50 p-5 shadow-[0_18px_40px_rgba(146,64,14,0.18)] sm:rotate-[-1.5deg] sm:p-6">
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-800/70">Weekly objective</p>
                        <p
                          className="mt-4 text-2xl leading-tight text-slate-900 md:text-4xl"
                          style={{ fontFamily: '"Segoe Print", "Trebuchet MS", cursive' }}
                        >
                          {savedWeeklyObjective}
                        </p>
                      </div>
                      <div className="rounded-[2rem] border border-sky-200 bg-gradient-to-br from-sky-200 via-cyan-100 to-white p-5 shadow-[0_18px_40px_rgba(14,116,144,0.16)] sm:rotate-[1.2deg] sm:p-6">
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-800/70">Day goal</p>
                        <p
                          className="mt-4 text-2xl leading-tight text-slate-900 md:text-4xl"
                          style={{ fontFamily: '"Segoe Print", "Trebuchet MS", cursive' }}
                        >
                          {savedDailyGoal}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <Badge>1 main goal</Badge>
                    <Badge variant="secondary">3 critical tasks</Badge>
                    <Badge variant="secondary">1 concrete delivery</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <SectionTitle title="Executive summary" description="Quick read of the day's operation." />
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Current focus</p>
                    <p className="mt-2 font-semibold">Google Ads + Copy + Funnel + Metrics</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Execution mode</p>
                    <p className="mt-2 font-semibold">Study -&gt; application -&gt; measurement -&gt; adjustment</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Operational decision</p>
                    <p className="mt-2 text-sm text-slate-700">Prioritize Category A before any support task.</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div ref={sectionTabsRef} className="sticky top-0 z-20 bg-slate-100/95 py-1 backdrop-blur supports-[backdrop-filter]:bg-slate-100/80">
              <Tabs
                active={activeTab}
                setActive={handleSectionChange}
                items={[
                  { value: "dashboard", label: "Dashboard" },
                  { value: "week", label: "Week" },
                  { value: "courses", label: "Courses" },
                  { value: "review", label: "Review" },
                  { value: "__top__", label: "Top" },
                ]}
              />
            </div>

            {activeTab === "dashboard" && (
              <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
                <Card>
                  <CardHeader>
                    <SectionTitle title="Critical tasks of the day" description="Prioritize what creates real results and protects your focus." />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-3 md:grid-cols-[1fr_170px_170px_120px]">
                      <Input placeholder="Add critical task" value={newTask} onChange={(e) => setNewTask(e.target.value)} />
                      <select
                        value={newTaskCategory}
                        onChange={(e) => setNewTaskCategory(e.target.value)}
                        className="rounded-2xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                      >
                        <option value="A">Category A</option>
                        <option value="B">Category B</option>
                        <option value="C">Category C</option>
                      </select>
                      <select
                        value={taskFilter}
                        onChange={(e) => setTaskFilter(e.target.value)}
                        className="rounded-2xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                      >
                        <option value="ALL">All</option>
                        <option value="A">Filter A</option>
                        <option value="B">Filter B</option>
                        <option value="C">Filter C</option>
                      </select>
                      <Button className="w-full md:w-auto" onClick={addTask}>
                        Add
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {filteredTasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:flex-row md:items-start md:justify-between"
                        >
                          <label className="flex min-w-0 items-start gap-3">
                            <input
                              type="checkbox"
                              checked={task.done}
                              onChange={() => toggleTask(task.id)}
                              className="mt-1 h-4 w-4"
                            />
                            <div>
                              <p className={cn("font-medium", task.done ? "text-slate-400 line-through" : "text-slate-900")}>{task.title}</p>
                              <p className="mt-1 text-sm text-slate-500">{categoryLabel(task.category)}</p>
                            </div>
                          </label>
                          <div className="flex w-full flex-wrap items-center gap-2 sm:justify-start md:w-auto md:justify-end">
                            {typeof task.id === "string" && task.id.startsWith("block-") ? (
                              activeTimers[String(task.id)] ? (
                                <>
                                  <Badge variant="secondary" className="min-w-[88px] justify-center font-mono">
                                    {getTaskTimerLabel(task)}
                                  </Badge>
                                  <Button variant="outline" onClick={() => toggleTaskTimerPause(task)}>
                                    {activeTimers[String(task.id)]?.isPaused ? "Resume" : "Pause"}
                                  </Button>
                                </>
                              ) : (
                                <Button variant="outline" onClick={() => startTaskTimer(task)}>
                                  Start
                                </Button>
                              )
                            ) : null}
                            {(task.category === "A" || task.category === "B") && typeof task.id !== "string" ? (
                              <Button variant="outline" onClick={() => deleteTask(task.id)}>
                                Delete
                              </Button>
                            ) : null}
                            <span className={cn("rounded-full px-3 py-1 text-xs font-medium", categoryPill(task.category))}>{task.category}</span>
                            {task.done ? <Badge variant="success">Completed</Badge> : <Badge variant="secondary">Pending</Badge>}
                          </div>
                        </div>
                      ))}
                      {!filteredTasks.length ? (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
                          No tasks found for this filter.
                        </div>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <SectionTitle title="Daily blocks" description="Routine designed for study with immediate application." />
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {dailyBlocks.map((block) => (
                      <div key={block.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        {editingBlockId === block.id ? (
                          <div className="space-y-3">
                            <Input
                              value={blockDraft.title}
                              onChange={(e) => setBlockDraft((prev) => ({ ...prev, title: e.target.value }))}
                              placeholder="Block title"
                            />
                            <Input
                              value={blockDraft.duration}
                              onChange={(e) => setBlockDraft((prev) => ({ ...prev, duration: e.target.value }))}
                              placeholder="Duration"
                            />
                            <Textarea
                              value={blockDraft.description}
                              onChange={(e) => setBlockDraft((prev) => ({ ...prev, description: e.target.value }))}
                              rows={3}
                              placeholder="Block description"
                            />
                            <div className="flex flex-wrap gap-2">
                              <Button onClick={() => saveBlockEdit(block.id)}>Save</Button>
                              <Button variant="outline" onClick={cancelBlockEdit}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                              <p className="font-medium text-slate-900">{block.title}</p>
                              <Badge variant="secondary">{block.duration}</Badge>
                            </div>
                            <p className="mt-2 text-sm text-slate-500">{block.description}</p>
                            <div className="mt-3">
                              <Button variant="outline" onClick={() => startBlockEdit(block)}>
                                Edit
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "week" && (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {weeklyThemesWithCourseNames.map((item) => (
                  <Card key={item.day} className="h-full">
                    <CardHeader>
                      <SectionTitle
                        title={item.day}
                        description={item.theme}
                        action={
                          <div className="flex flex-wrap items-center gap-2">
                            <label className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700">
                              <input
                                type="checkbox"
                                checked={Boolean(weeklySpirit[item.day])}
                                onChange={() => toggleWeeklySpirit(item.day)}
                                className="h-4 w-4"
                              />
                              To do
                            </label>
                            {editingWeekDay === item.day ? null : (
                              <Button variant="outline" onClick={() => startWeeklyThemeEdit(item)}>
                                Edit
                              </Button>
                            )}
                          </div>
                        }
                      />
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {editingWeekDay === item.day ? (
                        <div className="space-y-3">
                          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
                            Theme synced with Courses: <span className="font-medium text-slate-900">{item.theme}</span>
                          </div>
                          {weeklyThemeDraft.focus.map((focusItem, index) => (
                            <Input
                              key={`${item.day}-${index}`}
                              value={focusItem}
                              onChange={(e) =>
                                setWeeklyThemeDraft((prev) => ({
                                  ...prev,
                                  focus: prev.focus.map((entry, focusIndex) => (focusIndex === index ? e.target.value : entry)),
                                }))
                              }
                              placeholder={`Focus ${index + 1}`}
                            />
                          ))}
                          <div className="flex flex-wrap gap-2">
                            <Button onClick={() => saveWeeklyThemeEdit(item.day)}>Save</Button>
                            <Button variant="outline" onClick={cancelWeeklyThemeEdit}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : weeklySpirit[item.day] ? (
                        <div
                          className={cn(
                            "rounded-[2rem] border bg-gradient-to-br p-5 shadow-[0_18px_40px_rgba(15,23,42,0.12)]",
                            getWeekGuardian(item.day).colors
                          )}
                        >
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-600">Daily persona</p>
                              <h4 className="mt-3 text-2xl font-semibold text-slate-900">{getWeekGuardian(item.day).title}</h4>
                              <p className="mt-2 text-sm leading-6 text-slate-700">{getWeekGuardian(item.day).subtitle}</p>
                            </div>
                            <div
                              className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] border border-white/60 bg-white/60 text-3xl text-slate-900 shadow-sm"
                              style={{ fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif' }}
                            >
                              {getWeekGuardian(item.day).symbol}
                            </div>
                          </div>
                          <div className="mt-4 rounded-2xl bg-white/65 p-4">
                            <p className="text-sm font-medium text-slate-800">{getWeekGuardian(item.day).message}</p>
                          </div>
                        </div>
                      ) : (
                        <>
                          {item.focus.map((focusItem) => (
                            <div key={focusItem} className="rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-700">
                              {focusItem}
                            </div>
                          ))}
                          <div className="mt-3 border-t border-slate-100 pt-4">
                            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">KPI of the day</p>
                            <Input
                              value={weeklyKpiNotes[item.day] || ""}
                              onChange={(e) =>
                                setWeeklyKpiNotes((prev) => ({
                                  ...prev,
                                  [item.day]: e.target.value,
                                }))
                              }
                              placeholder="Define the day’s objective for this card"
                            />
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                ))}

                <button
                  type="button"
                  onClick={resetWeeklySpirit}
                  className="rounded-3xl border border-dashed border-slate-300 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-slate-400 hover:shadow-md sm:p-6"
                >
                  <div className="flex h-full min-h-[220px] flex-col justify-between rounded-[2rem] bg-gradient-to-br from-slate-100 via-white to-slate-50 p-5 sm:min-h-[260px] sm:p-6">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Quick action</p>
                      <h3 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Reset week</h3>
                      <p className="mt-3 max-w-sm text-base leading-7 text-slate-600">
                        Uncheck all To do items, restore the week cards, and take yourself back to the top to start again.
                      </p>
                    </div>
                    <div className="mt-6 inline-flex w-fit rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700">
                      Reset now
                    </div>
                  </div>
                </button>
              </div>
            )}

            {activeTab === "courses" && (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <CourseColumn
                  title="Main focus"
                  description="Courses that drive your growth right now."
                  courses={principalCourses}
                  onAdjust={updateCourseProgress}
                  editingCourseId={editingCourseId}
                  courseNameDraft={courseNameDraft}
                  onStartEdit={startCourseEdit}
                  onCancelEdit={cancelCourseEdit}
                  onSaveEdit={saveCourseEdit}
                  onDraftChange={setCourseNameDraft}
                />
                <CourseColumn
                  title="Support"
                  description="Important, but without stealing energy from the main focus."
                  courses={supportCourses}
                  onAdjust={updateCourseProgress}
                  editingCourseId={editingCourseId}
                  courseNameDraft={courseNameDraft}
                  onStartEdit={startCourseEdit}
                  onCancelEdit={cancelCourseEdit}
                  onSaveEdit={saveCourseEdit}
                  onDraftChange={setCourseNameDraft}
                />
                <CourseColumn
                  title="Incubated"
                  description="Interests kept in light mode without diluting your focus."
                  courses={incubatedCourses}
                  onAdjust={updateCourseProgress}
                  editingCourseId={editingCourseId}
                  courseNameDraft={courseNameDraft}
                  onStartEdit={startCourseEdit}
                  onCancelEdit={cancelCourseEdit}
                  onSaveEdit={saveCourseEdit}
                  onDraftChange={setCourseNameDraft}
                />
              </div>
            )}

            {activeTab === "review" && (
              <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
                <Card>
                  <CardHeader>
                    <SectionTitle title="Daily closing" description="Turn each day into measurable learning." />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="mb-2 text-sm font-medium text-slate-600">What did I learn today?</p>
                      <Textarea value={review.learned} onChange={(e) => setReview({ ...review, learned: e.target.value })} rows={4} />
                    </div>
                    <div>
                      <p className="mb-2 text-sm font-medium text-slate-600">What did I apply today?</p>
                      <Textarea value={review.applied} onChange={(e) => setReview({ ...review, applied: e.target.value })} rows={4} />
                    </div>
                    <div>
                      <p className="mb-2 text-sm font-medium text-slate-600">What result showed up?</p>
                      <Textarea value={review.result} onChange={(e) => setReview({ ...review, result: e.target.value })} rows={4} />
                    </div>
                    <div>
                      <p className="mb-2 text-sm font-medium text-slate-600">What is the next objective action?</p>
                      <Textarea value={review.next} onChange={(e) => setReview({ ...review, next: e.target.value })} rows={4} />
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-6">
                  <Card className="border-amber-200 bg-gradient-to-br from-amber-100 via-orange-50 to-white shadow-[0_18px_40px_rgba(180,83,9,0.12)]">
                    <CardHeader>
                      <SectionTitle title="Consolidated summary" description="Close the loop with positive energy and practical clarity." />
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="rounded-[1.75rem] bg-white/75 p-5">
                        <p className="text-lg font-semibold leading-8 text-slate-900">{reviewCallout}</p>
                      </div>
                      <div className="rounded-[1.75rem] border border-amber-200 bg-amber-50/80 p-5">
                        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-700">Next step</p>
                        <p className="mt-3 text-base leading-7 text-slate-800">
                          Now transfer this consolidated summary to paper with a pen or pencil and turn reflection into concrete direction.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <SectionTitle title="System rules" description="Criteria to avoid distraction and maintain traction." />
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-slate-600">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="font-medium text-slate-900">1. One main engine</p>
                        <p className="mt-1">Work hard on the ecosystem that currently generates income: traffic, copy, funnel, data, testing, and risk.</p>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="font-medium text-slate-900">2. Study without application does not count</p>
                        <p className="mt-1">Each session must end with at least one delivery or one testable hypothesis.</p>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="font-medium text-slate-900">3. Prioritize by impact</p>
                        <p className="mt-1">Category A before B. Category B before C. Do not reverse that order.</p>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="font-medium text-slate-900">4. Daily closing is mandatory</p>
                        <p className="mt-1">Learning, application, result, and next action must be recorded.</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <Card>
                  <CardHeader>
                    <SectionTitle title="Alarm settings" description="Choose the sound used when a block timer ends." />
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {alarmProfiles.map((profile) => (
                      <label
                        key={profile.id}
                        className={cn(
                          "flex cursor-pointer items-start justify-between gap-4 rounded-2xl border p-4 transition",
                          alarmProfile === profile.id ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-slate-50 text-slate-900"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="alarm-profile"
                            checked={alarmProfile === profile.id}
                            onChange={() => setAlarmProfile(profile.id)}
                            className="mt-1 h-4 w-4"
                          />
                          <div>
                            <p className="font-medium">{profile.name}</p>
                            <p className={cn("mt-1 text-sm", alarmProfile === profile.id ? "text-slate-200" : "text-slate-500")}>
                              {profile.description}
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant={alarmProfile === profile.id ? "secondary" : "outline"}
                          onClick={(e) => {
                            e.preventDefault();
                            playAlarm(profile.id);
                          }}
                        >
                          Test
                        </Button>
                      </label>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <SectionTitle
                      title="Active sound"
                      description="The selected option is saved in the browser and remains active after refreshing the app."
                    />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-sm text-slate-500">Current profile</p>
                      <p className="mt-2 text-2xl font-semibold text-slate-900">
                        {alarmProfiles.find((profile) => profile.id === alarmProfile)?.name}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                      The <strong>{alarmProfiles.find((profile) => profile.id === alarmProfile)?.name}</strong> profile will be used when block timers end.
                    </div>
                    <Button onClick={() => playAlarm(alarmProfile)}>Test selected sound</Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

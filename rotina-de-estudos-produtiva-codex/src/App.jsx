import React, { useEffect, useMemo, useRef, useState } from "react";

const DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const LANGUAGE_STORAGE_KEY = "routine.language";
const CURRENCY_BY_LANGUAGE = { pt: "BRL", en: "USD" };

const CONTENT_BY_LANGUAGE = {
  en: {
    weeklyThemes: [
      { day: "Monday", theme: "Devotional", focus: ["Scripture reading", "Prayer", "Spiritual focus"] },
      { day: "Tuesday", theme: "Wisdom", focus: ["Proverbs", "Discernment", "Sound judgment"] },
      { day: "Wednesday", theme: "Reflection", focus: ["Inner review", "Stillness", "Personal alignment"] },
      { day: "Thursday", theme: "Practical Application", focus: ["Obedience", "Action steps", "Daily implementation"] },
      { day: "Friday", theme: "Male Discipline", focus: ["Self-control", "Consistency", "Responsibility"] },
      { day: "Saturday", theme: "Leadership", focus: ["Vision", "Service", "Decision making"] },
      { day: "Sunday", theme: "Purpose", focus: ["Calling", "Direction", "Weekly alignment"] },
    ],
    courses: [
      { id: 1, name: "Scripture Reading", type: "principal", progress: 32 },
      { id: 2, name: "Prayer", type: "principal", progress: 18 },
      { id: 3, name: "Wisdom", type: "principal", progress: 12 },
      { id: 4, name: "Reflection", type: "principal", progress: 9 },
      { id: 5, name: "Practical Application", type: "principal", progress: 6 },
      { id: 6, name: "Male Discipline", type: "principal", progress: 4 },
      { id: 7, name: "Leadership", type: "support", progress: 10 },
      { id: 8, name: "Purpose", type: "support", progress: 15 },
      { id: 9, name: "Content Creation", type: "support", progress: 8 },
      { id: 10, name: "Monetization", type: "incubated", progress: 2 },
    ],
    dailyBlocks: [
      { id: "deep", title: "Devotional Block", duration: "2h-3h", description: "Guided time for Scripture, prayer, and clear obedience." },
      { id: "execution", title: "Practical Application", duration: "1h30m-2h", description: "Apply the message to real life: decisions, habits, and conduct." },
      { id: "operational", title: "Male Discipline", duration: "1h30m-2h", description: "Organization, restraint, consistency, and responsibility." },
      { id: "support", title: "Leadership Block", duration: "45m-1h", description: "Leadership, service, clarity, and calm direction." },
      { id: "review", title: "Purpose Review", duration: "20m-30m", description: "Record insights, actions, and next direction." },
    ],
    taskTemplates: [
      { id: 1, title: "Review devotional routine structure", category: "A", done: false },
      { id: 2, title: "Write 3 new devotional prompts", category: "B", done: false },
      { id: 3, title: "Analyze scripture flow and clarity", category: "A", done: true },
    ],
    weeklyObjective: "Advance the devotional app and turn study into daily obedience",
    dailyGoal: "Strengthen the devotional routine and keep the heart aligned",
    savedWeeklyObjective: "Advance the devotional app and turn study into daily obedience",
    savedDailyGoal: "Strengthen the devotional routine and keep the heart aligned",
    review: { learned: "", applied: "", result: "", next: "" },
    ui: {
      osName: "Devotional OS",
      productName: "Men of Purpose",
      productSubtitle: "Execution system for faith, discipline, and leadership.",
      headerSubtitle: "Devotional operating system",
      dashboardTitle: "Men of Purpose Dashboard",
      dashboardSubtitle: "Overview and direction",
      mainFocusBadge: "Main focus",
      devotionalBadge: "Devotional Life",
      exportButton: "Export routine",
      dailyCompletion: "Daily completion",
      priorityA: "Priority A",
      activePaths: "Active paths",
      weeklyCadence: "Weekly cadence",
      activePathsHelper: "Areas of formation",
      weeklyCadenceHelper: "Week structured by theme",
      weeklyDirectionTitle: "Weekly direction",
      weeklyDirectionDesc: "Define the central objective and the daily goal to reduce distraction.",
      currentSprint: "{copy.currentSprint}",
      weeklyObjectiveLabel: "{copy.weeklyObjectiveLabel}",
      dailyGoalLabel: "{copy.dailyGoalLabel}",
      oneMainGoal: "1 main goal",
      threeCriticalTasks: "3 critical tasks",
      oneConcreteAction: "1 concrete action",
      executiveSummaryTitle: "{copy.executiveSummaryTitle}",
      executiveSummaryDesc: "Quick read of the day's direction.",
      currentFocus: "Current focus",
      executionMode: "Execution mode",
      practicalDecision: "Practical decision",
      dailyBlocksTitle: "{copy.dailyBlocksTitle}",
      dailyBlocksDesc: "Routine designed for Scripture with immediate application.",
      weeklyThemesTitle: "{copy.weeklyThemesTitle}",
      weeklyThemesDesc: "Seven days of focused themes aligned to the main objective.",
      pathsTitle: "Paths",
      pathsDesc: "Formation and progress",
      reviewTitle: "Review",
      reviewDesc: "Learnings and alignment",
      settingsTitle: "Settings",
      settingsDesc: "Alarms and preferences",
      categoryATitle: "{copy.categoryATitle}",
      categoryADesc: "Prioritize what shapes character and protects your focus.",
      addTaskLabel: "Add task",
      filterLabel: "Filter",
      reviewPromptTitle: "{copy.reviewPromptTitle}",
      reviewPromptDesc: "Write what you learned, applied, and will carry forward.",
      reviewQ1: "What did I learn today?",
      reviewQ2: "What did I apply today?",
      reviewQ3: "What result showed up?",
      reviewQ4: "What is the next objective action?",
      scoreLabel: "How did I do today?",
      wisdomNote1: "Study without application does not count",
      wisdomNote1Body: "Each session must end with one clear action or one obedience step.",
      wisdomNote2: "Prioritize by impact",
      wisdomNote2Body: "The tasks that build the future of the man must be done before support work.",
      wisdomNote3: "Protect the rhythm",
      wisdomNote3Body: "Consistency matters more than intensity.",
      weekTab: "Week",
      dashboardTab: "Dashboard",
      reviewTab: "Review",
      topTab: "Top",
      pathsTab: "Paths",
      save: "{copy.save}",
      edit: "{copy.edit}",
      close: "{copy.close}",
      languageToggle: "PT",
      currency: "USD",
      currencyLabel: "Currency",
      completed: "Completed",
      pending: "Pending",
    },
  },
  pt: {
    weeklyThemes: [
      { day: "Monday", theme: "Devocional", focus: ["Leitura bíblica", "Oração", "Foco espiritual"] },
      { day: "Tuesday", theme: "Sabedoria", focus: ["Provérbios", "Discernimento", "Bom julgamento"] },
      { day: "Wednesday", theme: "Reflexão", focus: ["Revisão interior", "Silêncio", "Alinhamento pessoal"] },
      { day: "Thursday", theme: "Aplicação prática", focus: ["Obediência", "Passos de ação", "Implementação diária"] },
      { day: "Friday", theme: "Disciplina masculina", focus: ["Autocontrole", "Consistência", "Responsabilidade"] },
      { day: "Saturday", theme: "Liderança", focus: ["Visão", "Serviço", "Tomada de decisão"] },
      { day: "Sunday", theme: "Propósito", focus: ["Chamado", "Direção", "Alinhamento da semana"] },
    ],
    courses: [
      { id: 1, name: "Leitura bíblica", type: "principal", progress: 32 },
      { id: 2, name: "Oração", type: "principal", progress: 18 },
      { id: 3, name: "Sabedoria", type: "principal", progress: 12 },
      { id: 4, name: "Reflexão", type: "principal", progress: 9 },
      { id: 5, name: "Aplicação prática", type: "principal", progress: 6 },
      { id: 6, name: "Disciplina masculina", type: "principal", progress: 4 },
      { id: 7, name: "Liderança", type: "support", progress: 10 },
      { id: 8, name: "Propósito", type: "support", progress: 15 },
      { id: 9, name: "Criação de conteúdo", type: "support", progress: 8 },
      { id: 10, name: "Monetização", type: "incubated", progress: 2 },
    ],
    dailyBlocks: [
      { id: "deep", title: "Bloco devocional", duration: "2h-3h", description: "Tempo guiado para Escritura, oração e obediência clara." },
      { id: "execution", title: "Aplicação prática", duration: "1h30m-2h", description: "Aplique a mensagem na vida real: decisões, hábitos e conduta." },
      { id: "operational", title: "Disciplina masculina", duration: "1h30m-2h", description: "Organização, contenção, consistência e responsabilidade." },
      { id: "support", title: "Bloco de liderança", duration: "45m-1h", description: "Liderança, serviço, clareza e direção serena." },
      { id: "review", title: "Revisão de propósito", duration: "20m-30m", description: "Registre aprendizados, ações e a próxima direção." },
    ],
    taskTemplates: [
      { id: 1, title: "Revisar a estrutura da rotina devocional", category: "A", done: false },
      { id: 2, title: "Escrever 3 novos prompts devocionais", category: "B", done: false },
      { id: 3, title: "Analisar a fluidez e clareza das Escrituras", category: "A", done: true },
    ],
    weeklyObjective: "Avançar no app devocional e transformar estudo em obediência diária",
    dailyGoal: "Fortalecer a rotina devocional e manter o coração alinhado",
    savedWeeklyObjective: "Avançar no app devocional e transformar estudo em obediência diária",
    savedDailyGoal: "Fortalecer a rotina devocional e manter o coração alinhado",
    review: { learned: "", applied: "", result: "", next: "" },
    ui: {
      osName: "OS Devocional",
      productName: "Homens de Propósito",
      productSubtitle: "Sistema de vida para fé, disciplina e liderança.",
      headerSubtitle: "Sistema operacional devocional",
      dashboardTitle: "Painel Homens de Propósito",
      dashboardSubtitle: "Visão geral e direção",
      mainFocusBadge: "Foco principal",
      devotionalBadge: "Vida Devocional",
      exportButton: "Exportar rotina",
      dailyCompletion: "Conclusão do dia",
      priorityA: "Prioridade A",
      activePaths: "Áreas ativas",
      weeklyCadence: "Cadência semanal",
      activePathsHelper: "Áreas de formação",
      weeklyCadenceHelper: "Semana estruturada por tema",
      weeklyDirectionTitle: "Direção semanal",
      weeklyDirectionDesc: "Defina o objetivo central e a meta diária para reduzir distrações.",
      currentSprint: "Sprint atual",
      weeklyObjectiveLabel: "Objetivo da semana",
      dailyGoalLabel: "Meta principal do dia",
      oneMainGoal: "1 meta principal",
      threeCriticalTasks: "3 tarefas críticas",
      oneConcreteAction: "1 ação concreta",
      executiveSummaryTitle: "Resumo executivo",
      executiveSummaryDesc: "Leitura rápida da direção do dia.",
      currentFocus: "Foco atual",
      executionMode: "Modo de execução",
      practicalDecision: "Decisão prática",
      dailyBlocksTitle: "Blocos diários",
      dailyBlocksDesc: "Rotina desenhada para Escritura com aplicação imediata.",
      weeklyThemesTitle: "Temas da semana",
      weeklyThemesDesc: "Sete dias de temas focados alinhados ao objetivo central.",
      pathsTitle: "Percursos",
      pathsDesc: "Formação e progresso",
      reviewTitle: "Revisão",
      reviewDesc: "Aprendizados e alinhamento",
      settingsTitle: "Configurações",
      settingsDesc: "Alarmes e preferências",
      categoryATitle: "Tarefas críticas do dia",
      categoryADesc: "Priorize o que molda caráter e protege seu foco.",
      addTaskLabel: "Adicionar tarefa",
      filterLabel: "Filtro",
      reviewPromptTitle: "Revisão semanal",
      reviewPromptDesc: "Escreva o que aprendeu, aplicou e levará adiante.",
      reviewQ1: "O que aprendi hoje?",
      reviewQ2: "O que apliquei hoje?",
      reviewQ3: "Que resultado apareceu?",
      reviewQ4: "Qual é a próxima ação objetiva?",
      scoreLabel: "Como fui hoje?",
      wisdomNote1: "Estudo sem aplicação não conta",
      wisdomNote1Body: "Cada sessão deve terminar com uma ação clara ou um passo de obediência.",
      wisdomNote2: "Priorize pelo impacto",
      wisdomNote2Body: "As tarefas que constroem o futuro do homem precisam vir antes do apoio.",
      wisdomNote3: "Proteja o ritmo",
      wisdomNote3Body: "Consistência importa mais do que intensidade.",
      weekTab: "Semana",
      dashboardTab: "Painel",
      reviewTab: "Revisão",
      topTab: "Topo",
      pathsTab: "Percursos",
      save: "Salvar",
      cancel: "Cancelar",
      edit: "Editar",
      close: "Fechar",
      completed: "Concluído",
      pending: "Pendente",
      languageToggle: "EN",
      currency: "BRL",
      currencyLabel: "Moeda",
      completed: "Concluído",
      pending: "Pendente",
    },
  },
};

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

function buildInitialWeeklySpirit(themes = DAY_ORDER) {
  return themes.reduce((acc, item) => {
    acc[item] = false;
    return acc;
  }, {});
}

function buildInitialWeeklyKpiNotes(themes = DAY_ORDER) {
  return themes.reduce((acc, item) => {
    acc[item] = "";
    return acc;
  }, {});
}

function buildInitialTasks(blocks, taskTemplates) {
  return [
    ...taskTemplates,
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
                    <Button onClick={() => onSaveEdit(course.id)}>{copy.save}</Button>
                    <Button variant="outline" onClick={onCancelEdit}>
                      {copy.cancel}
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
                  {copy.edit}
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
  const [language, setLanguage] = useState(() => {
    if (typeof window === "undefined") return "pt";
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return stored === "en" || stored === "pt" ? stored : "pt";
  });
  const content = CONTENT_BY_LANGUAGE[language];
  const langKey = (suffix) => `routine.${language}.${suffix}`;
  const currency = CURRENCY_BY_LANGUAGE[language];
  const copy = content.ui;

  const [weeklyThemes, setWeeklyThemes] = useState(() => getFromStorage(langKey("weeklyThemes"), content.weeklyThemes));
  const [weeklySpirit, setWeeklySpirit] = useState(() => getFromStorage(langKey("weeklySpirit"), buildInitialWeeklySpirit(content.weeklyThemes.map((item) => item.day))));
  const [weeklyKpiNotes, setWeeklyKpiNotes] = useState(() => getFromStorage(langKey("weeklyKpiNotes"), buildInitialWeeklyKpiNotes(content.weeklyThemes.map((item) => item.day))));
  const [dailyBlocks, setDailyBlocks] = useState(() => getFromStorage(langKey("dailyBlocks"), content.dailyBlocks));
  const [courses, setCourses] = useState(() => getFromStorage(langKey("courses"), content.courses));

  const [editingCourseId, setEditingCourseId] = useState(null);
  const [courseNameDraft, setCourseNameDraft] = useState("");
  const [tasks, setTasks] = useState(() => buildInitialTasks(getFromStorage(langKey("dailyBlocks"), content.dailyBlocks), content.taskTemplates));
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
  const [dailyGoal, setDailyGoal] = useState(content.dailyGoal);
  const [weeklyObjective, setWeeklyObjective] = useState(content.weeklyObjective);
  const [savedDailyGoal, setSavedDailyGoal] = useState(content.savedDailyGoal);
  const [savedWeeklyObjective, setSavedWeeklyObjective] = useState(content.savedWeeklyObjective);
  const [isDirectionEditing, setIsDirectionEditing] = useState(false);
  const [editingWeekDay, setEditingWeekDay] = useState(null);
  const [weeklyThemeDraft, setWeeklyThemeDraft] = useState({ focus: ["", "", ""] });
  const [review, setReview] = useState(content.review);

  useEffect(() => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language]);

  useEffect(() => {
    setWeeklyThemes(getFromStorage(langKey("weeklyThemes"), content.weeklyThemes));
    setWeeklySpirit(getFromStorage(langKey("weeklySpirit"), buildInitialWeeklySpirit(content.weeklyThemes.map((item) => item.day))));
    setWeeklyKpiNotes(getFromStorage(langKey("weeklyKpiNotes"), buildInitialWeeklyKpiNotes(content.weeklyThemes.map((item) => item.day))));
    setDailyBlocks(getFromStorage(langKey("dailyBlocks"), content.dailyBlocks));
    setCourses(getFromStorage(langKey("courses"), content.courses));
    setTasks(getFromStorage(langKey("tasks"), buildInitialTasks(content.dailyBlocks, content.taskTemplates)));
    setDailyGoal(getFromStorage(langKey("dailyGoal"), content.dailyGoal));
    setWeeklyObjective(getFromStorage(langKey("weeklyObjective"), content.weeklyObjective));
    setSavedDailyGoal(getFromStorage(langKey("savedDailyGoal"), content.savedDailyGoal));
    setSavedWeeklyObjective(getFromStorage(langKey("savedWeeklyObjective"), content.savedWeeklyObjective));
    setReview(getFromStorage(langKey("review"), content.review));
    setActiveTab("dashboard");
  }, [language]);

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
    window.localStorage.setItem(langKey("dailyBlocks"), JSON.stringify(dailyBlocks));
  }, [dailyBlocks]);

  useEffect(() => {
    window.localStorage.setItem(langKey("weeklyThemes"), JSON.stringify(weeklyThemes));
  }, [weeklyThemes]);

  useEffect(() => {
    window.localStorage.setItem(langKey("weeklySpirit"), JSON.stringify(weeklySpirit));
  }, [weeklySpirit]);

  useEffect(() => {
    window.localStorage.setItem(langKey("weeklyKpiNotes"), JSON.stringify(weeklyKpiNotes));
  }, [weeklyKpiNotes]);

  useEffect(() => {
    window.localStorage.setItem(langKey("courses"), JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    window.localStorage.setItem(ALARM_SETTINGS_STORAGE_KEY, alarmProfile);
  }, [alarmProfile]);

  useEffect(() => {
    window.localStorage.setItem(langKey("dailyGoal"), dailyGoal);
    window.localStorage.setItem(langKey("weeklyObjective"), weeklyObjective);
    window.localStorage.setItem(langKey("savedDailyGoal"), savedDailyGoal);
    window.localStorage.setItem(langKey("savedWeeklyObjective"), savedWeeklyObjective);
    window.localStorage.setItem(langKey("review"), JSON.stringify(review));
    window.localStorage.setItem(langKey("tasks"), JSON.stringify(tasks));
  }, [dailyGoal, weeklyObjective, savedDailyGoal, savedWeeklyObjective, review, tasks, language]);

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
    { value: "dashboard", label: copy.dashboardTab, desc: copy.dashboardSubtitle },
    { value: "week", label: copy.weekTab, desc: copy.weeklyCadenceHelper },
    { value: "courses", label: copy.pathsTab, desc: copy.pathsDesc },
    { value: "review", label: copy.reviewTab, desc: copy.reviewDesc },
    { value: "settings", label: copy.settingsTitle, desc: copy.settingsDesc },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="hidden border-r border-slate-200 bg-slate-950 text-slate-100 lg:flex lg:flex-col">
          <div className="border-b border-slate-800 px-6 py-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{copy.osName}</p>
                  <h1 className="mt-2 text-xl font-semibold">{copy.productName}</h1>
                  <p className="mt-2 text-sm text-slate-400">{copy.productSubtitle}</p>
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
              <p className="mt-2 text-sm text-slate-200">Scripture -&gt; reflection -&gt; application -&gt; discipline -&gt; leadership</p>
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
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{copy.osName}</p>
                  <h1 className="mt-2 text-xl font-semibold">{copy.productName}</h1>
                  <p className="mt-2 text-sm text-slate-400">{copy.productSubtitle}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-2xl border border-slate-700 px-3 py-2 text-sm text-slate-200"
                >
                  {copy.close}
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
                  <p className="text-sm font-medium text-slate-500">{copy.headerSubtitle}</p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">{copy.dashboardTitle}</h2>
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
                <Badge>Devotional Life</Badge>
                <Button variant="outline">Export routine</Button>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-7xl space-y-6 px-4 py-5 md:px-8 md:py-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard label={copy.dailyCompletion} value={`${completion}%`} helper={`${completedTasks} / ${tasks.length}`} />
              <MetricCard label={copy.priorityA} value={`${taskA}`} helper={language === "pt" ? "Itens que moldam o homem agora" : "Items that shape the man now"} />
              <MetricCard label={copy.activePaths} value={`${principalCourses.length}`} helper={copy.activePathsHelper} />
              <MetricCard label={copy.weeklyCadence} value="7 blocks" helper={copy.weeklyCadenceHelper} />
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
              <Card>
                <CardHeader>
                  <SectionTitle
                    title={copy.weeklyDirectionTitle}
                    description={copy.weeklyDirectionDesc}
                    action={
                      <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
                        <Badge variant="secondary">{copy.currentSprint}</Badge>
                        {isDirectionEditing ? (
                          <Button onClick={saveDirection}>{copy.save}</Button>
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
                        <p className="mb-2 text-sm font-medium text-slate-600">{copy.weeklyObjectiveLabel}</p>
                        <Textarea value={weeklyObjective} onChange={(e) => setWeeklyObjective(e.target.value)} rows={4} />
                      </div>
                      <div>
                        <p className="mb-2 text-sm font-medium text-slate-600">{copy.dailyGoalLabel}</p>
                        <Input value={dailyGoal} onChange={(e) => setDailyGoal(e.target.value)} />
                      </div>
                    </>
                  ) : (
                    <div className="grid gap-4 lg:grid-cols-2">
                      <div className="rounded-[2rem] border border-amber-200 bg-gradient-to-br from-amber-200 via-yellow-100 to-amber-50 p-5 shadow-[0_18px_40px_rgba(146,64,14,0.18)] sm:rotate-[-1.5deg] sm:p-6">
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-800/70">{copy.weeklyObjectiveLabel}</p>
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
                    <Badge>{copy.oneMainGoal}</Badge>
                    <Badge variant="secondary">{copy.threeCriticalTasks}</Badge>
                    <Badge variant="secondary">{copy.oneConcreteAction}</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <SectionTitle title={copy.executiveSummaryTitle} description={copy.executiveSummaryDesc} />
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">{copy.currentFocus}</p>
                    <p className="mt-2 font-semibold">{language === "pt" ? "Devocional + Sabedoria + Reflexão + Disciplina" : "Devotional + Wisdom + Reflection + Discipline"}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">{copy.executionMode}</p>
                    <p className="mt-2 font-semibold">{language === "pt" ? "Escritura -&gt; reflexão -&gt; aplicação -&gt; disciplina" : "Scripture -&gt; reflection -&gt; application -&gt; discipline"}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Practical decision</p>
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
                  { value: "dashboard", label: copy.dashboardTab },
                  { value: "week", label: copy.weekTab },
                  { value: "courses", label: copy.pathsTab },
                  { value: "review", label: copy.reviewTab },
                  { value: "__top__", label: copy.topTab },
                ]}
              />
            </div>

            {activeTab === "dashboard" && (
              <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
                <Card>
                  <CardHeader>
                    <SectionTitle title="{copy.categoryATitle}" description="Prioritize what creates real results and protects your focus." />
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
                            {task.done ? <Badge variant="success">{copy.completed}</Badge> : <Badge variant="secondary">{copy.pending}</Badge>}
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
                    <SectionTitle title="{copy.dailyBlocksTitle}" description="Routine designed for scripture with immediate application." />
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
                              <Button onClick={() => saveBlockEdit(block.id)}>{copy.save}</Button>
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
                            <Button onClick={() => saveWeeklyThemeEdit(item.day)}>{copy.save}</Button>
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
                      <p className="mb-2 text-sm font-medium text-slate-600">{copy.reviewQ1}</p>
                      <Textarea value={review.learned} onChange={(e) => setReview({ ...review, learned: e.target.value })} rows={4} />
                    </div>
                    <div>
                      <p className="mb-2 text-sm font-medium text-slate-600">{copy.reviewQ2}</p>
                      <Textarea value={review.applied} onChange={(e) => setReview({ ...review, applied: e.target.value })} rows={4} />
                    </div>
                    <div>
                      <p className="mb-2 text-sm font-medium text-slate-600">{copy.reviewQ3}</p>
                      <Textarea value={review.result} onChange={(e) => setReview({ ...review, result: e.target.value })} rows={4} />
                    </div>
                    <div>
                      <p className="mb-2 text-sm font-medium text-slate-600">{copy.reviewQ4}</p>
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
                        <p className="font-medium text-slate-900">{copy.wisdomNote1}</p>
                        <p className="mt-1">{copy.wisdomNote1Body}</p>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="font-medium text-slate-900">{copy.wisdomNote2}</p>
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

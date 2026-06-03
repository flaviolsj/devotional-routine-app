import React, { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "devotional-routine-app.v2";
const LANGUAGE_KEY = "devotional-routine-app.language";

const COPY = {
  en: {
    brand: "Men of Purpose",
    subtitle: "Devotional system for faith, discipline, and leadership.",
    badge: "Devotional Life",
    mainFocus: "Main focus",
    currencyLabel: "Currency",
    exportLabel: "Export routine",
    languageToggle: "PT",
    dashboardTitle: "Men of Purpose Dashboard",
    dashboardSubtitle: "Overview and direction",
    dailyCompletion: "Daily completion",
    priorityA: "Priority A",
    activePaths: "Active paths",
    weeklyCadence: "Weekly cadence",
    activePathsHelper: "Areas of formation",
    weeklyCadenceHelper: "Week structured by theme",
    weeklyDirectionTitle: "Weekly direction",
    weeklyDirectionDesc: "Define the central objective and the daily goal to reduce distraction.",
    currentSprint: "Current sprint",
    weeklyObjectiveLabel: "Weekly objective",
    dailyGoalLabel: "Main goal of the day",
    oneMainGoal: "1 main goal",
    threeCriticalTasks: "3 critical tasks",
    oneConcreteAction: "1 concrete action",
    executiveSummaryTitle: "Executive summary",
    executiveSummaryDesc: "Quick read of the day's direction.",
    currentFocus: "Current focus",
    executionMode: "Execution mode",
    practicalDecision: "Practical decision",
    dailyBlocksTitle: "Daily blocks",
    dailyBlocksDesc: "Routine designed for Scripture with immediate application.",
    weeklyThemesTitle: "Weekly themes",
    weeklyThemesDesc: "Seven days of focused themes aligned to the main objective.",
    pathsTitle: "Paths",
    pathsDesc: "Formation and progress",
    reviewTitle: "Review",
    reviewDesc: "Learnings and alignment",
    settingsTitle: "Settings",
    settingsDesc: "Preferences and storage",
    categoryATitle: "Critical tasks of the day",
    categoryADesc: "Prioritize what shapes character and protects your focus.",
    addTaskPlaceholder: "Add critical task",
    addTaskButton: "Add",
    filterLabel: "Filter",
    all: "All",
    reviewPromptTitle: "Weekly review",
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
    save: "Save",
    edit: "Edit",
    cancel: "Cancel",
    close: "Close",
    completed: "Completed",
    pending: "Pending",
    currentSprintTag: "Current sprint",
    home: "Home",
    weekTab: "Week",
    pathsTab: "Paths",
    reviewTab: "Review",
    settingsTab: "Settings",
    topTab: "Top",
    currency: "USD",
    dayGoal: "Day goal",
    weeklyObjective: "Weekly objective",
    addGoalHint: "One clear next action",
    sectionHint: "Focus and clarity",
    blocksHint: "Five daily blocks",
  },
  pt: {
    brand: "Homens de Propósito",
    subtitle: "Sistema devocional para fé, disciplina e liderança.",
    badge: "Vida Devocional",
    mainFocus: "Foco principal",
    currencyLabel: "Moeda",
    exportLabel: "Exportar rotina",
    languageToggle: "EN",
    dashboardTitle: "Painel Homens de Propósito",
    dashboardSubtitle: "Visão geral e direção",
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
    settingsDesc: "Preferências e armazenamento",
    categoryATitle: "Tarefas críticas do dia",
    categoryADesc: "Priorize o que molda caráter e protege seu foco.",
    addTaskPlaceholder: "Adicionar tarefa crítica",
    addTaskButton: "Adicionar",
    filterLabel: "Filtro",
    all: "Todas",
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
    save: "Salvar",
    edit: "Editar",
    cancel: "Cancelar",
    close: "Fechar",
    completed: "Concluído",
    pending: "Pendente",
    currentSprintTag: "Sprint atual",
    home: "Início",
    weekTab: "Semana",
    pathsTab: "Percursos",
    reviewTab: "Revisão",
    settingsTab: "Configurações",
    topTab: "Topo",
    currency: "BRL",
    dayGoal: "Meta do dia",
    weeklyObjective: "Objetivo semanal",
    addGoalHint: "Uma próxima ação clara",
    sectionHint: "Foco e clareza",
    blocksHint: "Cinco blocos diários",
  },
};

const DEFAULT_THEMES = {
  en: [
    { day: "Monday", theme: "Devotional", focus: ["Scripture reading", "Prayer", "Spiritual focus"] },
    { day: "Tuesday", theme: "Wisdom", focus: ["Proverbs", "Discernment", "Sound judgment"] },
    { day: "Wednesday", theme: "Reflection", focus: ["Inner review", "Stillness", "Personal alignment"] },
    { day: "Thursday", theme: "Practical Application", focus: ["Obedience", "Action steps", "Daily implementation"] },
    { day: "Friday", theme: "Male Discipline", focus: ["Self-control", "Consistency", "Responsibility"] },
    { day: "Saturday", theme: "Leadership", focus: ["Vision", "Service", "Decision making"] },
    { day: "Sunday", theme: "Purpose", focus: ["Calling", "Direction", "Weekly alignment"] },
  ],
  pt: [
    { day: "Monday", theme: "Devocional", focus: ["Leitura bíblica", "Oração", "Foco espiritual"] },
    { day: "Tuesday", theme: "Sabedoria", focus: ["Provérbios", "Discernimento", "Bom julgamento"] },
    { day: "Wednesday", theme: "Reflexão", focus: ["Revisão interior", "Silêncio", "Alinhamento pessoal"] },
    { day: "Thursday", theme: "Aplicação prática", focus: ["Obediência", "Passos de ação", "Implementação diária"] },
    { day: "Friday", theme: "Disciplina masculina", focus: ["Autocontrole", "Consistência", "Responsabilidade"] },
    { day: "Saturday", theme: "Liderança", focus: ["Visão", "Serviço", "Tomada de decisão"] },
    { day: "Sunday", theme: "Propósito", focus: ["Chamado", "Direção", "Alinhamento da semana"] },
  ],
};

const DEFAULT_BLOCKS = {
  en: [
    { id: "devotional", title: "Devotional Block", duration: "2h-3h", description: "Guided time for Scripture, prayer, and clear obedience." },
    { id: "application", title: "Practical Application", duration: "1h30m-2h", description: "Apply the message to real life: decisions, habits, and conduct." },
    { id: "discipline", title: "Male Discipline", duration: "1h30m-2h", description: "Organization, restraint, consistency, and responsibility." },
    { id: "leadership", title: "Leadership Block", duration: "45m-1h", description: "Leadership, service, clarity, and calm direction." },
    { id: "review", title: "Purpose Review", duration: "20m-30m", description: "Record insights, actions, and next direction." },
  ],
  pt: [
    { id: "devotional", title: "Bloco devocional", duration: "2h-3h", description: "Tempo guiado para Escritura, oração e obediência clara." },
    { id: "application", title: "Aplicação prática", duration: "1h30m-2h", description: "Aplique a mensagem na vida real: decisões, hábitos e conduta." },
    { id: "discipline", title: "Disciplina masculina", duration: "1h30m-2h", description: "Organização, contenção, consistência e responsabilidade." },
    { id: "leadership", title: "Bloco de liderança", duration: "45m-1h", description: "Liderança, serviço, clareza e direção serena." },
    { id: "review", title: "Revisão de propósito", duration: "20m-30m", description: "Registre aprendizados, ações e a próxima direção." },
  ],
};

const DEFAULT_COURSES = {
  en: [
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
  pt: [
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
};

const DEFAULT_TASKS = {
  en: [
    { id: 1, title: "Review devotional routine structure", category: "A", done: false },
    { id: 2, title: "Write 3 new devotional prompts", category: "B", done: false },
    { id: 3, title: "Analyze scripture flow and clarity", category: "A", done: true },
  ],
  pt: [
    { id: 1, title: "Revisar a estrutura da rotina devocional", category: "A", done: false },
    { id: 2, title: "Escrever 3 novos prompts devocionais", category: "B", done: false },
    { id: 3, title: "Analisar a fluidez e clareza das Escrituras", category: "A", done: true },
  ],
};

const DEFAULT_OBJECTIVES = {
  en: {
    weekly: "Advance the devotional app and turn study into daily obedience",
    day: "Strengthen the devotional routine and keep the heart aligned",
  },
  pt: {
    weekly: "Avançar no app devocional e transformar estudo em obediência diária",
    day: "Fortalecer a rotina devocional e manter o coração alinhado",
  },
};

const DEFAULT_REVIEW = { learned: "", applied: "", result: "", next: "" };

function loadState() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveState(state) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function clamp(n) {
  return Math.max(0, Math.min(100, n));
}

function completion(tasks) {
  if (!tasks.length) return 0;
  return Math.round((tasks.filter((t) => t.done).length / tasks.length) * 100);
}

function Badge({ children, variant = "default" }) {
  const styles = {
    default: "bg-slate-900 text-white",
    secondary: "bg-slate-100 text-slate-700",
    success: "bg-emerald-100 text-emerald-700",
  };
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${styles[variant]}`}>{children}</span>;
}

function Card({ children, className = "" }) {
  return <div className={`rounded-3xl border border-slate-200 bg-white shadow-sm ${className}`}>{children}</div>;
}

function CardHeader({ children }) {
  return <div className="p-5 pb-3">{children}</div>;
}

function CardContent({ children, className = "" }) {
  return <div className={`p-5 pt-0 ${className}`}>{children}</div>;
}

function CardTitle({ children }) {
  return <h3 className="text-lg font-semibold text-slate-900">{children}</h3>;
}

function CardDescription({ children, className = "" }) {
  return <p className={`text-sm text-slate-500 ${className}`}>{children}</p>;
}

function Input({ className = "", ...props }) {
  return <input {...props} className={`w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500 ${className}`} />;
}

function Textarea({ className = "", ...props }) {
  return <textarea {...props} className={`w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500 ${className}`} />;
}

function Button({ children, variant = "primary", className = "", ...props }) {
  const styles = {
    primary: "bg-slate-900 text-white hover:bg-slate-800",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
    outline: "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50",
  };
  return (
    <button {...props} className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${styles[variant]} ${className}`}>
      {children}
    </button>
  );
}

function MetricCard({ label, value, helper }) {
  return (
    <Card>
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
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription className="mt-1">{description}</CardDescription> : null}
      </div>
      {action}
    </div>
  );
}

export default function App() {
  const [language, setLanguage] = useState(() => {
    if (typeof window === "undefined") return "pt";
    const stored = window.localStorage.getItem(LANGUAGE_KEY);
    return stored === "en" || stored === "pt" ? stored : "pt";
  });

  const copy = COPY[language];
  const currency = copy.currency;
  const themes = DEFAULT_THEMES[language];
  const blocks = DEFAULT_BLOCKS[language];
  const coursesDefaults = DEFAULT_COURSES[language];
  const tasksDefaults = DEFAULT_TASKS[language];
  const objectiveDefaults = DEFAULT_OBJECTIVES[language];

  const [state, setState] = useState(() => loadState() ?? {});
  const [activeTab, setActiveTab] = useState("dashboard");
  const [editingDirection, setEditingDirection] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [editingBlockId, setEditingBlockId] = useState(null);
  const [editingThemeDay, setEditingThemeDay] = useState(null);
  const [courseDraft, setCourseDraft] = useState("");
  const [blockDraft, setBlockDraft] = useState({ title: "", duration: "", description: "" });
  const [themeDraft, setThemeDraft] = useState(["", "", ""]);
  const [newTask, setNewTask] = useState("");
  const [taskCategory, setTaskCategory] = useState("A");
  const [taskFilter, setTaskFilter] = useState("ALL");

  const weeklyThemes = state[`${language}.themes`] ?? themes;
  const dailyBlocks = state[`${language}.blocks`] ?? blocks;
  const courses = state[`${language}.courses`] ?? coursesDefaults;
  const tasks = state[`${language}.tasks`] ?? tasksDefaults;
  const weeklyObjective = state[`${language}.weeklyObjective`] ?? objectiveDefaults.weekly;
  const dailyGoal = state[`${language}.dailyGoal`] ?? objectiveDefaults.day;
  const review = state[`${language}.review`] ?? DEFAULT_REVIEW;

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(LANGUAGE_KEY, language);
    setState((prev) => {
      const next = { ...prev };
      if (!next[`${language}.themes`]) next[`${language}.themes`] = themes;
      if (!next[`${language}.blocks`]) next[`${language}.blocks`] = blocks;
      if (!next[`${language}.courses`]) next[`${language}.courses`] = coursesDefaults;
      if (!next[`${language}.tasks`]) next[`${language}.tasks`] = tasksDefaults;
      if (!next[`${language}.weeklyObjective`]) next[`${language}.weeklyObjective`] = objectiveDefaults.weekly;
      if (!next[`${language}.dailyGoal`]) next[`${language}.dailyGoal`] = objectiveDefaults.day;
      if (!next[`${language}.review`]) next[`${language}.review`] = DEFAULT_REVIEW;
      return next;
    });
    setActiveTab("dashboard");
  }, [language]);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const totalCompletion = useMemo(() => completion(tasks), [tasks]);
  const completedTasks = tasks.filter((t) => t.done).length;
  const priorityA = tasks.filter((t) => t.category === "A").length;

  const updateStateList = (key, updater) => {
    setState((prev) => {
      const current = prev[key] ?? [];
      return { ...prev, [key]: updater(current) };
    });
  };

  const updateStateValue = (key, value) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const langKey = (suffix) => `${language}.${suffix}`;

  const filteredTasks = tasks.filter((task) => taskFilter === "ALL" || task.category === taskFilter);

  const reviewCallout = [review.learned, review.applied, review.result, review.next].filter(Boolean).slice(0, 2).join(" ") ||
    (language === "pt"
      ? "Seu dia já gerou material valioso. Agora consolide com calma e registre com clareza."
      : "Your day already produced valuable material. Now consolidate it calmly and record it clearly.");

  const navigationItems = [
    { value: "dashboard", label: copy.home, desc: copy.dashboardSubtitle },
    { value: "week", label: copy.weekTab, desc: copy.weeklyCadenceHelper },
    { value: "paths", label: copy.pathsTab, desc: copy.pathsDesc },
    { value: "review", label: copy.reviewTab, desc: copy.reviewDesc },
    { value: "settings", label: copy.settingsTab, desc: copy.settingsDesc },
  ];

  const saveDirection = () => {
    updateStateValue(langKey("weeklyObjective"), weeklyObjective.trim() || objectiveDefaults.weekly);
    updateStateValue(langKey("dailyGoal"), dailyGoal.trim() || objectiveDefaults.day);
    setEditingDirection(false);
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    updateStateList(langKey("tasks"), (list) => [{ id: Date.now(), title: newTask.trim(), category: taskCategory, done: false }, ...list]);
    setNewTask("");
  };

  const toggleTask = (id) => {
    updateStateList(langKey("tasks"), (list) => list.map((task) => (task.id === id ? { ...task, done: !task.done } : task)));
  };

  const deleteTask = (id) => {
    updateStateList(langKey("tasks"), (list) => list.filter((task) => task.id !== id));
  };

  const updateCourseProgress = (id, delta) => {
    updateStateList(langKey("courses"), (list) => list.map((course) => (course.id === id ? { ...course, progress: clamp(course.progress + delta) } : course)));
  };

  const startCourseEdit = (course) => {
    setEditingCourseId(course.id);
    setCourseDraft(course.name);
  };

  const saveCourseEdit = (id) => {
    updateStateList(langKey("courses"), (list) => list.map((course) => (course.id === id ? { ...course, name: courseDraft.trim() || (language === "pt" ? "Curso" : "Course") } : course)));
    setEditingCourseId(null);
    setCourseDraft("");
  };

  const startBlockEdit = (block) => {
    setEditingBlockId(block.id);
    setBlockDraft({ title: block.title, duration: block.duration, description: block.description });
  };

  const saveBlockEdit = (blockId) => {
    updateStateList(langKey("blocks"), (list) =>
      list.map((block) => (block.id === blockId ? {
        ...block,
        title: blockDraft.title.trim() || block.title,
        duration: blockDraft.duration.trim() || block.duration,
        description: blockDraft.description.trim() || block.description,
      } : block))
    );
    setEditingBlockId(null);
    setBlockDraft({ title: "", duration: "", description: "" });
  };

  const startThemeEdit = (item) => {
    setEditingThemeDay(item.day);
    setThemeDraft([...item.focus]);
  };

  const saveThemeEdit = (day) => {
    updateStateList(langKey("themes"), (list) =>
      list.map((item) => (item.day === day ? { ...item, focus: themeDraft.map((f) => f.trim() || (language === "pt" ? "Novo foco" : "New focus")) } : item))
    );
    setEditingThemeDay(null);
    setThemeDraft(["", "", ""]);
  };

  const saveReviewField = (field, value) => updateStateValue(langKey("review"), { ...review, [field]: value });

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="hidden border-r border-slate-200 bg-slate-950 text-slate-100 lg:flex lg:flex-col">
          <div className="border-b border-slate-800 px-6 py-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{copy.brand}</p>
            <h1 className="mt-2 text-xl font-semibold">{copy.brand}</h1>
            <p className="mt-2 text-sm text-slate-400">{copy.subtitle}</p>
          </div>

          <nav className="flex-1 space-y-1 px-4 py-6">
            {navigationItems.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setActiveTab(item.value)}
                className={`w-full rounded-2xl px-4 py-3 text-left transition ${activeTab === item.value ? "bg-white/10" : "hover:bg-white/5"}`}
              >
                <p className="font-medium text-slate-100">{item.label}</p>
                <p className="mt-1 text-xs text-slate-400">{item.desc}</p>
              </button>
            ))}
          </nav>

          <div className="border-t border-slate-800 px-4 py-4">
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">{copy.sectionHint}</p>
              <p className="mt-2 text-sm text-slate-200">{language === "pt" ? "Escritura → reflexão → aplicação → disciplina → liderança" : "Scripture → reflection → application → discipline → leadership"}</p>
            </div>
          </div>
        </aside>

        <main className="min-w-0">
          <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 md:px-8 md:py-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-500">{copy.subtitle}</p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">{copy.dashboardTitle}</h2>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 md:gap-3">
                <Badge variant="secondary">{copy.mainFocus}</Badge>
                <Badge>{copy.badge}</Badge>
                <Badge variant="secondary">{copy.currencyLabel}: {currency}</Badge>
                <Button variant="outline" onClick={() => setLanguage(language === "pt" ? "en" : "pt")}>{copy.languageToggle}</Button>
                <Button variant="outline">{copy.exportLabel}</Button>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-7xl space-y-6 px-4 py-5 md:px-8 md:py-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard label={copy.dailyCompletion} value={`${totalCompletion}%`} helper={`${completedTasks} / ${tasks.length}`} />
              <MetricCard label={copy.priorityA} value={`${priorityA}`} helper={language === "pt" ? "Itens que moldam o homem agora" : "Items that shape the man now"} />
              <MetricCard label={copy.activePaths} value={`${courses.filter((c) => c.type === "principal").length}`} helper={copy.activePathsHelper} />
              <MetricCard label={copy.weeklyCadence} value="7" helper={copy.weeklyCadenceHelper} />
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
              <Card>
                <CardHeader>
                  <SectionTitle
                    title={copy.weeklyDirectionTitle}
                    description={copy.weeklyDirectionDesc}
                    action={
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary">{copy.currentSprintTag}</Badge>
                        {editingDirection ? (
                          <Button onClick={saveDirection}>{copy.save}</Button>
                        ) : (
                          <Button variant="outline" onClick={() => setEditingDirection(true)}>{copy.edit}</Button>
                        )}
                      </div>
                    }
                  />
                </CardHeader>
                <CardContent className="space-y-4">
                  {editingDirection ? (
                    <>
                      <div>
                        <p className="mb-2 text-sm font-medium text-slate-600">{copy.weeklyObjectiveLabel}</p>
                        <Textarea rows={4} value={weeklyObjective} onChange={(e) => updateStateValue(langKey("weeklyObjective"), e.target.value)} />
                      </div>
                      <div>
                        <p className="mb-2 text-sm font-medium text-slate-600">{copy.dailyGoalLabel}</p>
                        <Input value={dailyGoal} onChange={(e) => updateStateValue(langKey("dailyGoal"), e.target.value)} />
                      </div>
                    </>
                  ) : (
                    <div className="grid gap-4 lg:grid-cols-2">
                      <div className="rounded-[2rem] border border-amber-200 bg-gradient-to-br from-amber-200 via-yellow-100 to-amber-50 p-5 shadow-[0_18px_40px_rgba(146,64,14,0.18)] sm:rotate-[-1.5deg] sm:p-6">
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-800/70">{copy.weeklyObjectiveLabel}</p>
                        <p className="mt-4 text-2xl leading-tight text-slate-900 md:text-4xl">{weeklyObjective}</p>
                      </div>
                      <div className="rounded-[2rem] border border-sky-200 bg-gradient-to-br from-sky-200 via-cyan-100 to-white p-5 shadow-[0_18px_40px_rgba(14,116,144,0.16)] sm:rotate-[1.2deg] sm:p-6">
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-800/70">{copy.dayGoal}</p>
                        <p className="mt-4 text-2xl leading-tight text-slate-900 md:text-4xl">{dailyGoal}</p>
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
                    <p className="mt-2 font-semibold">{language === "pt" ? "Escritura → reflexão → aplicação → disciplina" : "Scripture → reflection → application → discipline"}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">{copy.practicalDecision}</p>
                    <p className="mt-2 text-sm text-slate-700">{language === "pt" ? "Priorize Categoria A antes de qualquer apoio." : "Prioritize Category A before any support task."}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
              <Card>
                <CardHeader>
                  <SectionTitle title={copy.categoryATitle} description={copy.categoryADesc} />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3 md:grid-cols-[1fr_170px_170px_120px]">
                    <Input placeholder={copy.addTaskPlaceholder} value={newTask} onChange={(e) => setNewTask(e.target.value)} />
                    <select value={taskCategory} onChange={(e) => setTaskCategory(e.target.value)} className="rounded-2xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500">
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                    </select>
                    <select value={taskFilter} onChange={(e) => setTaskFilter(e.target.value)} className="rounded-2xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500">
                      <option value="ALL">{copy.all}</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                    </select>
                    <Button onClick={addTask}>{copy.addTaskButton}</Button>
                  </div>

                  <div className="space-y-3">
                    {filteredTasks.map((task) => (
                      <div key={task.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="flex items-start gap-3">
                            <button type="button" onClick={() => toggleTask(task.id)} className={`mt-1 h-5 w-5 rounded-full border ${task.done ? "border-emerald-500 bg-emerald-500" : "border-slate-300 bg-white"}`} aria-label="toggle task" />
                            <div>
                              <p className={`font-medium ${task.done ? "text-slate-400 line-through" : "text-slate-900"}`}>{task.title}</p>
                              <div className="mt-2 flex flex-wrap gap-2">
                                <Badge variant="secondary">{task.category}</Badge>
                                {task.done ? <Badge variant="success">{copy.completed}</Badge> : <Badge variant="secondary">{copy.pending}</Badge>}
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" onClick={() => deleteTask(task.id)}>×</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <SectionTitle title={copy.dailyBlocksTitle} description={copy.dailyBlocksDesc} />
                </CardHeader>
                <CardContent className="space-y-3">
                  {dailyBlocks.map((block) => (
                    <div key={block.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      {editingBlockId === block.id ? (
                        <div className="space-y-3">
                          <Input value={blockDraft.title} onChange={(e) => setBlockDraft((prev) => ({ ...prev, title: e.target.value }))} />
                          <Input value={blockDraft.duration} onChange={(e) => setBlockDraft((prev) => ({ ...prev, duration: e.target.value }))} />
                          <Textarea rows={3} value={blockDraft.description} onChange={(e) => setBlockDraft((prev) => ({ ...prev, description: e.target.value }))} />
                          <div className="flex flex-wrap gap-2">
                            <Button onClick={() => saveBlockEdit(block.id)}>{copy.save}</Button>
                            <Button variant="outline" onClick={() => setEditingBlockId(null)}>{copy.cancel}</Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-medium text-slate-900">{block.title}</p>
                              <p className="text-sm text-slate-500">{block.duration}</p>
                            </div>
                            <Button variant="outline" onClick={() => startBlockEdit(block)}>{copy.edit}</Button>
                          </div>
                          <p className="text-sm text-slate-700">{block.description}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
              <Card>
                <CardHeader>
                  <SectionTitle title={copy.weeklyThemesTitle} description={copy.weeklyThemesDesc} />
                </CardHeader>
                <CardContent className="space-y-3">
                  {weeklyThemes.map((item) => (
                    <div key={item.day} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      {editingThemeDay === item.day ? (
                        <div className="space-y-3">
                          {themeDraft.map((value, index) => (
                            <Input key={`${item.day}-${index}`} value={value} onChange={(e) => setThemeDraft((prev) => prev.map((entry, idx) => (idx === index ? e.target.value : entry)))} />
                          ))}
                          <div className="flex flex-wrap gap-2">
                            <Button onClick={() => saveThemeEdit(item.day)}>{copy.save}</Button>
                            <Button variant="outline" onClick={() => setEditingThemeDay(null)}>{copy.cancel}</Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-medium text-slate-900">{item.day}</p>
                              <p className="text-sm text-slate-500">{item.theme}</p>
                            </div>
                            <Button variant="outline" onClick={() => startThemeEdit(item)}>{copy.edit}</Button>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {item.focus.map((focusItem) => (
                              <div key={focusItem} className="rounded-xl bg-white px-3 py-2 text-sm text-slate-700">{focusItem}</div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <SectionTitle title={copy.pathsTitle} description={copy.pathsDesc} />
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { title: language === "pt" ? "Foco principal" : "Main focus", type: "principal", items: courses.filter((c) => c.type === "principal") },
                    { title: language === "pt" ? "Suporte" : "Support", type: "support", items: courses.filter((c) => c.type === "support") },
                    { title: language === "pt" ? "Incubado" : "Incubated", type: "incubated", items: courses.filter((c) => c.type === "incubated") },
                  ].map((column) => (
                    <div key={column.type} className="rounded-2xl border border-slate-200 bg-white p-4">
                      <p className="font-medium text-slate-900">{column.title}</p>
                      <div className="mt-4 space-y-3">
                        {column.items.map((course) => (
                          <div key={course.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            {editingCourseId === course.id ? (
                              <div className="space-y-3">
                                <Input value={courseDraft} onChange={(e) => setCourseDraft(e.target.value)} />
                                <div className="flex flex-wrap gap-2">
                                  <Button onClick={() => saveCourseEdit(course.id)}>{copy.save}</Button>
                                  <Button variant="outline" onClick={() => setEditingCourseId(null)}>{copy.cancel}</Button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="flex items-center justify-between gap-3">
                                  <div>
                                    <p className="font-medium text-slate-900">{course.name}</p>
                                    <p className="text-sm text-slate-500">{course.progress}%</p>
                                  </div>
                                  <Button variant="outline" onClick={() => startCourseEdit(course)}>{copy.edit}</Button>
                                </div>
                                <div className="mt-3 h-2 rounded-full bg-slate-200">
                                  <div className="h-2 rounded-full bg-slate-900" style={{ width: `${clamp(course.progress)}%` }} />
                                </div>
                                <div className="mt-3 flex flex-wrap gap-2">
                                  <Button variant="outline" onClick={() => updateCourseProgress(course.id, -5)}>-5</Button>
                                  <Button onClick={() => updateCourseProgress(course.id, 5)}>+5</Button>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
              <Card>
                <CardHeader>
                  <SectionTitle title={copy.reviewPromptTitle} description={copy.reviewPromptDesc} />
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    ["learned", copy.reviewQ1],
                    ["applied", copy.reviewQ2],
                    ["result", copy.reviewQ3],
                    ["next", copy.reviewQ4],
                  ].map(([field, label]) => (
                    <div key={field}>
                      <p className="mb-2 text-sm font-medium text-slate-600">{label}</p>
                      <Textarea rows={3} value={review[field]} onChange={(e) => saveReviewField(field, e.target.value)} />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <SectionTitle title={copy.settingsTitle} description={copy.settingsDesc} />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">{copy.scoreLabel}</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">{reviewCallout}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge>{copy.currencyLabel}: {currency}</Badge>
                    <Badge variant="secondary">PT / EN</Badge>
                    <Badge variant="secondary">{copy.sectionHint}</Badge>
                    <Badge variant="secondary">{copy.blocksHint}</Badge>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-sm font-medium text-slate-900">{copy.wisdomNote1}</p>
                    <p className="mt-1 text-sm text-slate-600">{copy.wisdomNote1Body}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-sm font-medium text-slate-900">{copy.wisdomNote2}</p>
                    <p className="mt-1 text-sm text-slate-600">{copy.wisdomNote2Body}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-sm font-medium text-slate-900">{copy.wisdomNote3}</p>
                    <p className="mt-1 text-sm text-slate-600">{copy.wisdomNote3Body}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

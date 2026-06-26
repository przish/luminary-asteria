import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import * as Speech from "expo-speech";

// ─── Theme ───────────────────────────────────────────────────────────────────
const theme = {
  background: "#f4fafd",
  surface: "#f4fafd",
  surfaceContainerLowest: "#ffffff",
  surfaceContainerLow: "#eef5f7",
  surfaceContainer: "#e8eff1",
  surfaceContainerHigh: "#e2e9ec",
  primary: "#785900",
  primaryContainer: "#ffc107",
  onPrimaryContainer: "#6d5100",
  onPrimaryFixedVariant: "#5b4300",
  secondary: "#b02f00",
  tertiary: "#006972",
  tertiaryContainer: "#79d9e6",
  onTertiaryContainer: "#005f68",
  onTertiaryFixedVariant: "#004f56",
  onSurface: "#161d1f",
  onSurfaceVariant: "#4f4632",
  outlineVariant: "#d4c5ab",
  success: "#16a34a",
  successContainer: "#dcfce7",
  error: "#dc2626",
  errorContainer: "#fef2f2",
  warning: "#d97706",
  warningContainer: "#fef3c7",
};

// ─── Types ────────────────────────────────────────────────────────────────────
type AppScreen = "upload" | "pretest" | "studying" | "evaluation" | "metric-drill" | "prerequisites";
type LanguageCode = "en" | "tl" | "es";

type UploadedFile = {
  name: string; size: string; uri: string; type: string; localPath: string; uploadedAt: string;
};

type Question = {
  id: number; question: string; options: string[]; correctIndex: number; explanation: string; topic: string;
};

type MetricKey = "comprehension" | "retention" | "application" | "analysis";

type EvalMetric = {
  key: MetricKey; label: string; score: number; icon: string; color: string; description: string;
};

type PrereqTopic = {
  id: number; label: string; description: string; quizQuestion: string; quizOptions: string[];
  quizCorrectIndex: number; done: boolean; expanded?: boolean; quizAnswered?: number | null;
};

// ─── Translations & Content Dictionary ────────────────────────────────────────
const DICTIONARY = {
  en: {
    // UI Strings
    headerTitle: "Aral",
    mascotUpload: "Ready to level up? Drop your notes or PDFs here, and I'll turn them into a personalized learning journey!",
    mascotPretest: "Let's see what you already know — no pressure!",
    mascotStudy: "Take your time. Read carefully and think it through!",
    mascotEval: "Here's how you did! Tap any skill to work on it.",
    mascotDrill: "Let's focus on this skill together!",
    mascotPrereq: "These building blocks will make everything click!",
    uploadTitle: "Upload study materials",
    uploadSub: "Tap here to browse PDFs, images, or text files",
    browseFiles: "Browse Files",
    savingFile: "Saving file...",
    savingWait: "Please wait while we save your file locally",
    storage: "Storage",
    supportedTypes: "Supported Types",
    recentUploads: "Recent uploads",
    viewAll: "View all",
    studyBtn: "Study",
    questionStr: "Question",
    submitPretest: "Submit Pretest",
    pretestComplete: "Pretest Complete!",
    level: "Level",
    levelAdvanced: "Advanced",
    levelIntermediate: "Intermediate",
    levelBeginner: "Beginner",
    levelAdvDesc: "Excellent! You have strong foundational knowledge. We'll focus on deeper analysis.",
    levelIntDesc: "Good start! You know the basics. We'll help you fill in the gaps.",
    levelBegDesc: "No worries! Everyone starts somewhere. We'll guide you step by step.",
    correct: "Correct",
    missed: "Missed",
    total: "Total",
    beginStudyBtn: "Begin Study Material →",
    checkAnswer: "Check Answer",
    nextQuestion: "Next Question →",
    seeResults: "See My Results →",
    correctExclaim: "Correct!",
    notQuite: "Not quite",
    yourResults: "Your Results",
    overall: "Overall",
    questionsCorrect: "questions correct",
    keyMetrics: "Key Metrics",
    tapToImprove: "Tap to improve →",
    masterBlocks: "Master the Building Blocks",
    explorePrereq: "Explore prerequisite topics to strengthen your foundation",
    currentScore: "Current Score",
    howToImprove: "How to Improve",
    tips: [
      "Re-read the relevant sections of your study material",
      "Focus on understanding the 'why' behind each concept",
      "Complete the prerequisite building blocks below",
      "Practice with the questions you got wrong"
    ],
    interactiveChecklist: "Interactive Learning Checklist",
    skillsMastered: "skills mastered",
    listenToConcept: "Listen to Concept",
    stopAudio: "Stop Audio",
    knowledgeCheck: "Knowledge Check",
    markComplete: "Mark as Complete",
    backToResults: "Back to Results",
    navHome: "Home", navUpload: "Upload", navLessons: "Lessons", navResults: "Results", navProfile: "Profile",
    
    // Data (Mocked content)
    metrics: [
      { key: "comprehension", label: "Comprehension", score: 72, icon: "menu-book", color: theme.tertiary, description: "How well you understand the core ideas" },
      { key: "retention", label: "Retention", score: 58, icon: "psychology", color: theme.secondary, description: "How well you remember specific facts" },
      { key: "application", label: "Application", score: 65, icon: "build", color: theme.primary, description: "Using knowledge in new situations" },
      { key: "analysis", label: "Analysis", score: 80, icon: "insights", color: "#7c3aed", description: "Evaluating complex ideas" },
    ] as EvalMetric[],
    pretestQs: [
      { id: 1, question: "What is the primary purpose of photosynthesis in plants?", options: ["Absorb water", "Convert light into chemical energy", "Release CO2", "Transport nutrients"], correctIndex: 1, explanation: "Photosynthesis converts sunlight into glucose.", topic: "Biology" },
      { id: 2, question: "Which organelle is the 'powerhouse of the cell'?", options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi"], correctIndex: 2, explanation: "Mitochondria produce ATP.", topic: "Cell Biology" }
    ] as Question[],
    studyQs: [
      { id: 1, question: "According to the material, what is the main theme of Module 1?", options: ["20th century economics", "Pre-colonial Philippine society", "Spanish colonization", "Post-war efforts"], correctIndex: 1, explanation: "Module 1 focuses on pre-colonial society.", topic: "Comprehension" },
    ] as Question[],
    prereqs: {
      comprehension: { title: "Reading Comprehension", topics: [ { id: 1, label: "Identifying main ideas", description: "The main idea is the core concept the author conveys.", quizQuestion: "Where is the main idea usually found?", quizOptions: ["Middle", "First/last sentence", "Footnotes"], quizCorrectIndex: 1, done: false } ] },
      retention: { title: "Memory Strategies", topics: [ { id: 1, label: "Active recall", description: "Retrieving info from memory without looking at notes.", quizQuestion: "Which is active recall?", quizOptions: ["Rereading", "Summarizing aloud without book", "Highlighting"], quizCorrectIndex: 1, done: false } ] },
      application: { title: "Application Skills", topics: [ { id: 1, label: "Real life connection", description: "Applying theory to real-world scenarios.", quizQuestion: "What shows application?", quizOptions: ["Memorizing formula", "Using formula for grocery budget", "Writing it 10x"], quizCorrectIndex: 1, done: false } ] },
      analysis: { title: "Critical Analysis", topics: [ { id: 1, label: "Compare and contrast", description: "Comparing looks for similarities, contrasting looks for differences.", quizQuestion: "Contrasting means looking for:", quizOptions: ["Similarities", "Differences", "Dates"], quizCorrectIndex: 1, done: false } ] },
    }
  },
  tl: {
    // UI Strings
    headerTitle: "Aral",
    mascotUpload: "Handa na bang mag-level up? Ilagay ang iyong mga notes o PDF dito, at gagawin natin itong personal na aralin!",
    mascotPretest: "Tingnan natin ang alam mo na — walang pressure!",
    mascotStudy: "Take your time. Basahing mabuti at isipin ng maayos!",
    mascotEval: "Narito ang resulta mo! Pindutin ang anumang kasanayan para pag-aralan.",
    mascotDrill: "Tutukan natin ang kasanayang ito nang magkasama!",
    mascotPrereq: "Ang mga pangunahing hakbang na ito ang magpapadali sa lahat!",
    uploadTitle: "Mag-upload ng mga materyales",
    uploadSub: "Pindutin dito para pumili ng PDFs, larawan, o text files",
    browseFiles: "Maghanap ng Files",
    savingFile: "Sini-save ang file...",
    savingWait: "Mangyaring maghintay habang sini-save namin ang iyong file",
    storage: "Storage",
    supportedTypes: "Sinusuportahang Uri",
    recentUploads: "Mga Kamakailang In-upload",
    viewAll: "Tingnan lahat",
    studyBtn: "Mag-aral",
    questionStr: "Tanong",
    submitPretest: "Ipasa ang Pretest",
    pretestComplete: "Tapos na ang Pretest!",
    level: "Antas",
    levelAdvanced: "Bihasa",
    levelIntermediate: "Katamtaman",
    levelBeginner: "Nagsisimula",
    levelAdvDesc: "Magaling! Matibay ang iyong pundasyon. Magtutuon tayo sa mas malalim na pagsusuri.",
    levelIntDesc: "Magandang simula! Alam mo ang mga batayan. Punan natin ang mga kulang.",
    levelBegDesc: "Huwag mag-alala! Lahat ay nagsisimula sa ibaba. Gagabayan ka namin.",
    correct: "Tama",
    missed: "Mali",
    total: "Kabuuan",
    beginStudyBtn: "Simulan ang Pag-aaral →",
    checkAnswer: "Suriin ang Sagot",
    nextQuestion: "Susunod na Tanong →",
    seeResults: "Tingnan ang Resulta →",
    correctExclaim: "Tama!",
    notQuite: "Medyo mali",
    yourResults: "Ang Iyong Mga Resulta",
    overall: "Pangkalahatan",
    questionsCorrect: "mga tamang sagot",
    keyMetrics: "Mga Pangunahing Sukatan",
    tapToImprove: "Pindutin para pagbutihin →",
    masterBlocks: "Kabisaduhin ang mga Pundasyon",
    explorePrereq: "Tuklasin ang mga prerequisite na paksa para tumibay ang pundasyon",
    currentScore: "Kasalukuyang Puntos",
    howToImprove: "Paano Pagbutihin",
    tips: [
      "Basahing muli ang mga nauugnay na bahagi ng materyal",
      "Tumuon sa pag-unawa sa 'bakit' sa likod ng bawat konsepto",
      "Kumpletuhin ang mga pangunahing hakbang sa ibaba",
      "Mag-practice gamit ang mga tanong na namali ka"
    ],
    interactiveChecklist: "Interaktibong Checklist",
    skillsMastered: "kasanayan ang nakabisado",
    listenToConcept: "Pakinggan ang Konsepto",
    stopAudio: "Itigil ang Audio",
    knowledgeCheck: "Pagsusuri ng Kaalaman",
    markComplete: "Markahan bilang Tapos na",
    backToResults: "Bumalik sa Resulta",
    navHome: "Home", navUpload: "Upload", navLessons: "Aralin", navResults: "Resulta", navProfile: "Profile",
    
    // Data (Mocked content)
    metrics: [
      { key: "comprehension", label: "Pag-unawa", score: 72, icon: "menu-book", color: theme.tertiary, description: "Gaano mo nauunawaan ang mga pangunahing ideya" },
      { key: "retention", label: "Pagtanda", score: 58, icon: "psychology", color: theme.secondary, description: "Gaano mo natatandaan ang mga tiyak na detalye" },
      { key: "application", label: "Paggamit", score: 65, icon: "build", color: theme.primary, description: "Paggamit ng kaalaman sa bagong sitwasyon" },
      { key: "analysis", label: "Pagsusuri", score: 80, icon: "insights", color: "#7c3aed", description: "Pagsusuri sa mga kumplikadong ideya" },
    ] as EvalMetric[],
    pretestQs: [
      { id: 1, question: "Ano ang pangunahing layunin ng photosynthesis sa mga halaman?", options: ["Sipsipin ang tubig", "I-convert ang liwanag sa kemikal na enerhiya", "Maglabas ng CO2", "Magdala ng nutrients"], correctIndex: 1, explanation: "Ginagawa ng photosynthesis ang sikat ng araw na glucose.", topic: "Biyolohiya" },
      { id: 2, question: "Aling organelle ang tinatawag na 'powerhouse of the cell'?", options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi"], correctIndex: 2, explanation: "Ang Mitochondria ay gumagawa ng ATP.", topic: "Cell Biology" }
    ] as Question[],
    studyQs: [
      { id: 1, question: "Ayon sa materyal, ano ang pangunahing tema ng Modyul 1?", options: ["Ekonomiya sa ika-20 siglo", "Lipunan bago dumating ang mga Kastila", "Pananakop ng Espanya", "Pagsasaayos pagkatapos ng digmaan"], correctIndex: 1, explanation: "Ang Modyul 1 ay nakatuon sa lipunan ng Pilipinas bago ang pananakop.", topic: "Comprehension" },
    ] as Question[],
    prereqs: {
      comprehension: { title: "Batayan sa Pag-unawa", topics: [ { id: 1, label: "Pagtukoy sa pangunahing ideya", description: "Ang pangunahing ideya ay ang pinaka-mensaheng nais iparating ng may-akda.", quizQuestion: "Saan madalas makita ang pangunahing ideya?", quizOptions: ["Gitna", "Una/huling pangungusap", "Footnotes"], quizCorrectIndex: 1, done: false } ] },
      retention: { title: "Istratehiya sa Memorya", topics: [ { id: 1, label: "Aktibong pag-alaala", description: "Pagkuha ng impormasyon mula sa memorya nang hindi tumitingin sa notes.", quizQuestion: "Alin ang aktibong pag-alaala?", quizOptions: ["Pagbasa muli", "Pagbubuod nang malakas nang walang libro", "Pag-highlight"], quizCorrectIndex: 1, done: false } ] },
      application: { title: "Kasanayan sa Paggamit", topics: [ { id: 1, label: "Koneksyon sa totoong buhay", description: "Paglalapat ng teorya sa mga totoong sitwasyon.", quizQuestion: "Alin ang nagpapakita ng paggamit?", quizOptions: ["Pagsasaulo ng formula", "Paggamit ng formula sa badyet", "Pagsulat ng 10 beses"], quizCorrectIndex: 1, done: false } ] },
      analysis: { title: "Pagsusuri", topics: [ { id: 1, label: "Paghahambing at Pagtatangi", description: "Ang paghahambing ay naghahanap ng pagkakatulad, ang pagtatangi ay pagkakaiba.", quizQuestion: "Ang pagtatangi (contrasting) ay paghahanap ng:", quizOptions: ["Pagkakatulad", "Pagkakaiba", "Petsa"], quizCorrectIndex: 1, done: false } ] },
    }
  },
  es: {
    // UI Strings
    headerTitle: "Aral",
    mascotUpload: "¿Listo para subir de nivel? Deja tus apuntes o PDFs aquí y crearé tu viaje de aprendizaje.",
    mascotPretest: "Veamos qué sabes ya — ¡sin presión!",
    mascotStudy: "Tómate tu tiempo. ¡Lee cuidadosamente y piénsalo bien!",
    mascotEval: "¡Aquí tienes tus resultados! Toca cualquier habilidad para mejorarla.",
    mascotDrill: "¡Enfoquémonos juntos en esta habilidad!",
    mascotPrereq: "¡Estos conceptos básicos harán que todo tenga sentido!",
    uploadTitle: "Sube materiales de estudio",
    uploadSub: "Toca aquí para buscar PDFs, imágenes o textos",
    browseFiles: "Buscar Archivos",
    savingFile: "Guardando archivo...",
    savingWait: "Por favor espera mientras guardamos tu archivo",
    storage: "Almacenamiento",
    supportedTypes: "Tipos Soportados",
    recentUploads: "Subidas recientes",
    viewAll: "Ver todo",
    studyBtn: "Estudiar",
    questionStr: "Pregunta",
    submitPretest: "Enviar Prueba",
    pretestComplete: "¡Prueba Completada!",
    level: "Nivel",
    levelAdvanced: "Avanzado",
    levelIntermediate: "Intermedio",
    levelBeginner: "Principiante",
    levelAdvDesc: "¡Excelente! Tienes una base sólida. Nos enfocaremos en análisis profundo.",
    levelIntDesc: "¡Buen comienzo! Conoces lo básico. Te ayudaremos con el resto.",
    levelBegDesc: "¡No te preocupes! Todos empezamos desde cero. Te guiaremos paso a paso.",
    correct: "Correcto",
    missed: "Fallado",
    total: "Total",
    beginStudyBtn: "Comenzar a Estudiar →",
    checkAnswer: "Comprobar Respuesta",
    nextQuestion: "Siguiente Pregunta →",
    seeResults: "Ver Mis Resultados →",
    correctExclaim: "¡Correcto!",
    notQuite: "Casi",
    yourResults: "Tus Resultados",
    overall: "General",
    questionsCorrect: "preguntas correctas",
    keyMetrics: "Métricas Clave",
    tapToImprove: "Toca para mejorar →",
    masterBlocks: "Domina los Conceptos Básicos",
    explorePrereq: "Explora temas de prerrequisitos para fortalecer tu base",
    currentScore: "Puntuación Actual",
    howToImprove: "Cómo Mejorar",
    tips: [
      "Vuelve a leer las secciones relevantes de tu material",
      "Enfócate en entender el 'por qué' detrás de cada concepto",
      "Completa los bloques de construcción a continuación",
      "Practica con las preguntas que fallaste"
    ],
    interactiveChecklist: "Lista de Verificación Interactiva",
    skillsMastered: "habilidades dominadas",
    listenToConcept: "Escuchar Concepto",
    stopAudio: "Detener Audio",
    knowledgeCheck: "Prueba de Conocimiento",
    markComplete: "Marcar como Completado",
    backToResults: "Volver a Resultados",
    navHome: "Inicio", navUpload: "Subir", navLessons: "Lecciones", navResults: "Resultados", navProfile: "Perfil",
    
    // Data (Mocked content)
    metrics: [
      { key: "comprehension", label: "Comprensión", score: 72, icon: "menu-book", color: theme.tertiary, description: "Qué tan bien entiendes las ideas principales" },
      { key: "retention", label: "Retención", score: 58, icon: "psychology", color: theme.secondary, description: "Qué tan bien recuerdas hechos específicos" },
      { key: "application", label: "Aplicación", score: 65, icon: "build", color: theme.primary, description: "Uso del conocimiento en situaciones nuevas" },
      { key: "analysis", label: "Análisis", score: 80, icon: "insights", color: "#7c3aed", description: "Evaluación de ideas complejas" },
    ] as EvalMetric[],
    pretestQs: [
      { id: 1, question: "¿Cuál es el propósito de la fotosíntesis en las plantas?", options: ["Absorber agua", "Convertir luz en energía química", "Liberar CO2", "Transportar nutrientes"], correctIndex: 1, explanation: "La fotosíntesis convierte la luz solar en glucosa.", topic: "Biología" },
      { id: 2, question: "¿Qué orgánulo es la 'central de energía de la célula'?", options: ["Núcleo", "Ribosoma", "Mitocondria", "Golgi"], correctIndex: 2, explanation: "Las mitocondrias producen ATP.", topic: "Biología Celular" }
    ] as Question[],
    studyQs: [
      { id: 1, question: "Según el material, ¿cuál es el tema principal del Módulo 1?", options: ["Economía del siglo 20", "Sociedad filipina precolonial", "Colonización española", "Esfuerzos de posguerra"], correctIndex: 1, explanation: "El Módulo 1 se centra en la sociedad precolonial.", topic: "Comprehension" },
    ] as Question[],
    prereqs: {
      comprehension: { title: "Lectura Comprensiva", topics: [ { id: 1, label: "Identificar ideas principales", description: "La idea principal es el concepto central que el autor quiere transmitir.", quizQuestion: "¿Dónde se encuentra usualmente la idea principal?", quizOptions: ["Medio", "Primera/última oración", "Notas al pie"], quizCorrectIndex: 1, done: false } ] },
      retention: { title: "Estrategias de Memoria", topics: [ { id: 1, label: "Recuerdo activo", description: "Recuperar información de la memoria sin mirar apuntes.", quizQuestion: "¿Qué es recuerdo activo?", quizOptions: ["Releer", "Resumir en voz alta sin el libro", "Resaltar"], quizCorrectIndex: 1, done: false } ] },
      application: { title: "Habilidades de Aplicación", topics: [ { id: 1, label: "Conexión a la vida real", description: "Aplicar la teoría a escenarios del mundo real.", quizQuestion: "¿Qué demuestra aplicación?", quizOptions: ["Memorizar fórmula", "Usar fórmula para presupuesto de compras", "Escribirla 10 veces"], quizCorrectIndex: 1, done: false } ] },
      analysis: { title: "Análisis Crítico", topics: [ { id: 1, label: "Comparar y contrastar", description: "Comparar busca similitudes, contrastar busca diferencias.", quizQuestion: "Contrastar significa buscar:", quizOptions: ["Similitudes", "Diferencias", "Fechas"], quizCorrectIndex: 1, done: false } ] },
    }
  }
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
};

const getFileIcon = (mimeType: string): { icon: string; color: string; bgColor: string } => {
  if (mimeType?.includes("pdf")) return { icon: "picture-as-pdf", color: "#dc2626", bgColor: "#fef2f2" };
  if (mimeType?.includes("image")) return { icon: "image", color: "#2563eb", bgColor: "#eff6ff" };
  return { icon: "article", color: "#16a34a", bgColor: "#f0fdf4" };
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<AppScreen>("upload");
  const [lang, setLang] = useState<LanguageCode>("en"); // Language State
  const t = DICTIONARY[lang]; // Active dictionary

  // Upload state
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([
    {
      name: "Kasaysayan_Module_1.pdf", size: "2.4 MB", uri: "", type: "application/pdf",
      localPath: `${FileSystem.documentDirectory}Kasaysayan_Module_1.pdf`, uploadedAt: "2 hours ago",
    },
  ]);
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [storageUsed, setStorageUsed] = useState(65);
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Pretest & Study State
  const [pretestIndex, setPretestIndex] = useState(0);
  const [pretestAnswers, setPretestAnswers] = useState<(number | null)[]>([]);
  const [pretestSubmitted, setPretestSubmitted] = useState(false);
  const [pretestLevel, setPretestLevel] = useState<"Beginner" | "Intermediate" | "Advanced">("Beginner");
  const [showPretestExplanation, setShowPretestExplanation] = useState(false);

  const [studyIndex, setStudyIndex] = useState(0);
  const [studyAnswers, setStudyAnswers] = useState<(number | null)[]>([]);
  const [studyRevealed, setStudyRevealed] = useState<boolean[]>([]);

  // Evaluation & Prerequisites State
  const [evalMetrics, setEvalMetrics] = useState<EvalMetric[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<EvalMetric | null>(null);
  const [activeMetricKey, setActiveMetricKey] = useState<MetricKey | null>(null);
  const [prereqProgress, setPrereqProgress] = useState<Record<MetricKey, PrereqTopic[]> | null>(null);

  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Re-initialize dynamic data when Language changes
  useEffect(() => {
    setPretestAnswers(new Array(t.pretestQs.length).fill(null));
    setStudyAnswers(new Array(t.studyQs.length).fill(null));
    setStudyRevealed(new Array(t.studyQs.length).fill(false));
    setEvalMetrics(t.metrics);
    setPrereqProgress({
      comprehension: t.prereqs.comprehension.topics.map(topic => ({ ...topic, expanded: false, quizAnswered: null })),
      retention: t.prereqs.retention.topics.map(topic => ({ ...topic, expanded: false, quizAnswered: null })),
      application: t.prereqs.application.topics.map(topic => ({ ...topic, expanded: false, quizAnswered: null })),
      analysis: t.prereqs.analysis.topics.map(topic => ({ ...topic, expanded: false, quizAnswered: null })),
    });
  }, [lang]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
    
    return () => { Speech.stop(); setIsSpeaking(false); }
  }, [screen]);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: storageUsed, duration: 1500, useNativeDriver: false,
    }).start();
  }, [storageUsed, progressAnim]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100], outputRange: ["0%", "100%"],
  });

  // ─── Handlers ───────────────────────────────────────────────────────────────
  
  const handleToggleLanguage = () => {
    if (lang === "en") setLang("tl");
    else if (lang === "tl") setLang("es");
    else setLang("en");
    Speech.stop();
    setIsSpeaking(false);
  };

  const handleUploadPress = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: ["application/pdf", "image/*", "text/plain"], copyToCacheDirectory: true });
      if (result.canceled || !result.assets?.length) return;

      setIsUploading(true);
      const asset = result.assets[0];
      const destPath = `${FileSystem.documentDirectory}${asset.name}`;
      await FileSystem.copyAsync({ from: asset.uri, to: destPath });

      const newFile: UploadedFile = {
        name: asset.name, size: formatFileSize(asset.size || 0), uri: asset.uri, type: asset.mimeType || "application/octet-stream", localPath: destPath, uploadedAt: "Just now",
      };

      setUploadedFiles((prev) => [newFile, ...prev]);
      setStorageUsed((prev) => Math.min(prev + 3, 99));
      setIsUploading(false);
      handleStartLearning(newFile);
    } catch (err) {
      setIsUploading(false);
      Alert.alert("Upload Failed");
    }
  };

  const handleStartLearning = (file: UploadedFile) => {
    setSelectedFile(file);
    setPretestIndex(0);
    setPretestAnswers(new Array(t.pretestQs.length).fill(null));
    setPretestSubmitted(false);
    setShowPretestExplanation(false);
    fadeAnim.setValue(0); slideAnim.setValue(30); setScreen("pretest");
  };

  const handlePretestAnswer = (optionIndex: number) => {
    const updated = [...pretestAnswers]; updated[pretestIndex] = optionIndex;
    setPretestAnswers(updated);
    if (pretestIndex < t.pretestQs.length - 1) setTimeout(() => setPretestIndex((i) => i + 1), 600);
  };

  const handleSubmitPretest = () => {
    const correct = pretestAnswers.filter((a, i) => a === t.pretestQs[i].correctIndex).length;
    const pct = (correct / t.pretestQs.length) * 100;
    if (pct >= 80) setPretestLevel("Advanced");
    else if (pct >= 50) setPretestLevel("Intermediate");
    else setPretestLevel("Beginner");
    setPretestSubmitted(true);
  };

  const handleStudyAnswer = (optionIndex: number) => {
      const updated = [...studyAnswers]; updated[studyIndex] = optionIndex; setStudyAnswers(updated);
      const revealed = [...studyRevealed]; revealed[studyIndex] = true; setStudyRevealed(revealed);
  };
  
  const handleNextStudy = () => {
    if (studyIndex < t.studyQs.length - 1) {
      setStudyIndex(i => i + 1);
    } else {
      const topicScores: Record<string, { correct: number; total: number }> = {};
      t.studyQs.forEach((q, i) => {
        const top = q.topic.toLowerCase() as MetricKey;
        if (!topicScores[top]) topicScores[top] = { correct: 0, total: 0 };
        topicScores[top].total += 1;
        if (studyAnswers[i] === q.correctIndex) topicScores[top].correct += 1;
      });

      setEvalMetrics((prev) =>
        prev.map((m) => {
          const ts = topicScores[m.key];
          if (ts) return { ...m, score: Math.round((ts.correct / ts.total) * 100) };
          return m;
        })
      );
      fadeAnim.setValue(0); slideAnim.setValue(30); setScreen("evaluation"); 
    }
  };

  const handleMetricSelect = (metric: EvalMetric) => {
    setSelectedMetric(metric);
    setActiveMetricKey(metric.key);
    fadeAnim.setValue(0); slideAnim.setValue(30); setScreen("metric-drill");
  };

  // Comprehensive Checklist Handlers
  const handleToggleExpandPrereq = (metricKey: MetricKey, topicId: number) => {
    if (!prereqProgress) return;
    Speech.stop(); 
    setIsSpeaking(false);
    setPrereqProgress((prev) => ({
      ...prev!,
      [metricKey]: prev![metricKey].map((top) =>
        top.id === topicId ? { ...top, expanded: !top.expanded } : { ...top, expanded: false } 
      ),
    }));
  };

  const handleSpeakText = (text: string) => {
    if (isSpeaking) {
        Speech.stop(); setIsSpeaking(false);
    } else {
        setIsSpeaking(true);
        // Uses the current language code for appropriate accent
        Speech.speak(text, {
            language: lang === "tl" ? "fil-PH" : lang === "es" ? "es-ES" : "en-US",
            rate: 0.9,
            onDone: () => setIsSpeaking(false),
            onStopped: () => setIsSpeaking(false),
            onError: () => setIsSpeaking(false),
        });
    }
  };

  const handlePrereqQuizAnswer = (metricKey: MetricKey, topicId: number, answerIndex: number) => {
    if (!prereqProgress) return;
    setPrereqProgress((prev) => ({
      ...prev!,
      [metricKey]: prev![metricKey].map((top) =>
        top.id === topicId ? { ...top, quizAnswered: answerIndex } : top
      ),
    }));
  };

  const handleMarkPrereqDone = (metricKey: MetricKey, topicId: number) => {
    if (!prereqProgress) return;
    setPrereqProgress((prev) => ({
      ...prev!,
      [metricKey]: prev![metricKey].map((top) =>
        top.id === topicId ? { ...top, done: true, expanded: false } : top
      ),
    }));
  };

  // ─── Screens ─────────────────────────────────────────────────────────────

  const renderUpload = () => (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.introSection}>
          <View style={styles.mascotWrapper}>
            <View style={styles.mascotContainer}>
              <Image source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCutE36Jl0IW_Ld1hXHs7CNPDjuwpj_Du41qAg8v0fP67IJzCgWb3xxRmoAkbBRuyIRdRSuv1D1GQ4rRYL7JBuntmxwr_67ow8tiPykO0fF390Yw-4gBRrrvQoeKFWWOVmO3xZ4DDooUJZC1tdNi_alo63ezXPkszP14cxB815UKccwr1DdTzpSXLwbI2lhlIpd5SYO5QfGENDjOAGfWnF1C7PytYulqFIHraZEeQHGfHtXfWzTjkMxxoHhOKsYuOdQaWPRCnPhvAs" }} style={styles.avatar} />
            </View>
            <View style={styles.mascotBadge}><MaterialIcons name="auto-stories" size={14} color="#fff" /></View>
          </View>
          <View style={styles.speechBubble}>
            <Text style={styles.speechText}>{t.mascotUpload}</Text>
            <View style={styles.speechTail} />
          </View>
        </View>

        <View style={styles.uploadZoneContainer}>
          <Pressable style={[styles.uploadZone, isUploading && { opacity: 0.7 }]} onPress={handleUploadPress} disabled={isUploading}>
            {isUploading ? (
              <>
                <ActivityIndicator size="large" color={theme.primary} style={{ marginBottom: 16 }} />
                <Text style={styles.uploadTitle}>{t.savingFile}</Text>
                <Text style={styles.uploadSubtitle}>{t.savingWait}</Text>
              </>
            ) : (
              <>
                <View style={styles.uploadIconCircle}><MaterialIcons name="cloud-upload" size={40} color={theme.primary} /></View>
                <Text style={styles.uploadTitle}>{t.uploadTitle}</Text>
                <Text style={styles.uploadSubtitle}>{t.uploadSub}</Text>
                <View style={styles.uploadButton}>
                  <MaterialIcons name="folder-open" size={20} color={theme.onPrimaryContainer} />
                  <Text style={styles.uploadButtonText}>{t.browseFiles}</Text>
                </View>
              </>
            )}
          </Pressable>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.statsHeaderRow}>
            <MaterialIcons name="analytics" size={24} color={theme.onTertiaryContainer} />
            <Text style={styles.statsTitle}>{t.storage}</Text>
          </View>
          <View style={styles.progressBarBg}><Animated.View style={[styles.progressBarFill, { width: progressWidth }]} /></View>
          <Text style={styles.statsSubtitle}>{storageUsed}% of 500MB</Text>
        </View>

        <View style={styles.typesCard}>
          <Text style={styles.typesTitle}>{t.supportedTypes}</Text>
          <View style={styles.typesWrapper}>
            <TypeChip icon="picture-as-pdf" color="#ef4444" label="PDF" />
            <TypeChip icon="image" color="#3b82f6" label="JPEG/PNG" />
            <TypeChip icon="description" color="#22c55e" label="TXT" />
          </View>
        </View>

        <View style={styles.recentSection}>
          <View style={styles.recentHeader}>
            <Text style={styles.recentTitle}>{t.recentUploads}</Text>
            <Text style={styles.viewAllText}>{t.viewAll}</Text>
          </View>
          {uploadedFiles.map((file, idx) => {
            const fileStyle = getFileIcon(file.type);
            return (
              <Pressable key={idx} style={styles.recentItem} onPress={() => handleStartLearning(file)}>
                <View style={styles.recentItemLeft}>
                  <View style={[styles.recentIconBox, { backgroundColor: fileStyle.bgColor }]}>
                    <MaterialIcons name={fileStyle.icon as any} size={28} color={fileStyle.color} />
                  </View>
                  <View style={styles.recentTextContainer}>
                    <Text style={styles.recentItemTitle} numberOfLines={1}>{file.name}</Text>
                    <Text style={styles.recentItemSubtitle}>{file.size} • {file.uploadedAt}</Text>
                  </View>
                </View>
                <View style={styles.startChip}>
                  <Text style={styles.startChipText}>{t.studyBtn}</Text>
                  <MaterialIcons name="arrow-forward" size={14} color={theme.onPrimaryContainer} />
                </View>
              </Pressable>
            );
          })}
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
    </Animated.View>
  );

  const renderPretest = () => {
    const q = t.pretestQs[pretestIndex];
    if (!q) return null;
    const answered = pretestAnswers[pretestIndex];
    const allAnswered = pretestAnswers.length > 0 && pretestAnswers.every((a) => a !== null);
    const correct = pretestAnswers.filter((a, i) => a === t.pretestQs[i]?.correctIndex).length;

    if (pretestSubmitted) {
      const pct = Math.round((correct / t.pretestQs.length) * 100);
      return (
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.resultCard}>
              <Text style={styles.resultEmoji}>{pct >= 80 ? "🏆" : pct >= 50 ? "📚" : "🌱"}</Text>
              <Text style={styles.resultTitle}>{t.pretestComplete}</Text>
              <Text style={styles.resultScore}>{pct}%</Text>
              <Text style={styles.resultLevel}>{t.level}: {pretestLevel === "Advanced" ? t.levelAdvanced : pretestLevel === "Intermediate" ? t.levelIntermediate : t.levelBeginner}</Text>
              <Text style={styles.resultDesc}>
                {pretestLevel === "Advanced" ? t.levelAdvDesc : pretestLevel === "Intermediate" ? t.levelIntDesc : t.levelBegDesc}
              </Text>

              <View style={styles.resultStatsRow}>
                <View style={styles.resultStat}><Text style={styles.resultStatNum}>{correct}</Text><Text style={styles.resultStatLabel}>{t.correct}</Text></View>
                <View style={[styles.resultStat, { borderLeftWidth: 1, borderRightWidth: 1, borderColor: theme.outlineVariant }]}><Text style={styles.resultStatNum}>{t.pretestQs.length - correct}</Text><Text style={styles.resultStatLabel}>{t.missed}</Text></View>
                <View style={styles.resultStat}><Text style={styles.resultStatNum}>{t.pretestQs.length}</Text><Text style={styles.resultStatLabel}>{t.total}</Text></View>
              </View>
            </View>
            <Pressable style={styles.primaryBtn} onPress={() => {
                setStudyIndex(0); setStudyAnswers(new Array(t.studyQs.length).fill(null)); setStudyRevealed(new Array(t.studyQs.length).fill(false));
                fadeAnim.setValue(0); slideAnim.setValue(30); setScreen("studying");
              }}>
              <Text style={styles.primaryBtnText}>{t.beginStudyBtn}</Text>
            </Pressable>
            <View style={{ height: 100 }} />
          </ScrollView>
        </Animated.View>
      );
    }

    return (
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>{t.questionStr} {pretestIndex + 1} / {t.pretestQs.length}</Text>
            <Text style={styles.progressLabel}>{Math.round(((pretestIndex + 1) / t.pretestQs.length) * 100)}%</Text>
          </View>
          <View style={styles.thinProgressBg}>
            <View style={[styles.thinProgressFill, { width: `${((pretestIndex + 1) / t.pretestQs.length) * 100}%` }]} />
          </View>
          <View style={styles.topicBadge}><MaterialIcons name="label" size={14} color={theme.tertiary} /><Text style={styles.topicBadgeText}>{q.topic}</Text></View>
          <Text style={styles.questionText}>{q.question}</Text>

          {q.options.map((opt, i) => {
            const isSelected = answered === i;
            return (
              <Pressable key={i} style={[styles.optionBtn, isSelected && styles.optionBtnSelected]} onPress={() => !showPretestExplanation && handlePretestAnswer(i)}>
                <View style={[styles.optionDot, isSelected && styles.optionDotSelected]}>{isSelected && <View style={styles.optionDotInner} />}</View>
                <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>{opt}</Text>
              </Pressable>
            );
          })}
          <View style={styles.dotRow}>
            {t.pretestQs.map((_, i) => (
              <Pressable key={i} onPress={() => setPretestIndex(i)}>
                <View style={[styles.dot, i === pretestIndex && styles.dotActive, pretestAnswers[i] !== null && styles.dotAnswered]} />
              </Pressable>
            ))}
          </View>
          {allAnswered && <Pressable style={styles.primaryBtn} onPress={handleSubmitPretest}><Text style={styles.primaryBtnText}>{t.submitPretest}</Text></Pressable>}
          <View style={{ height: 100 }} />
        </ScrollView>
      </Animated.View>
    );
  };

  const renderStudy = () => {
    const q = t.studyQs[studyIndex];
    if (!q) return null;
    const answered = studyAnswers[studyIndex];
    const revealed = studyRevealed[studyIndex];
    const isCorrect = answered === q.correctIndex;

    return (
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {selectedFile && (
            <View style={styles.materialBanner}>
              <MaterialIcons name="picture-as-pdf" size={16} color={theme.secondary} />
              <Text style={styles.materialBannerText} numberOfLines={1}>{selectedFile.name}</Text>
            </View>
          )}
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>{studyIndex + 1} / {t.studyQs.length}</Text>
            <Text style={styles.topicBadgeText}>{q.topic}</Text>
          </View>
          <View style={styles.thinProgressBg}>
            <View style={[styles.thinProgressFill, { width: `${((studyIndex + 1) / t.studyQs.length) * 100}%` }]} />
          </View>
          <Text style={styles.questionText}>{q.question}</Text>

          {q.options.map((opt, i) => {
            let style = styles.optionBtn; let textStyle = styles.optionText;
            if (revealed) {
              if (i === q.correctIndex) { style = { ...styles.optionBtn, borderColor: theme.success, backgroundColor: theme.successContainer }; textStyle = { ...styles.optionText, color: theme.success, fontWeight: "700" }; } 
              else if (i === answered && answered !== q.correctIndex) { style = { ...styles.optionBtn, borderColor: theme.error, backgroundColor: theme.errorContainer }; textStyle = { ...styles.optionText, color: theme.error }; }
            } else if (answered === i) { style = styles.optionBtnSelected; textStyle = styles.optionTextSelected; }

            return (
              <Pressable key={i} style={[styles.optionBtn, style]} onPress={() => !revealed && handleStudyAnswer(i)}>
                <View style={styles.optionRow}>
                  <Text style={[styles.optionText, textStyle]}>{opt}</Text>
                  {revealed && i === q.correctIndex && <MaterialIcons name="check-circle" size={20} color={theme.success} />}
                  {revealed && i === answered && answered !== q.correctIndex && <MaterialIcons name="cancel" size={20} color={theme.error} />}
                </View>
              </Pressable>
            );
          })}

          {revealed && (
            <View style={[styles.explanationBox, { borderColor: isCorrect ? theme.success : theme.warning }]}>
              <View style={styles.explanationHeader}>
                <MaterialIcons name={isCorrect ? "check-circle" : "info"} size={20} color={isCorrect ? theme.success : theme.warning} />
                <Text style={[styles.explanationTitle, { color: isCorrect ? theme.success : theme.warning }]}>{isCorrect ? t.correctExclaim : t.notQuite}</Text>
              </View>
              <Text style={styles.explanationText}>{q.explanation}</Text>
            </View>
          )}

          <View style={styles.studyActions}>
            {!revealed && answered !== null && (
              <Pressable style={styles.revealBtn} onPress={() => { const r = [...studyRevealed]; r[studyIndex] = true; setStudyRevealed(r); }}>
                <Text style={styles.revealBtnText}>{t.checkAnswer}</Text>
              </Pressable>
            )}
            {revealed && (
              <Pressable style={styles.primaryBtn} onPress={handleNextStudy}>
                <Text style={styles.primaryBtnText}>{studyIndex < t.studyQs.length - 1 ? t.nextQuestion : t.seeResults}</Text>
              </Pressable>
            )}
          </View>
          <View style={{ height: 100 }} />
        </ScrollView>
      </Animated.View>
    );
  };

  const renderEvaluation = () => {
    if (!evalMetrics.length) return null;
    const totalScore = Math.round(evalMetrics.reduce((s, m) => s + m.score, 0) / evalMetrics.length);
    const correctCount = studyAnswers.filter((a, i) => a === t.studyQs[i]?.correctIndex).length;

    return (
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.evalHeader}>
            <Text style={styles.evalEmoji}>{totalScore >= 75 ? "🎉" : totalScore >= 50 ? "📈" : "💪"}</Text>
            <Text style={styles.evalTitle}>{t.yourResults}</Text>
            <View style={styles.evalScoreCircle}><Text style={styles.evalScoreNum}>{totalScore}%</Text><Text style={styles.evalScoreLabel}>{t.overall}</Text></View>
            <Text style={styles.evalSubtitle}>{correctCount} / {t.studyQs.length} {t.questionsCorrect}</Text>
          </View>

          <Text style={styles.sectionTitle}>{t.keyMetrics}</Text>
          {evalMetrics.map((metric) => (
            <Pressable key={metric.key} style={styles.metricCard} onPress={() => handleMetricSelect(metric)}>
              <View style={styles.metricCardTop}>
                <View style={[styles.metricIconBox, { backgroundColor: metric.color + "22" }]}>
                  <MaterialIcons name={metric.icon as any} size={24} color={metric.color} />
                </View>
                <View style={styles.metricInfo}>
                  <Text style={styles.metricLabel}>{metric.label}</Text>
                  <Text style={styles.metricDesc}>{metric.description}</Text>
                </View>
                <View style={styles.metricScoreBox}><Text style={[styles.metricScoreNum, { color: metric.score >= 75 ? theme.success : metric.score >= 50 ? theme.warning : theme.error }]}>{metric.score}%</Text></View>
              </View>
              <ScoreBar score={metric.score} color={metric.color} />
              <View style={styles.metricFooter}><Text style={styles.metricFooterText}>{t.tapToImprove}</Text></View>
            </Pressable>
          ))}

          <Pressable style={styles.prereqBanner} onPress={() => { setActiveMetricKey(null); fadeAnim.setValue(0); slideAnim.setValue(30); setScreen("prerequisites"); }}>
            <MaterialIcons name="school" size={24} color={theme.tertiary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.prereqBannerTitle}>{t.masterBlocks}</Text>
              <Text style={styles.prereqBannerDesc}>{t.explorePrereq}</Text>
            </View>
            <MaterialIcons name="arrow-forward" size={20} color={theme.tertiary} />
          </Pressable>
          <View style={{ height: 100 }} />
        </ScrollView>
      </Animated.View>
    );
  };

  const renderMetricDrill = () => {
    if (!selectedMetric || !prereqProgress) return null;
    const m = selectedMetric;
    const prereqs = prereqProgress[m.key];
    const doneCount = prereqs.filter((p) => p.done).length;

    return (
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={[styles.drillHeader, { backgroundColor: m.color + "15" }]}>
            <View style={[styles.drillIconBig, { backgroundColor: m.color + "22" }]}><MaterialIcons name={m.icon as any} size={36} color={m.color} /></View>
            <Text style={[styles.drillTitle, { color: m.color }]}>{m.label}</Text>
            <Text style={styles.drillScore}>{m.score}% {t.currentScore}</Text>
            <ScoreBar score={m.score} color={m.color} />
            <Text style={styles.drillDesc}>{m.description}</Text>
          </View>

          <Text style={styles.sectionTitle}>{t.howToImprove}</Text>
          <View style={styles.tipsList}>
            {t.tips.map((tip, i) => (
              <View key={i} style={styles.tipItem}>
                <View style={[styles.tipNum, { backgroundColor: m.color }]}><Text style={styles.tipNumText}>{i + 1}</Text></View>
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>

          <View style={styles.prereqBlock}>
            <View style={styles.prereqBlockHeader}>
              <MaterialIcons name="fact-check" size={24} color={theme.tertiary} />
              <Text style={styles.prereqBlockTitle}>{t.interactiveChecklist}</Text>
            </View>
            <Text style={styles.prereqBlockProgress}>{doneCount} / {prereqs.length} {t.skillsMastered}</Text>
            <View style={styles.thinProgressBg}><View style={[styles.thinProgressFill, { width: `${(doneCount / prereqs.length) * 100}%`, backgroundColor: theme.tertiary }]} /></View>

            <View style={styles.checklistContainer}>
                {prereqs.map((topic) => (
                <View key={topic.id} style={styles.comprehensivePrereqItem}>
                    <Pressable style={styles.prereqItemHeader} onPress={() => handleToggleExpandPrereq(m.key, topic.id)}>
                        <View style={[styles.checkbox, topic.done && styles.checkboxDone]}>{topic.done && <MaterialIcons name="check" size={14} color="#fff" />}</View>
                        <Text style={[styles.prereqItemText, topic.done && styles.prereqItemTextDone]}>{topic.label}</Text>
                        <MaterialIcons name={topic.expanded ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={24} color={theme.onSurfaceVariant} />
                    </Pressable>

                    {topic.expanded && !topic.done && (
                        <View style={styles.prereqExpandedBody}>
                            <View style={styles.ttsContainer}>
                                <Pressable style={[styles.ttsBtn, isSpeaking && styles.ttsBtnActive]} onPress={() => handleSpeakText(topic.description)}>
                                    <MaterialIcons name={isSpeaking ? "stop-circle" : "record-voice-over"} size={18} color={isSpeaking ? "#fff" : theme.tertiary} />
                                    <Text style={[styles.ttsBtnText, isSpeaking && {color: "#fff"}]}>{isSpeaking ? t.stopAudio : t.listenToConcept}</Text>
                                </Pressable>
                            </View>
                            <Text style={styles.topicDescText}>{topic.description}</Text>

                            <View style={styles.miniQuizBox}>
                                <View style={styles.miniQuizHeader}>
                                    <MaterialIcons name="psychology-alt" size={18} color={theme.primary} />
                                    <Text style={styles.miniQuizTitle}>{t.knowledgeCheck}</Text>
                                </View>
                                <Text style={styles.miniQuizQuestion}>{topic.quizQuestion}</Text>
                                {topic.quizOptions.map((opt, i) => {
                                    const isSelected = topic.quizAnswered === i;
                                    const isCorrect = i === topic.quizCorrectIndex;
                                    const showResult = topic.quizAnswered !== null && topic.quizAnswered !== undefined;
                                    
                                    let btnStyle = styles.quizOptionBtn; let textStyle = styles.quizOptionText;
                                    let icon = "radio-button-unchecked"; let iconColor = theme.outlineVariant;

                                    if (showResult) {
                                        if (isCorrect) { btnStyle = {...styles.quizOptionBtn, backgroundColor: theme.successContainer, borderColor: theme.success}; textStyle = {...styles.quizOptionText, color: theme.success, fontWeight: "700"}; icon = "check-circle"; iconColor = theme.success; }
                                        else if (isSelected && !isCorrect) { btnStyle = {...styles.quizOptionBtn, backgroundColor: theme.errorContainer, borderColor: theme.error}; textStyle = {...styles.quizOptionText, color: theme.error}; icon = "cancel"; iconColor = theme.error; }
                                    }

                                    return (
                                        <Pressable key={i} style={btnStyle} onPress={() => !showResult && handlePrereqQuizAnswer(m.key, topic.id, i)}>
                                            <MaterialIcons name={icon as any} size={20} color={iconColor} />
                                            <Text style={textStyle}>{opt}</Text>
                                        </Pressable>
                                    );
                                })}

                                {topic.quizAnswered === topic.quizCorrectIndex && (
                                    <Pressable style={styles.markCompleteBtn} onPress={() => handleMarkPrereqDone(m.key, topic.id)}>
                                        <MaterialIcons name="done-all" size={20} color={theme.onPrimaryContainer} />
                                        <Text style={styles.markCompleteText}>{t.markComplete}</Text>
                                    </Pressable>
                                )}
                            </View>
                        </View>
                    )}
                </View>
                ))}
            </View>
          </View>

          <Pressable style={styles.secondaryBtn} onPress={() => { fadeAnim.setValue(0); slideAnim.setValue(30); setScreen("evaluation"); }}>
            <MaterialIcons name="arrow-back" size={18} color={theme.primary} />
            <Text style={styles.secondaryBtnText}>{t.backToResults}</Text>
          </Pressable>
          <View style={{ height: 100 }} />
        </ScrollView>
      </Animated.View>
    );
  };

  const renderPrerequisites = () => {
    if (!prereqProgress) return null;
    return (
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.prereqIntro}>
            <MaterialIcons name="school" size={36} color={theme.tertiary} />
            <Text style={styles.prereqIntroTitle}>{t.masterBlocks}</Text>
            <Text style={styles.prereqIntroDesc}>{t.explorePrereq}</Text>
          </View>

          {evalMetrics.map((metric) => {
            const prereqs = prereqProgress[metric.key];
            const doneCount = prereqs.filter((p) => p.done).length;
            const pct = Math.round((doneCount / prereqs.length) * 100);

            return (
              <Pressable key={metric.key} style={styles.prereqGroupCard} onPress={() => { setSelectedMetric(metric); setActiveMetricKey(metric.key); fadeAnim.setValue(0); slideAnim.setValue(30); setScreen("metric-drill"); }}>
                <View style={styles.prereqGroupHeader}>
                  <View style={[styles.metricIconBox, { backgroundColor: metric.color + "22" }]}><MaterialIcons name={metric.icon as any} size={22} color={metric.color} /></View>
                  <View style={{ flex: 1 }}><Text style={styles.prereqGroupTitle}>{t.prereqs[metric.key].title}</Text><Text style={[styles.prereqGroupProgress, { color: metric.color }]}>{doneCount}/{prereqs.length}</Text></View>
                  <View style={[styles.prereqScorePill, { backgroundColor: metric.color + "22" }]}><Text style={[styles.prereqScorePillText, { color: metric.color }]}>{pct}%</Text></View>
                </View>
                <View style={styles.thinProgressBg}><View style={[styles.thinProgressFill, { width: `${pct}%`, backgroundColor: metric.color }]} /></View>
                <View style={styles.prereqTopicList}>
                  {prereqs.map((topic) => (
                    <View key={topic.id} style={styles.prereqTopicRow}>
                      <MaterialIcons name={topic.done ? "check-circle" : "radio-button-unchecked"} size={16} color={topic.done ? metric.color : theme.outlineVariant} />
                      <Text style={[styles.prereqTopicText, topic.done && { color: metric.color, textDecorationLine: "line-through" }]}>{topic.label}</Text>
                    </View>
                  ))}
                </View>
              </Pressable>
            );
          })}
          <View style={{ height: 100 }} />
        </ScrollView>
      </Animated.View>
    );
  };

  const getMascotSpeech = () => {
    switch (screen) {
      case "upload": return t.mascotUpload;
      case "pretest": return t.mascotPretest;
      case "studying": return t.mascotStudy;
      case "evaluation": return t.mascotEval;
      case "metric-drill": return t.mascotDrill;
      case "prerequisites": return t.mascotPrereq;
      default: return "";
    }
  };

  // ─── App Shell ─────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAOPtrJY4uLZTPCZYtr_CzuFPHCUmMTukPEowUfEP3MTMykJnVPE5-ZUlAseC-Khg7wmPbS0QatBnMYAFeBhhc4MikGQE4Xqkp1S1xkQDt7FYG68ghQlp0SgtxEuy276fIZnv81op5xTPu-qewJTNt1l0sTGvjQEFfgciEXa0OrvETgkpD5JprclEgnS0jOkA4wrz3R3Om87zv8a53ibdDTAyHJmoMuTJ6YwPGxdZ23QrFhS1Jm9dQ1vLnJZteXTVS23PHjRHwqKs4" }} style={styles.avatar} />
          </View>
          <Text style={styles.headerTitle}>{t.headerTitle}</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.streakBadge}>
            <Text style={{ fontSize: 14 }}>🔥</Text>
            <Text style={styles.streakText}>5</Text>
          </View>
          {/* Custom Multi-Language Switcher */}
          <Pressable style={styles.iconButton} onPress={handleToggleLanguage}>
            <MaterialIcons name="language" size={24} color={theme.primary} />
            <View style={styles.langBadge}><Text style={styles.langBadgeText}>{lang.toUpperCase()}</Text></View>
          </Pressable>
        </View>
      </View>

      {/* Screen title bar */}
      {screen !== "upload" && (
        <View style={styles.screenBar}>
          <Pressable
            onPress={() => {
              fadeAnim.setValue(0); slideAnim.setValue(30);
              if (screen === "pretest") setScreen("upload");
              else if (screen === "studying") setScreen("pretest");
              else if (screen === "evaluation") setScreen("studying");
              else if (screen === "metric-drill") setScreen("evaluation");
              else if (screen === "prerequisites") setScreen("evaluation");
            }}
            style={styles.backBtn}
          >
            <MaterialIcons name="arrow-back" size={22} color={theme.onSurface} />
          </Pressable>
          <View style={styles.breadcrumb}>
            {(["upload", "pretest", "studying", "evaluation", "prerequisites"] as AppScreen[]).map((s, i, arr) => {
                const isActive = s === screen || (screen === "metric-drill" && s === "evaluation");
                const isVisited = arr.indexOf(screen) > i || (screen === "metric-drill" && i <= 3);
                return (
                  <React.Fragment key={s}>
                    <View style={[styles.crumbDot, isActive && styles.crumbDotActive, isVisited && styles.crumbDotVisited]} />
                    {i < arr.length - 1 && <View style={[styles.crumbLine, isVisited && styles.crumbLineVisited]} />}
                  </React.Fragment>
                );
              }
            )}
          </View>
          <View style={{ width: 40 }} />
        </View>
      )}

      {/* Mini mascot tip strip */}
      {screen !== "upload" && (
        <View style={styles.mascotStrip}>
          <Image source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCutE36Jl0IW_Ld1hXHs7CNPDjuwpj_Du41qAg8v0fP67IJzCgWb3xxRmoAkbBRuyIRdRSuv1D1GQ4rRYL7JBuntmxwr_67ow8tiPykO0fF390Yw-4gBRrrvQoeKFWWOVmO3xZ4DDooUJZC1tdNi_alo63ezXPkszP14cxB815UKccwr1DdTzpSXLwbI2lhlIpd5SYO5QfGENDjOAGfWnF1C7PytYulqFIHraZEeQHGfHtXfWzTjkMxxoHhOKsYuOdQaWPRCnPhvAs" }} style={styles.mascotStripAvatar} />
          <Text style={styles.mascotStripText}>{getMascotSpeech()}</Text>
        </View>
      )}

      {/* Main content */}
      <View style={{ flex: 1 }}>
        {screen === "upload" && renderUpload()}
        {screen === "pretest" && renderPretest()}
        {screen === "studying" && renderStudy()}
        {screen === "evaluation" && renderEvaluation()}
        {screen === "metric-drill" && renderMetricDrill()}
        {screen === "prerequisites" && renderPrerequisites()}
      </View>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <NavItem icon="home" label={t.navHome} href="/home" />
        <NavItem icon="upload-file" label={t.navUpload} isActive={screen === "upload"} onPress={() => { fadeAnim.setValue(0); slideAnim.setValue(30); setScreen("upload"); }} />
        <NavItem icon="school" label={t.navLessons} isActive={screen === "studying" || screen === "pretest"} onPress={() => { if (selectedFile) { fadeAnim.setValue(0); slideAnim.setValue(30); setScreen("studying"); } }} />
        <NavItem icon="bar-chart" label={t.navResults} isActive={screen === "evaluation" || screen === "metric-drill" || screen === "prerequisites"} onPress={() => { fadeAnim.setValue(0); slideAnim.setValue(30); setScreen("evaluation"); }} />
        <NavItem icon="person" label={t.navProfile} href="/profile" />
      </View>
    </SafeAreaView>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const ScoreBar = ({ score, color }: { score: number; color: string }) => {
  const barAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => { Animated.timing(barAnim, { toValue: score, duration: 900, useNativeDriver: false }).start(); }, [score, barAnim]); 
  const width = barAnim.interpolate({ inputRange: [0, 100], outputRange: ["0%", "100%"] });
  return (
    <View style={styles.scoreBarBg}><Animated.View style={[styles.scoreBarFill, { width, backgroundColor: color }]} /></View>
  );
};

const TypeChip = ({ icon, color, label }: { icon: string; color: string; label: string }) => (
  <View style={styles.chip}>
    <MaterialIcons name={icon as any} size={16} color={color} />
    <Text style={styles.chipText}>{label}</Text>
  </View>
);

const NavItem = ({ icon, label, isActive, href, onPress }: { icon: string; label: string; isActive?: boolean; href?: string; onPress?: () => void; }) => (
  <Pressable style={[styles.navItem, isActive && styles.navItemActive]} onPress={() => { if (onPress) onPress(); else if (href) router.push(href); }}>
    <MaterialIcons name={icon as any} size={22} color={isActive ? theme.onPrimaryContainer : theme.onSurfaceVariant} />
    <Text style={[styles.navItemText, isActive && { color: theme.onPrimaryContainer }]}>{label}</Text>
  </Pressable>
);

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  scrollContent: { padding: 20 },
  
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingVertical: 12, backgroundColor: theme.surface, borderBottomWidth: 4, borderBottomColor: theme.surfaceContainerHigh, zIndex: 10 },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatarContainer: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: theme.primary, overflow: "hidden" },
  avatar: { width: "100%", height: "100%" },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: theme.primary },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 16 },
  streakBadge: { flexDirection: "row", alignItems: "center", backgroundColor: theme.surfaceContainerLow, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 16, gap: 4 },
  streakText: { fontSize: 14, fontWeight: "bold", color: theme.primary },
  iconButton: { padding: 8, borderRadius: 20, position: 'relative' },
  langBadge: { position: 'absolute', top: 0, right: 0, backgroundColor: theme.secondary, paddingHorizontal: 4, paddingVertical: 2, borderRadius: 8 },
  langBadgeText: { color: '#fff', fontSize: 9, fontWeight: 'bold' },

  screenBar: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 10, backgroundColor: theme.surfaceContainerLowest, borderBottomWidth: 1, borderBottomColor: theme.surfaceContainerHigh },
  backBtn: { width: 40, height: 40, justifyContent: "center" },
  breadcrumb: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center" },
  crumbDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: theme.surfaceContainerHigh },
  crumbDotActive: { backgroundColor: theme.primaryContainer, width: 12, height: 12, borderRadius: 6 },
  crumbDotVisited: { backgroundColor: theme.primary },
  crumbLine: { width: 20, height: 2, backgroundColor: theme.surfaceContainerHigh },
  crumbLineVisited: { backgroundColor: theme.primary },

  mascotStrip: { flexDirection: "row", alignItems: "center", backgroundColor: theme.primaryContainer + "33", paddingHorizontal: 16, paddingVertical: 8, gap: 10, borderBottomWidth: 1, borderBottomColor: theme.primaryContainer },
  mascotStripAvatar: { width: 28, height: 28, borderRadius: 14 },
  mascotStripText: { flex: 1, fontSize: 13, color: theme.onPrimaryContainer, fontStyle: "italic" },

  introSection: { flexDirection: "row", alignItems: "flex-start", gap: 16, marginBottom: 32 },
  mascotWrapper: { position: "relative" },
  mascotContainer: { width: 80, height: 80, backgroundColor: theme.primaryContainer, borderRadius: 40, borderWidth: 4, borderColor: theme.primary, overflow: "hidden" },
  mascotBadge: { position: "absolute", bottom: -4, right: -4, backgroundColor: theme.secondary, width: 24, height: 24, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  speechBubble: { flex: 1, backgroundColor: theme.surfaceContainerLowest, padding: 16, borderRadius: 12, borderWidth: 2, borderColor: theme.surfaceContainer, position: "relative" },
  speechText: { fontSize: 16, lineHeight: 24, color: theme.onSurface },
  speechTail: { position: "absolute", top: 24, left: -6, width: 12, height: 12, backgroundColor: theme.surfaceContainerLowest, borderLeftWidth: 2, borderBottomWidth: 2, borderColor: theme.surfaceContainer, transform: [{ rotate: "45deg" }] },

  uploadZoneContainer: { backgroundColor: theme.surfaceContainerHigh, borderRadius: 16, marginBottom: 20, paddingBottom: 4 },
  uploadZone: { backgroundColor: "#ffffff", borderWidth: 2, borderColor: "rgba(120, 89, 0, 0.3)", borderStyle: "dashed", borderRadius: 16, padding: 32, alignItems: "center", justifyContent: "center" },
  uploadIconCircle: { width: 80, height: 80, backgroundColor: "rgba(255, 193, 7, 0.2)", borderRadius: 40, alignItems: "center", justifyContent: "center", marginBottom: 24 },
  uploadTitle: { fontSize: 24, fontWeight: "bold", color: theme.onSurface, marginBottom: 8, textAlign: 'center' },
  uploadSubtitle: { fontSize: 16, color: theme.onSurfaceVariant, marginBottom: 24, textAlign: 'center' },
  uploadButton: { backgroundColor: theme.primaryContainer, flexDirection: "row", alignItems: "center", paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12, gap: 8, borderBottomWidth: 4, borderBottomColor: "#b88600" },
  uploadButtonText: { fontSize: 14, fontWeight: "bold", color: theme.onPrimaryContainer },

  statsCard: { backgroundColor: theme.tertiaryContainer, padding: 24, borderRadius: 16, marginBottom: 20, borderBottomWidth: 4, borderBottomColor: theme.onTertiaryFixedVariant },
  statsHeaderRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  statsTitle: { fontSize: 20, fontWeight: "bold", color: theme.onTertiaryContainer },
  progressBarBg: { width: "100%", height: 12, backgroundColor: "rgba(255, 255, 255, 0.3)", borderRadius: 6, marginBottom: 8, overflow: "hidden" },
  progressBarFill: { height: "100%", backgroundColor: theme.tertiary, borderRadius: 6 },
  statsSubtitle: { fontSize: 12, fontWeight: "600", color: theme.onTertiaryContainer, opacity: 0.8 },

  typesCard: { backgroundColor: theme.surfaceContainerLow, padding: 24, borderRadius: 16, borderWidth: 2, borderColor: theme.surfaceContainer, borderBottomWidth: 6, borderBottomColor: theme.surfaceContainerHigh },
  typesTitle: { fontSize: 14, fontWeight: "bold", color: theme.onSurface, marginBottom: 16 },
  typesWrapper: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { flexDirection: "row", alignItems: "center", backgroundColor: "#ffffff", borderWidth: 1, borderColor: theme.surfaceContainerHigh, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, gap: 4 },
  chipText: { fontSize: 12, fontWeight: "500", color: theme.onSurface },

  recentSection: { marginTop: 40 },
  recentHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  recentTitle: { fontSize: 24, fontWeight: "bold", color: theme.onSurface },
  viewAllText: { fontSize: 14, fontWeight: "bold", color: theme.primary },
  recentItem: { backgroundColor: "#ffffff", flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16, borderRadius: 12, borderWidth: 2, borderColor: theme.surfaceContainerLow, marginBottom: 12 },
  recentItemLeft: { flexDirection: "row", alignItems: "center", gap: 16, flex: 1 },
  recentIconBox: { width: 48, height: 48, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  recentTextContainer: { flex: 1 },
  recentItemTitle: { fontSize: 14, fontWeight: "bold", color: theme.onSurface, marginBottom: 2 },
  recentItemSubtitle: { fontSize: 12, color: theme.onSurfaceVariant },
  startChip: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: theme.primaryContainer, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderBottomWidth: 2, borderBottomColor: "#b88600" },
  startChipText: { fontSize: 12, fontWeight: "700", color: theme.onPrimaryContainer },

  progressRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  progressLabel: { fontSize: 13, color: theme.onSurfaceVariant, fontWeight: "600" },
  topicBadge: { flexDirection: "row", alignItems: "center", gap: 6, alignSelf: "flex-start", backgroundColor: theme.tertiaryContainer, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 16 },
  topicBadgeText: { fontSize: 12, fontWeight: "700", color: theme.onTertiaryContainer },
  questionText: { fontSize: 20, fontWeight: "bold", color: theme.onSurface, lineHeight: 30, marginBottom: 24 },
  optionBtn: { backgroundColor: "#ffffff", borderWidth: 2, borderColor: theme.outlineVariant, borderRadius: 12, padding: 16, marginBottom: 12, flexDirection: "row", alignItems: "center", gap: 12 },
  optionBtnSelected: { backgroundColor: theme.primaryContainer + "33", borderWidth: 2, borderColor: theme.primary, borderRadius: 12, padding: 16, marginBottom: 12, flexDirection: "row", alignItems: "center", gap: 12 },
  optionRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", flex: 1 },
  optionDot: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: theme.outlineVariant, alignItems: "center", justifyContent: "center" },
  optionDotSelected: { borderColor: theme.primary },
  optionDotInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: theme.primary },
  optionText: { fontSize: 16, color: theme.onSurface, flex: 1, lineHeight: 22 },
  optionTextSelected: { fontSize: 16, color: theme.primary, flex: 1, lineHeight: 22, fontWeight: "600" },
  dotRow: { flexDirection: "row", justifyContent: "center", gap: 8, marginVertical: 24 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: theme.surfaceContainerHigh },
  dotActive: { backgroundColor: theme.primary, width: 20 },
  dotAnswered: { backgroundColor: theme.primaryContainer },
  explanationBox: { borderWidth: 2, borderRadius: 12, padding: 16, marginTop: 8, marginBottom: 8, backgroundColor: "#fff" },
  explanationHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  explanationTitle: { fontSize: 16, fontWeight: "700" },
  explanationText: { fontSize: 14, color: theme.onSurfaceVariant, lineHeight: 22 },
  studyActions: { marginTop: 16 },
  revealBtn: { backgroundColor: theme.tertiaryContainer, padding: 16, borderRadius: 12, alignItems: "center", borderBottomWidth: 4, borderBottomColor: theme.onTertiaryFixedVariant },
  revealBtnText: { fontSize: 16, fontWeight: "700", color: theme.onTertiaryContainer },
  materialBanner: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#fef2f2", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, marginBottom: 20, borderLeftWidth: 3, borderLeftColor: theme.secondary },
  materialBannerText: { fontSize: 13, color: theme.secondary, fontWeight: "600", flex: 1 },

  resultCard: { backgroundColor: "#fff", borderRadius: 20, padding: 32, alignItems: "center", marginBottom: 24, borderWidth: 2, borderColor: theme.surfaceContainer, borderBottomWidth: 6, borderBottomColor: theme.surfaceContainerHigh },
  resultEmoji: { fontSize: 56, marginBottom: 12 },
  resultTitle: { fontSize: 20, fontWeight: "bold", color: theme.onSurface, marginBottom: 8 },
  resultScore: { fontSize: 56, fontWeight: "900", color: theme.primary, lineHeight: 64 },
  resultLevel: { fontSize: 14, fontWeight: "700", color: theme.tertiary, backgroundColor: theme.tertiaryContainer, paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginVertical: 12 },
  resultDesc: { fontSize: 15, color: theme.onSurfaceVariant, textAlign: "center", lineHeight: 22, marginBottom: 24 },
  resultStatsRow: { flexDirection: "row", width: "100%" },
  resultStat: { flex: 1, alignItems: "center", paddingVertical: 8 },
  resultStatNum: { fontSize: 28, fontWeight: "900", color: theme.onSurface },
  resultStatLabel: { fontSize: 12, color: theme.onSurfaceVariant, marginTop: 2 },

  primaryBtn: { backgroundColor: theme.primaryContainer, padding: 18, borderRadius: 14, alignItems: "center", borderBottomWidth: 4, borderBottomColor: theme.onPrimaryFixedVariant, marginTop: 8 },
  primaryBtnText: { fontSize: 16, fontWeight: "800", color: theme.onPrimaryContainer },
  secondaryBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: theme.surfaceContainerLow, padding: 16, borderRadius: 14, gap: 8, borderBottomWidth: 3, borderBottomColor: theme.surfaceContainerHigh, marginTop: 8 },
  secondaryBtnText: { fontSize: 15, fontWeight: "700", color: theme.primary },

  evalHeader: { backgroundColor: "#fff", borderRadius: 20, padding: 28, alignItems: "center", marginBottom: 24, borderWidth: 2, borderColor: theme.surfaceContainer, borderBottomWidth: 6, borderBottomColor: theme.surfaceContainerHigh },
  evalEmoji: { fontSize: 48, marginBottom: 8 },
  evalTitle: { fontSize: 20, fontWeight: "bold", color: theme.onSurface, marginBottom: 16 },
  evalScoreCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: theme.primaryContainer + "33", borderWidth: 4, borderColor: theme.primaryContainer, alignItems: "center", justifyContent: "center", marginBottom: 12 },
  evalScoreNum: { fontSize: 30, fontWeight: "900", color: theme.primary },
  evalScoreLabel: { fontSize: 11, color: theme.onPrimaryContainer, fontWeight: "600" },
  evalSubtitle: { fontSize: 14, color: theme.onSurfaceVariant },
  sectionTitle: { fontSize: 22, fontWeight: "bold", color: theme.onSurface, marginBottom: 4 },
  sectionHint: { fontSize: 13, color: theme.onSurfaceVariant, marginBottom: 16 },

  metricCard: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 2, borderColor: theme.surfaceContainerLow, borderBottomWidth: 5, borderBottomColor: theme.surfaceContainerHigh },
  metricCardTop: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 },
  metricIconBox: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  metricInfo: { flex: 1 },
  metricLabel: { fontSize: 16, fontWeight: "700", color: theme.onSurface },
  metricDesc: { fontSize: 12, color: theme.onSurfaceVariant, marginTop: 2 },
  metricScoreBox: { alignItems: "flex-end" },
  metricScoreNum: { fontSize: 22, fontWeight: "900" },
  metricFooter: { alignItems: "flex-end", marginTop: 8 },
  metricFooterText: { fontSize: 12, color: theme.primary, fontWeight: "600" },

  prereqBanner: { flexDirection: "row", alignItems: "center", backgroundColor: theme.tertiaryContainer, borderRadius: 16, padding: 20, gap: 12, marginTop: 8, borderBottomWidth: 4, borderBottomColor: theme.onTertiaryFixedVariant },
  prereqBannerTitle: { fontSize: 15, fontWeight: "700", color: theme.onTertiaryContainer },
  prereqBannerDesc: { fontSize: 12, color: theme.onTertiaryContainer, opacity: 0.8, marginTop: 2 },

  drillHeader: { borderRadius: 16, padding: 24, alignItems: "center", marginBottom: 24 },
  drillIconBig: { width: 72, height: 72, borderRadius: 36, alignItems: "center", justifyContent: "center", marginBottom: 12 },
  drillTitle: { fontSize: 26, fontWeight: "900", marginBottom: 4 },
  drillScore: { fontSize: 14, fontWeight: "600", color: theme.onSurfaceVariant, marginBottom: 12 },
  drillDesc: { fontSize: 14, color: theme.onSurfaceVariant, textAlign: "center", marginTop: 12, lineHeight: 20 },
  tipsList: { marginBottom: 24 },
  tipItem: { flexDirection: "row", alignItems: "flex-start", gap: 12, marginBottom: 12 },
  tipNum: { width: 24, height: 24, borderRadius: 12, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  tipNumText: { fontSize: 12, fontWeight: "700", color: "#fff" },
  tipText: { fontSize: 14, color: theme.onSurface, flex: 1, lineHeight: 20, paddingTop: 2 },
  
  prereqBlock: { backgroundColor: "#fff", borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 2, borderColor: theme.surfaceContainerLow, borderBottomWidth: 5, borderBottomColor: theme.surfaceContainerHigh },
  prereqBlockHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 4 },
  prereqBlockTitle: { fontSize: 18, fontWeight: "800", color: theme.onSurface },
  prereqBlockProgress: { fontSize: 13, color: theme.onSurfaceVariant, marginBottom: 12, fontWeight: "600" },
  checklistContainer: { marginTop: 12 },
  comprehensivePrereqItem: { borderWidth: 1, borderColor: theme.surfaceContainerLow, borderRadius: 12, marginBottom: 12, backgroundColor: "#fafcfd", overflow: "hidden" },
  prereqItemHeader: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16 },
  prereqItemText: { fontSize: 16, fontWeight: "600", color: theme.onSurface, flex: 1 },
  prereqItemTextDone: { color: theme.onSurfaceVariant, textDecorationLine: "line-through", fontWeight: "400" },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: theme.outlineVariant, alignItems: "center", justifyContent: "center" },
  checkboxDone: { backgroundColor: theme.success, borderColor: theme.success },

  prereqExpandedBody: { padding: 16, paddingTop: 0, borderTopWidth: 1, borderTopColor: theme.surfaceContainerLow },
  ttsContainer: { flexDirection: "row", marginTop: 12, marginBottom: 12 },
  ttsBtn: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: theme.tertiaryContainer + "44", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: theme.tertiaryContainer },
  ttsBtnActive: { backgroundColor: theme.tertiary, borderColor: theme.tertiary },
  ttsBtnText: { fontSize: 13, fontWeight: "700", color: theme.tertiary },
  topicDescText: { fontSize: 14, color: theme.onSurface, lineHeight: 22, marginBottom: 16 },

  miniQuizBox: { backgroundColor: theme.surfaceContainerLowest, borderWidth: 1, borderColor: theme.surfaceContainer, borderRadius: 12, padding: 16 },
  miniQuizHeader: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8 },
  miniQuizTitle: { fontSize: 13, fontWeight: "800", color: theme.primary, textTransform: "uppercase" },
  miniQuizQuestion: { fontSize: 15, fontWeight: "600", color: theme.onSurface, marginBottom: 12 },
  quizOptionBtn: { flexDirection: "row", alignItems: "center", gap: 10, padding: 12, borderWidth: 1, borderColor: theme.outlineVariant, borderRadius: 8, marginBottom: 8, backgroundColor: "#fff" },
  quizOptionText: { flex: 1, fontSize: 14, color: theme.onSurface },
  markCompleteBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: theme.primaryContainer, padding: 14, borderRadius: 8, marginTop: 12, borderBottomWidth: 3, borderBottomColor: theme.onPrimaryFixedVariant },
  markCompleteText: { fontSize: 15, fontWeight: "800", color: theme.onPrimaryContainer },

  prereqIntro: { alignItems: "center", padding: 24, marginBottom: 16 },
  prereqIntroTitle: { fontSize: 22, fontWeight: "bold", color: theme.onSurface, marginTop: 12, marginBottom: 8, textAlign: 'center' },
  prereqIntroDesc: { fontSize: 14, color: theme.onSurfaceVariant, textAlign: "center", lineHeight: 22 },
  prereqGroupCard: { backgroundColor: "#fff", borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 2, borderColor: theme.surfaceContainerLow, borderBottomWidth: 5, borderBottomColor: theme.surfaceContainerHigh },
  prereqGroupHeader: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 },
  prereqGroupTitle: { fontSize: 15, fontWeight: "700", color: theme.onSurface },
  prereqGroupProgress: { fontSize: 12, fontWeight: "600" },
  prereqScorePill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  prereqScorePillText: { fontSize: 13, fontWeight: "700" },
  prereqTopicList: { marginTop: 12, gap: 8 },
  prereqTopicRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  prereqTopicText: { fontSize: 13, color: theme.onSurfaceVariant },
  prereqGroupFooter: { alignItems: "flex-end", marginTop: 12 },
  prereqGroupFooterText: { fontSize: 12, fontWeight: "700" },

  bottomNav: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: theme.surface, flexDirection: "row", justifyContent: "space-around", paddingVertical: 10, paddingBottom: 24, borderTopWidth: 4, borderTopColor: theme.surfaceContainerHigh, borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  navItem: { alignItems: "center", justifyContent: "center", paddingHorizontal: 12, paddingVertical: 4 },
  navItemActive: { backgroundColor: theme.primaryContainer, borderRadius: 12, borderBottomWidth: 4, borderBottomColor: theme.onPrimaryFixedVariant, transform: [{ translateY: -4 }] },
  navItemText: { fontSize: 11, fontWeight: "600", marginTop: 2, color: theme.onSurfaceVariant },
  
  thinProgressBg: { width: "100%", height: 6, backgroundColor: theme.surfaceContainerHigh, borderRadius: 3, overflow: "hidden" },
  thinProgressFill: { height: "100%", borderRadius: 3 },
  scoreBarBg: { width: "100%", height: 8, backgroundColor: theme.surfaceContainerHigh, borderRadius: 4, overflow: "hidden" },
  scoreBarFill: { height: "100%", borderRadius: 4 },
});
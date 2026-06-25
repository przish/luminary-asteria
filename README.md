# Lagi

> **Tutor mong lagi’t laging nandyan para sa’yo**

## About Lagi

**Lagi** is an offline-first AI study companion built for Filipino students.

It brings **zero-latency, personalized tutoring directly on your smartphone** without requiring constant internet access. Powered by on-device AI, Lagi adapts to each learner's pace, breaks down complex concepts into manageable lessons, and provides accessible academic support anywhere.

Whether you are studying on a moving jeepney, dealing with unstable province signals, or experiencing a brownout **quality education is Lagi right in your pocket.**

---

# Project Case

Accenture Project Case: AI-Powered Study Companion for Filipino Learners

Many Filipino students face barriers to quality educational support due to limited access to tutors, connectivity constraints, and language differences. Existing learning platforms often fail to accommodate diverse learning needs, particularly for students who prefer learning in Filipino or require personalized guidance aligned with their grade level.

Your challenge is to develop an AI-powered study companion that provides accessible and personalized academic assistance for Filipino learners. The solution should be capable of explaining concepts in both Filipino and English, generating practice exercises, and adapting to a student's learning level. Teams are encouraged to design solutions optimized for mobile devices and low-bandwidth environments to ensure that quality educational support is accessible to learners regardless of their location or circumstances.

---

# Key Features

## Adaptive Assessment Engine

### Based on:
- **Item Response Theory (IRT)**
- **Bayesian Knowledge Tracing (BKT)**

Lagi uses the **2-Parameter Logistic (2PL) IRT Model** to estimate a learner's ability level (`θ`) and predict the probability of answering specific questions correctly.

### Features:

### Baseline Pretest
New users begin with a low-pressure diagnostic assessment that establishes their initial learning baseline without overwhelming them.

### Pretest Evaluation
The local AI model instantly analyzes results and provides a Taglish-supported explanation of the learner's current understanding.

### Dynamic Learning Profile
A continuously updated dashboard visualizes:

- Topic mastery
- Skill progression
- Knowledge gaps
- Learning improvements over time

Powered by Bayesian Knowledge Tracing, Lagi dynamically tracks which skills are mastered and which need reinforcement.

---

# Intelligent Scaffolding & Content Delivery

## Based on:
- **Vygotsky's Zone of Proximal Development (ZPD)**

Lagi keeps learners inside their optimal learning zone — avoiding content that is either too easy or too difficult.

## Features:

### AI-Generated Learning Materials

Instead of static question banks, Lagi generates:

- Unique practice exercises
- Real-world analogies
- Taglish explanations
- Personalized summaries

The AI adjusts difficulty to maintain a target success probability range of **50%–70%**, keeping learners challenged but motivated.

---

### Prerequisite Set Choosing

When a learner struggles:

- AI detects missing foundations
- Suggests prerequisite topics
- Helps rebuild understanding before advancing

Students can also manually choose foundational modules.

---

# Memory Retention & Habit Building

## Based on:
- **Ebbinghaus Forgetting Curve**
- **Spaced Repetition**

Lagi helps prevent knowledge decay by predicting when learners are likely to forget concepts.

## Features:

### Day Tracking

Tracks:

- Learning sessions
- Daily activity
- Streaks

The system also models memory decay by lowering mastery confidence when topics are ignored over time.

---

### Weak Spot Test

Automatically triggered when:

- Knowledge decay is detected
- Performance drops
- Success probability decreases

The AI generates focused mini-tests to reinforce weak areas before forgetting happens.

---

# Zero-Latency Offline Ecosystem

## Based on:
- **Edge AI**
- **On-device inference**

Unlike traditional AI tutors that rely on cloud servers, Lagi runs AI directly on the device.

Using optimized local models such as **Google Gemma**, Lagi enables:

## Upload Learning Materials

Students can:

- Upload documents
- Scan physical modules
- Import study materials

The device processes and integrates the content completely offline.

---

## Zero-Data Execution

Because AI inference happens locally:

- No cloud dependency
- No waiting time
- Reduced data cost
- Increased privacy for student information

---

# AI Disclosure

AI tools used during development:

- **Google Stitch** — UI/UX design assistance
- **Gemini** — AI coding assistance
- **Claude** — AI coding assistance
- **GitHub Copilot** — Development assistance

### Planned AI Integration

The final implementation aims to integrate a fully local AI model using:

- **Google Gemma**
- On-device inference
- Hardware acceleration

---

# Tech Stack

## Mobile Application

- React Native
- Zustand
- SQLite

## Artificial Intelligence

- Google Gemma
- LiteRT
- Google ML Kit

## Backend / Cloud Services

- Supabase

---

# Validation: Industry Standards vs. The Lagi Edge

The pedagogical frameworks powering Lagi are not experimental; they are the gold standards used by multi-billion-dollar EdTech giants. However, existing platforms are built for first-world infrastructure. Lagi takes these proven theories and engineers them for the realities of the Philippine digital landscape.

---

## 1. Item Response Theory (IRT) & Mastery Tracking

### The Industry Standard

Platforms like **Khan Academy** and **Duolingo** use IRT to track learner mastery and adjust difficulty.

### The Lagi Edge

Duolingo and Khan Academy require continuous cloud connectivity. Every time a student answers a question, it pings a server to recalculate their score.

Lagi runs IRT calculations locally via SQLite. The adaptation happens instantly, offline, with zero server latency.

---

## 2. Spaced Repetition & The Forgetting Curve

### The Industry Standard

Apps like **Anki** and **Memrise** dominate language and medical learning by using spaced repetition algorithms to combat memory decay.

### The Lagi Edge

Anki relies solely on the user to manually self-report how hard a question was (clicking "Easy", "Hard", or "Again").

Lagi uses a powerful hybrid approach. While our psychometric engine autonomously tracks latent ability mathematically through actual problem-solving performance, we still highly value user agency.

Learners can manually click to flag topics they feel unsure about or request more practice.

This blends data-driven, automatic **"Weak Spot Tests"** with the student's own self-awareness and comfort levels.

---

## 3. Vygotsky’s ZPD & Content Scaffolding

### The Industry Standard

Quizlet (Learn Mode) attempts to keep students in their optimal learning zone by cycling through flashcards based on consecutive correct answers.

### The Lagi Edge

Quizlet is constrained by static, pre-written question banks. If a student runs out of questions, the learning stops.

Lagi uses a local LLM to generate infinite, dynamic content on the fly.

More importantly, it generates this content in Taglish with locally relatable analogies (like sari-sari store math), which Western platforms cannot do.

---

## 4. AI-Powered Tutoring

### The Industry Standard

ChatGPT and Khanmigo provide incredible, conversational AI tutoring for students who are stuck.

### The Lagi Edge

Cloud-based AI tutors are completely inaccessible to Filipino students in remote provinces, during brownouts, or when they cannot afford mobile data.

Lagi brings the AI to the Edge.

By running a quantized Gemma model entirely on mobile RAM, we deliver a premium, conversational AI tutor that costs $0 in cloud fees, works offline, and guarantees 100% data privacy for minors.

---

# Team Luminary

Developed by:

- **Christian Kent Bayani**
- **Irish May Pureza**
- **Katrina Deniesse Luna**
- **Jacob Titong**

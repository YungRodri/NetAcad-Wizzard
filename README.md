# 🧙‍♂️ NetAcad-Wizzard

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Manifest V3](https://img.shields.io/badge/Chrome_Extension-Manifest_V3-green.svg)](manifest.json)
[![Gemini API](https://img.shields.io/badge/AI-Google_Gemini-orange.svg)](https://ai.google.dev/)

Asistente y resolvedor automatizado de cuestionarios para **Cisco NetAcad** y **Skills For All**, potenciado por la inteligencia artificial de **Google Gemini**.

> 🌐 **Idiomas / Languages:** [Español](#-versión-en-español) | [English](#-english-version)

---

## 🇪🇸 Versión en Español

### 🌟 ¿Qué es NetAcad-Wizzard?

**NetAcad-Wizzard** es una extensión de navegador (Manifest V3) creada para ahorrar tiempo y automatizar la resolución de evaluaciones y cuestionarios dinámicos en las plataformas de Cisco (**NetAcad** y **Skills For All**). 

A diferencia de soluciones básicas que solo muestran texto, NetAcad-Wizzard es capaz de atravesar componentes complejos en **Shadow DOM** e *iframes*, enviar todas las preguntas juntas a la API de Gemini para ahorrar tokens, y **marcar automáticamente las respuestas correctas en pantalla**.

---

### ⚡ Características y Funciones Extra

- 🎯 **Auto-Select de Respuestas:** Selecciona y hace clic automáticamente en las opciones correctas. Compatible con:
  - Preguntas de opción única (*Single choice / Radio buttons*).
  - Preguntas de opción múltiple (*Multiple choice / Checkboxes*).
  - Preguntas de emparejar (*Object-matching / Drag & drop*).
- 🥷 **Modo Sigilo (*Stealth Mode*):** Al activarlo, la extensión oculta completamente los recuadros azules de la IA, el botón flotante y los bordes verdes. Marca las opciones de forma silenciosa e invisible sin dejar pistas en pantalla.
- 🛡️ **Auto-Fallback para Error 429 (Cuota de Google):** Google Gemini Free Tier limita cada modelo a 500 peticiones diarias. Si el modelo en uso alcanza el límite diario (Error 429), la extensión **salta automáticamente** al siguiente modelo disponible (`gemini-3.5-flash-lite`, `gemini-3.5-flash`, etc.) sin detener tu examen.
- 🚀 **Marcado Ultra Rápido:** Intervalo optimizado (~250 ms por respuesta) para que las preguntas se contesten de forma fluida y natural sin congelar el navegador.
- 📦 **Procesamiento por Lotes (*Batching*):** Agrupa todas las preguntas visibles en una sola consulta JSON a Gemini, reduciendo drásticamente el consumo de peticiones y acelerando la respuesta.
- ✋ **Control de Entrega Seguro:** La extensión marca las respuestas, pero **nunca presiona el botón final de enviar examen**, dándote control total antes de calificar.
- 🖱️ **Botón Flotante Arrastrable:** Incluye un botón circular "AI" que puedes mover libremente a cualquier parte de la pantalla para que no tape diagramas ni enunciados.

---

### ⚙️ Cómo Configurar la Extensión

#### 1. Obtener una API Key gratuita de Google Gemini:
1. Entra a [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Inicia sesión con cualquier cuenta de Google.
3. Haz clic en el botón azul **"Create API key"** (Crear clave de API).
4. Copia la clave generada (empieza por `AIzaSy...`).

#### 2. Guardar tu clave en la extensión:
1. Haz clic en el icono del mago/extensión en la barra de extensiones de tu navegador.
2. Pega tu API Key en el campo **Gemini API Key**.
3. Selecciona el modelo recomendado (**`gemini-3.5-flash-lite`**).
4. Configura tus preferencias (por ejemplo, activa el **Modo Sigilo** si no quieres que se vean los cuadros de asistencia).
5. Haz clic en **"Save Settings"**.

---

### 📦 Guía de Instalación Paso a Paso

Funciona en cualquier navegador basado en Chromium: **Google Chrome**, **Microsoft Edge**, **Brave**, **Opera**, etc.

1. **Descarga el código:**
   - Puedes clonar el repositorio:
     ```bash
     git clone https://github.com/YungRodri/NetAcad-Wizzard.git
     ```
   - O descargarlo en ZIP haciendo clic en el botón verde **Code > Download ZIP** y descomprimiéndolo en una carpeta.
2. **Abre la gestión de extensiones de tu navegador:**
   - Chrome / Brave: escribe `chrome://extensions/` en la barra de direcciones.
   - Edge: escribe `edge://extensions/`.
3. **Activa el "Modo de desarrollador":**
   - Es el interruptor ubicado en la esquina superior derecha.
4. **Carga la extensión:**
   - Haz clic en el botón **"Cargar descomprimida"** (*Load unpacked*).
   - Selecciona la carpeta donde descargaste este proyecto (la que contiene `manifest.json`).
5. **Fija la extensión:**
   - Haz clic en el icono del rompecabezas 🧩 en la barra de tu navegador y fija **NetAcad-Wizzard** para abrir sus ajustes cuando quieras.

---

### 🚀 Modo de Uso Diario

Cuando estés dentro de un examen o cuestionario de NetAcad / SkillsForAll:

1. **Atajo rápido (Recomendado):**
   - Presiona **`Alt + Shift + Q`** en Windows/Linux (o **`Option + Shift + Q`** en Mac).
   - En menos de 2 segundos, todas las preguntas de la página serán analizadas y marcadas.
2. **Botón en pantalla:**
   - Haz clic sobre el botón flotante circular **"AI"**.
3. **Menú de la extensión:**
   - Abre el popup de la extensión y presiona el botón verde **"Process Questions on this Page"**.

---

### 🎛️ Opciones del Menú (Popup)

| Ajuste | Por Defecto | Función |
| :--- | :---: | :--- |
| **Gemini API Key** | Vacío | Tu clave personal de Gemini. Se guarda de forma segura en tu navegador. |
| **Gemini Model** | `gemini-3.5-flash-lite` | Modelo de IA para resolver. Recomendado por su balance entre velocidad y cuota libre. |
| **Show AI Answers** | `Activado` | Muestra un recuadro azul explicativo con el razonamiento debajo de cada pregunta. |
| **Auto-select Answers** | `Activado` | Hace clic y marca automáticamente las opciones correctas en el examen. |
| **Modo Sigilo** | `Desactivado` | Oculta los recuadros de la IA, el botón flotante y los bordes verdes. Solo marca las respuestas silenciosamente. |
| **Process on Page Switch** | `Activado` | Si avanzas a otra pregunta, detecta el cambio automáticamente. |

---

<br>

---

## 🇬🇧 English Version

### 🌟 What is NetAcad-Wizzard?

**NetAcad-Wizzard** is a Manifest V3 browser extension built to automate and streamline answering dynamically loaded quizzes and exams on Cisco platforms (**Cisco NetAcad** and **Skills For All**).

Unlike basic scripts that only scrape text, NetAcad-Wizzard traverses deep **Shadow DOM** and nested *iframes*, batches questions into structured JSON payloads for **Google Gemini AI**, and **automatically selects the correct options on screen**.

---

### ⚡ Key & Enhanced Features

- 🎯 **Auto-Select Answers:** Automatically simulates mouse click events on the correct choices. Supports:
  - Single-choice questions (radio buttons).
  - Multiple-choice questions (checkboxes).
  - Matching questions (*object-matching / category pairing*).
- 🥷 **Stealth Mode:** Hides the AI assistant boxes, the floating button, and green border outlines. Answers are selected silently without leaving any visual clues on screen.
- 🛡️ **Error 429 Quota Fallback:** Google Gemini limits free tier users to 500 requests per day per model. If a model reaches its quota limit, NetAcad-Wizzard automatically falls back to the next available model (`gemini-3.5-flash-lite`, `gemini-3.5-flash`, etc.) without breaking your exam.
- 🚀 **High-Speed Marking:** Optimized delay (~250 ms per option) to ensure natural yet fast marking without UI lag or freezes.
- 📦 **Batch Question Processing:** All questions on the current page are packaged into a single JSON API request, saving up to 90% of token usage and speeding up response times.
- ✋ **Safe Exam Submission:** The extension automatically fills in the answers, but **never clicks the final submit button**, leaving submission control in your hands.
- 🖱️ **Draggable Floating Button:** A lightweight circular "AI" button on screen that you can drag anywhere so it doesn't obstruct diagrams.

---

### ⚙️ How to Configure

#### 1. Get a Free Google Gemini API Key:
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Sign in with your Google account.
3. Click **"Create API key"**.
4. Copy your API key (starts with `AIzaSy...`).

#### 2. Save your key into the extension:
1. Click the NetAcad-Wizzard extension icon in your browser toolbar.
2. Paste your API Key into the **Gemini API Key** field.
3. Select the recommended model (**`gemini-3.5-flash-lite`**).
4. Customize your toggles (e.g. enable **Stealth Mode** if you want invisible operation).
5. Click **"Save Settings"**.

---

### 📦 Step-by-Step Installation

Compatible with any Chromium-based browser (**Chrome**, **Edge**, **Brave**, **Opera**, etc.):

1. **Clone or Download the repo:**
   ```bash
   git clone https://github.com/YungRodri/NetAcad-Wizzard.git
   ```
   Or download as ZIP (**Code > Download ZIP**) and extract it.
2. **Open your browser extensions manager:**
   - Chrome / Brave: `chrome://extensions/`
   - Edge: `edge://extensions/`
3. **Enable "Developer mode":**
   - Toggle the switch in the top-right corner.
4. **Load the extension:**
   - Click **"Load unpacked"** in the top-left corner.
   - Select the folder where this project is located (the folder containing `manifest.json`).
5. **Pin the extension:**
   - Click the extensions puzzle icon 🧩 in the toolbar and pin NetAcad-Wizzard.

---

### 🚀 Daily Usage

While inside a NetAcad or SkillsForAll assessment:

1. **Keyboard Shortcut (Recommended):**
   - Press **`Alt + Shift + Q`** on Windows/Linux (or **`Option + Shift + Q`** on macOS).
   - In 1 to 2 seconds, all questions on the page will be resolved and marked.
2. **On-screen Floating Button:**
   - Click the circular blue **"AI"** button.
3. **Popup Menu:**
   - Click the extension icon and hit **"Process Questions on this Page"**.

---

### 🎛️ Popup Settings

| Setting | Default | Description |
| :--- | :---: | :--- |
| **Gemini API Key** | Empty | Your personal Gemini API key, stored locally in your browser storage. |
| **Gemini Model** | `gemini-3.5-flash-lite` | Active AI model. Highly recommended for its fast response and generous free quota. |
| **Show AI Answers** | `Enabled` | Shows a blue box below each question with the AI's reasoning. |
| **Auto-select Answers** | `Enabled` | Automatically clicks and marks the correct options on the quiz page. |
| **Modo Sigilo (Stealth Mode)** | `Disabled` | Hides all assistant boxes, the floating button, and outlines. Selects answers completely invisibly. |
| **Process on Page Switch** | `Enabled` | Automatically scrapes new questions when navigating between lesson pages. |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

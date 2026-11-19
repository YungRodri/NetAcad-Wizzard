const DEFAULT_GEMINI_MODEL = "gemini-3.5-flash-lite";
const DEFAULT_GEMINI_API_KEY = "";

const FALLBACK_MODELS = [
  "gemini-3.5-flash-lite",
  "gemini-3.5-flash",
  "gemini-3.1-flash-lite",
];

function buildGeminiUrl(model) {
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
}

async function getProviderConfig() {
  const stored = await chrome.storage.sync.get(["geminiApiKey", "geminiModel"]);
  return {
    apiKey: stored.geminiApiKey || DEFAULT_GEMINI_API_KEY,
    model: stored.geminiModel || DEFAULT_GEMINI_MODEL,
  };
}

async function getAiAnswer(question, answers, apiKey) {
  const cfg = await getProviderConfig();
  const effectiveKey = apiKey || cfg.apiKey;
  if (!effectiveKey) {
    return "Error: Gemini API Key not available. Please set it in the extension popup.";
  }

  let prompt = `Given the following multiple-choice question and its possible answers, please choose the best answer(s).
If the question implies multiple correct answers (e.g., 'select all that apply', 'choose N correct options'), return ALL chosen answer texts, each on a new line.
Otherwise, if it's a single-choice question, return only the text of the single best chosen answer option.
Do not add any extra explanation or leading text like "The best answer is: ".

Question:
${question}

Possible Answers:
`;
  answers.forEach((ans, i) => {
    prompt += `${i + 1}. ${ans}\n`;
  });

  const modelsToTry = [cfg.model, ...FALLBACK_MODELS.filter((m) => m !== cfg.model)];

  for (const model of modelsToTry) {
    try {
      const response = await fetch(buildGeminiUrl(model), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": effectiveKey,
        },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      });

      if (response.status === 429) {
        console.warn(`Gemini Model ${model} quota exceeded (429). Trying fallback...`);
        continue;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Gemini API Error:", errorData);
        return `Error calling Gemini API: ${response.status} ${response.statusText}.`;
      }
      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        console.error("Unexpected Gemini response:", data);
        return "Error: Could not extract answer from Gemini response.";
      }
      if (model !== cfg.model) {
        chrome.storage.sync.set({ geminiModel: model });
      }
      return text.trim();
    } catch (error) {
      console.error(`Error fetching from Gemini API with model ${model}:`, error);
    }
  }

  return "Error: Cuota diaria de Gemini excedida en todos los modelos disponibles (429). Espera a que se reinicie o cambia de cuenta.";
}

function buildBatchPrompt(questionsDataArray) {
  let prompt =
    "You will be provided with a JSON array of questions. Most are multiple-choice; some are MATCHING questions (their text starts with 'MATCHING QUESTION.').\n";
  prompt +=
    "For multiple-choice: choose the best answer(s) from 'possible_answers'. If 'select all that apply' / 'choose N', concatenate all correct answer texts separated by ' /// ' (space, three slashes, space). Otherwise return single answer text.\n";
  prompt +=
    "For MATCHING questions: read the embedded Categories and Options. Return the answer as 'A: <option text> /// B: <option text> /// ...' in CATEGORY ORDER (A, B, C, D, ...), using the EXACT option text from the question.\n";
  prompt +=
    "Return a single JSON array of strings, one per input question, in input order. No extra explanation, no leading/trailing text.\n";
  prompt +=
    'Example output: ["Text of MCQ answer", "Answer A /// Answer C", "A: option text for A /// B: option text for B /// C: option text for C /// D: option text for D"].\n\n';
  prompt += "Here are the questions:\n```json\n";
  const questionsForPrompt = questionsDataArray.map((q, index) => ({
    id: `question_${index + 1}`,
    question_text: q.question,
    possible_answers: q.answers,
  }));
  prompt += JSON.stringify(questionsForPrompt, null, 2);
  prompt += "\n```";
  return prompt;
}

function parseBatchAnswers(rawText, expectedCount) {
  let txt = rawText.trim();
  const fence = txt.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
  if (fence) txt = fence[1];
  let parsed;
  try {
    parsed = JSON.parse(txt);
  } catch (e) {
    return { error: "Error: Could not parse AI response for batch. Raw: " + rawText };
  }
  if (!Array.isArray(parsed) || !parsed.every((x) => typeof x === "string")) {
    return { error: "Error: AI response was not a valid JSON array of answer strings." };
  }
  if (parsed.length !== expectedCount) {
    return { error: "Error: Mismatch in number of answers from AI.", answers: parsed };
  }
  return { answers: parsed };
}

async function getAiAnswersForBatch(questionsDataArray, apiKey) {
  const cfg = await getProviderConfig();
  const effectiveKey = apiKey || cfg.apiKey;
  if (!effectiveKey) {
    return { error: "Error: Gemini API Key not available. Please set it in the extension popup." };
  }
  if (!questionsDataArray || questionsDataArray.length === 0) {
    return { answers: [] };
  }

  const prompt = buildBatchPrompt(questionsDataArray);
  const modelsToTry = [cfg.model, ...FALLBACK_MODELS.filter((m) => m !== cfg.model)];

  let lastError = null;

  for (const model of modelsToTry) {
    try {
      const response = await fetch(buildGeminiUrl(model), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": effectiveKey,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" },
        }),
      });

      if (response.status === 429) {
        console.warn(`Gemini Batch: Model ${model} quota exceeded (429). Trying fallback model...`);
        lastError = "Cuota diaria excedida (429) en el modelo actual. Probando siguiente modelo...";
        continue;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Gemini Batch Error:", errorData);
        return {
          error: `Error calling Gemini API: ${response.status} ${response.statusText}. Details: ${JSON.stringify(errorData)}`,
        };
      }
      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        console.error("Unexpected Gemini batch response:", data);
        return { error: "Error: Could not extract answers from Gemini batch response." };
      }

      if (model !== cfg.model) {
        chrome.storage.sync.set({ geminiModel: model });
      }

      return parseBatchAnswers(text, questionsDataArray.length);
    } catch (error) {
      console.error(`Error fetching from Gemini batch API with model ${model}:`, error);
      lastError = error.toString();
    }
  }

  return {
    error: `Error 429: Cuota diaria de peticiones de Gemini alcanzada en todos los modelos. Espera a que se reinicie o crea una nueva API Key. (${lastError})`,
  };
}

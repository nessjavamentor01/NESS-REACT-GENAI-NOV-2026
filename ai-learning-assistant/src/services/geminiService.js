const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL = import.meta.env.VITE_GEMINI_MODEL;
const MAX_PREVIOUS_TURNS = 10;
const REQUEST_TIMEOUT_MS = 30000;

function getHttpError(status, data, retryAfterMs) {
  const apiMessage = data?.error?.message;
  const invalidApiKey =
    data?.error?.status === "API_KEY_INVALID" ||
    (typeof apiMessage === "string" &&
      /api[\s_-]*key/i.test(apiMessage) &&
      /(not valid|invalid)/i.test(apiMessage));

  let message;
  if (status === 400 && invalidApiKey) {
    message =
      "Gemini API rejected the API key. Check that the configured key is valid.";
  } else {
    switch (status) {
      case 400:
        message =
          "Gemini API rejected the request (HTTP 400). Check the prompt and model configuration.";
        break;
      case 401:
      case 403:
        message = `Gemini API authentication or permission failed (HTTP ${status}). Check the API key and its access.`;
        break;
      case 429:
        message =
          "Gemini API rate limit or quota exceeded (HTTP 429). Wait and try again.";
        break;
      case 500:
        message =
          "Gemini API encountered a server error (HTTP 500). Try again later.";
        break;
      case 503:
        message =
          "Gemini API is temporarily unavailable (HTTP 503). Try again shortly.";
        break;
      default:
        message = `Gemini API request failed with HTTP ${status}.`;
    }
  }

  const error = new Error(message);
  error.status = status;
  error.retryAfterMs = retryAfterMs;
  return error;
}

function getRetryAfterMs(response) {
  const retryAfter = response.headers?.get?.("Retry-After");
  if (!retryAfter) {
    return null;
  }

  const seconds = Number(retryAfter);
  if (Number.isFinite(seconds) && seconds >= 0) {
    return seconds * 1000;
  }

  const retryAt = Date.parse(retryAfter);
  return Number.isNaN(retryAt) ? null : Math.max(0, retryAt - Date.now());
}

function getMessageText(message) {
  if (!Array.isArray(message?.parts)) {
    return "";
  }

  return message.parts
    .filter((part) => typeof part?.text === "string")
    .map((part) => part.text)
    .join("")
    .trim();
}

function getPreviousContents(previousMessages) {
  if (!Array.isArray(previousMessages)) {
    throw new Error("Previous conversation messages must be an array.");
  }

  const turns = [];
  for (let index = 0; index < previousMessages.length - 1; index += 1) {
    const userMessage = previousMessages[index];
    const modelMessage = previousMessages[index + 1];

    if (userMessage?.role !== "user" || modelMessage?.role !== "model") {
      continue;
    }

    const userText = getMessageText(userMessage);
    const modelText = getMessageText(modelMessage);
    if (!userText || !modelText) {
      continue;
    }

    turns.push([
      { role: "user", parts: [{ text: userText }] },
      { role: "model", parts: [{ text: modelText }] },
    ]);
    index += 1;
  }

  return turns.slice(-MAX_PREVIOUS_TURNS).flat();
}

/**
 * Generates a response from Google Gemini for a learning-assistant prompt.
 */
export async function generateAIResponse(
  prompt,
  category,
  previousMessages = [],
) {
  if (typeof prompt !== "string" || prompt.trim() === "") {
    throw new Error("Prompt is required.");
  }

  if (!API_KEY) {
    throw new Error("Missing VITE_GEMINI_API_KEY environment variable.");
  }

  if (!MODEL) {
    throw new Error("Missing VITE_GEMINI_MODEL environment variable.");
  }

  const selectedCategory =
    typeof category === "string" && category.trim() !== ""
      ? category.trim()
      : "General";
  const previousContents = getPreviousContents(previousMessages);

  const endpoint =
    `https://generativelanguage.googleapis.com/v1beta/models/` +
    `${encodeURIComponent(MODEL)}:generateContent`;

  let response;
  let data;
  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    REQUEST_TIMEOUT_MS,
  );

  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "x-goog-api-key": API_KEY,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        system_instruction: {
          parts: [
            {
              text: `You are an experienced programming trainer. The selected technology category is "${selectedCategory}".
Explain concepts in simple language and tailor your answers to this category.
 Use practical examples and include code when it helps explain the answer.
  Organize responses with clear headings. When interview questions are requested, provide relevant questions and answers. Keep responses focused and avoid unnecessary explanations.`,
            },
          ],
        },
        contents: [
          ...previousContents,
          {
            role: "user",
            parts: [{ text: prompt.trim() }],
          },
        ],
      }),
    });
    try {
      data = await response.json();
    } catch (parseError) {
      if (controller.signal.aborted) {
        throw parseError;
      }
      if (response.ok) {
        throw new Error(
          "Gemini API returned a response that was not valid JSON.",
          { cause: parseError },
        );
      }
      data = null;
    }
  } catch (error) {
    if (error?.name === "AbortError" || controller.signal.aborted) {
      throw new Error(
        `Gemini API request timed out after ${REQUEST_TIMEOUT_MS / 1000} seconds.`,
        { cause: error },
      );
    }
    if (response) {
      throw error;
    }
    throw new Error(
      "Unable to reach the Gemini API. Check your network connection and try again.",
      { cause: error },
    );
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    throw getHttpError(
      response.status,
      data,
      getRetryAfterMs(response),
    );
  }

  const candidates = data?.candidates;
  if (!Array.isArray(candidates) || candidates.length === 0) {
    throw new Error("Gemini API returned no response candidates.");
  }

  const content = candidates[0]?.content;
  if (!content || typeof content !== "object") {
    throw new Error("Gemini API response candidate did not include content.");
  }

  const parts = content.parts;
  if (!Array.isArray(parts) || parts.length === 0) {
    throw new Error("Gemini API response did not include any content parts.");
  }

  const textParts = parts
    .filter((part) => typeof part?.text === "string")
    .map((part) => part.text.trim())
    .filter(Boolean);

  if (textParts.length === 0) {
    throw new Error("Gemini API response contained no usable text.");
  }

  const answer = textParts.join("");
  return answer;
}

import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GEMINI_MODEL_NAME, GEMINI_SAFETY_SETTINGS } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY de Gemini no encontrada en process.env.API_KEY. El servicio Gemini no funcionará.");
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

export const getGeminiAdvice = async (prompt: string): Promise<string> => {
  if (!ai) {
    console.error("Gemini AI client no está inicializado debido a la falta de API Key.");
    return "Error: El servicio de IA no está disponible en este momento (API Key faltante).";
  }

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: prompt,
      // safetySettings: GEMINI_SAFETY_SETTINGS, // Removed: Not a direct property of GenerateContentParameters
      config: {
        temperature: 0.7, // Adjust for creativity vs. factuality
        topK: 40,
        topP: 0.95,
        // thinkingConfig: { thinkingBudget: 0 } // For low latency if needed, otherwise omit for higher quality
      }
    });

    const text = response.text;
    if (text) {
      return text;
    } else {
      // This case should ideally be handled by Gemini's response structure or an error.
      // Checking for other potential parts if .text is empty, though .text is the primary way.
      console.warn("Respuesta de Gemini recibida, pero .text está vacío o indefinido.", response);
      return "No se pudo generar una respuesta clara desde la IA. Intenta reformular tu solicitud.";
    }
  } catch (error: any) {
    console.error("Error al llamar a la API de Gemini:", error);
    // Provide more specific error messages if possible by inspecting the error object
    if (error.message && error.message.includes('API key not valid')) {
        return "Error: La API Key de Gemini no es válida. Por favor, verifica la configuración.";
    }
    return `Error al comunicarse con el servicio de IA: ${error.message || 'Error desconocido'}.`;
  }
};

// Example of how to parse JSON if responseMimeType: "application/json" was used
// export const getGeminiJsonResponse = async (prompt: string): Promise<any | null> => {
//   // ... (initialization and API call with responseMimeType: "application/json")
//   // const response = await ai.models.generateContent({..., config: { responseMimeType: "application/json" }});
//   // let jsonStr = response.text.trim();
//   // const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
//   // const match = jsonStr.match(fenceRegex);
//   // if (match && match[2]) {
//   //   jsonStr = match[2].trim();
//   // }
//   // try {
//   //   return JSON.parse(jsonStr);
//   // } catch (e) {
//   //   console.error("Failed to parse JSON response from Gemini:", e, "Raw string:", jsonStr);
//   //   return null;
//   // }
//   return null; // Placeholder
// };

export default getGeminiAdvice;

export interface GeminiModel {
  name: string;
  version: string;
  displayName: string;
  description: string;
}

const PREFERRED_MODELS = [
  "models/gemini-2.5-flash-lite",
  "models/gemini-2.5-flash",
  "models/gemini-1.5-flash",
  "models/gemini-2.0-flash-exp"
];

const DEFAULT_MODEL = "gemini-1.5-flash";

export const modelDiscoveryService = {
  async getPrioritizedModels(): Promise<string[]> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return [DEFAULT_MODEL];

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
        { method: 'GET' }
      );

      if (!response.ok) return [DEFAULT_MODEL];

      const data = await response.json();
      const availableModels: GeminiModel[] = data.models || [];
      const availableNames = availableModels.map(m => m.name);

      const found = PREFERRED_MODELS
        .filter(name => availableNames.includes(name))
        .map(name => name.replace('models/', ''));

      return found.length > 0 ? found : [DEFAULT_MODEL];
    } catch (error) {
      return [DEFAULT_MODEL];
    }
  }
};

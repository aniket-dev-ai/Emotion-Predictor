// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface PredictionResponse {
  predicted_emotion: string;
  confidence: number;
  all_probabilities: Record<string, number>;
}

export const api = {
  async checkHealth() {
    const res = await fetch(`${API_BASE_URL}/health`);
    return res.json();
  },

  async predictText(text: string): Promise<PredictionResponse> {
    const res = await fetch(`${API_BASE_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) throw new Error("Failed to analyze text");
    return res.json();
  },

  async predictImage(file: File): Promise<PredictionResponse> {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(`${API_BASE_URL}/predict-image`, {
      method: "POST",
      body: formData,
    });

    // Read response exactly as returned by FastAPI
    const responseText = await res.text();

    console.log("Image API status:", res.status);
    console.log("Image API response:", responseText);

    if (!res.ok) {
      throw new Error(responseText || `Image analysis failed (${res.status})`);
    }

    return JSON.parse(responseText);
  },
};

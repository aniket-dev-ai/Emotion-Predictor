// components/playground.tsx
"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  UploadCloud,
  Type,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { api, PredictionResponse } from "../lib/api";
import Image from "next/image";

const EMOTION_EMOJIS: Record<string, string> = {
  joy: "😊",
  sadness: "😢",
  anger: "😠",
  fear: "😨",
  surprise: "😲",
  love: "🥰",
};

export function Playground() {
  const [tab, setTab] = useState<"text" | "image">("text");

  // Text state
  const [input, setInput] = useState("");

  // Image state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // General state
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState("");
  const [result, setResult] = useState<PredictionResponse | null>(null);

  // --- Handlers ---

  const handleAnalyzeText = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      setLoadingStage("Analyzing text...");
      setTimeout(() => setLoadingStage("Running BiGRU inference..."), 800);
      const data = await api.predictText(input);
      setResult(data);
    } catch (error) {
      console.error("Text analysis failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeImage = async () => {
    if (!imageFile) return;
    setLoading(true);
    setResult(null);
    try {
      setLoadingStage("Extracting text from image...");
      setTimeout(() => setLoadingStage("Analyzing extracted text..."), 1200);
      const data = await api.predictImage(imageFile);
      setResult(data);
    } catch (error) {
      console.error("Image analysis failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setResult(null); // Reset previous results
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setResult(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto glass-panel rounded-3xl p-6 md:p-8">
      {/* Tabs */}
      <div className="flex space-x-2 bg-black/20 p-1 rounded-2xl w-fit mb-8 border border-white/5">
        <button
          onClick={() => {
            setTab("text");
            setResult(null); // Optional: clear result on tab switch
          }}
          className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
            tab === "text"
              ? "bg-white/10 text-white shadow-sm"
              : "text-neutral-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Type size={16} /> <span>Text Analysis</span>
        </button>
        <button
          onClick={() => {
            setTab("image");
            setResult(null);
          }}
          className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
            tab === "image"
              ? "bg-white/10 text-white shadow-sm"
              : "text-neutral-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <UploadCloud size={16} /> <span>Image OCR</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-4">
          {tab === "text" ? (
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type something like:&#10;'I am extremely happy today...'"
                className="w-full h-48 bg-black/20 border border-white/10 rounded-2xl p-5 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all resize-none"
              />
              <div className="absolute bottom-4 right-4 text-xs text-neutral-500">
                {input.length} / 1000
              </div>
            </div>
          ) : (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => !imagePreview && fileInputRef.current?.click()}
              className={`h-48 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all relative overflow-hidden ${
                imagePreview
                  ? "border-transparent bg-black/40"
                  : "border-white/10 bg-black/20 hover:bg-white/5 cursor-pointer group"
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />

              {imagePreview ? (
                <>
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover opacity-60"
                  />

                  <button
                    onClick={clearImage}
                    className="absolute top-3 right-3 p-1.5 bg-black/50 hover:bg-red-500/80 text-white rounded-full transition-colors backdrop-blur-md"
                  >
                    <X size={16} />
                  </button>
                  <div className="absolute bottom-3 left-3 bg-black/50 px-3 py-1.5 rounded-lg backdrop-blur-md flex items-center space-x-2">
                    <ImageIcon size={14} className="text-white" />
                    <span className="text-xs font-medium text-white truncate max-w-[150px]">
                      {imageFile?.name}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <UploadCloud
                    className="text-neutral-500 group-hover:text-white transition-colors mb-2"
                    size={32}
                  />
                  <span className="text-sm text-neutral-400">
                    Drag & drop or click to upload
                  </span>
                </>
              )}
            </div>
          )}

          <button
            onClick={tab === "text" ? handleAnalyzeText : handleAnalyzeImage}
            disabled={
              loading ||
              (tab === "text" && !input.trim()) ||
              (tab === "image" && !imageFile)
            }
            className="w-full py-4 bg-white text-black font-semibold rounded-2xl hover:bg-neutral-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                <span>{loadingStage}</span>
              </>
            ) : (
              <span>
                {tab === "text" ? "Analyze Emotion" : "Extract & Analyze"}
              </span>
            )}
          </button>
        </div>

        {/* Results Section */}
        <div className="relative h-full min-h-62.5">
          <AnimatePresence mode="wait">
            {!result && !loading && (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 border border-white/5 rounded-2xl flex items-center justify-center bg-black/10"
              >
                <span className="text-neutral-500 text-sm">
                  Results will appear here
                </span>
              </motion.div>
            )}

            {result && !loading && (
              <motion.div
                key="result-state"
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="glass-panel p-6 rounded-2xl h-full flex flex-col"
              >
                <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                  <div>
                    <p className="text-xs text-neutral-400 mb-1 uppercase tracking-wider">
                      Primary Emotion
                    </p>
                    <h3 className="text-3xl font-bold text-white capitalize flex items-center gap-3">
                      {EMOTION_EMOJIS[result.predicted_emotion] || "🧠"}{" "}
                      {result.predicted_emotion}
                    </h3>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-neutral-400 mb-1 uppercase tracking-wider">
                      Confidence
                    </p>
                    <p className="text-xl font-mono text-white">
                      {(result.confidence * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div className="space-y-3 grow">
                  {Object.entries(
                    result.all_probabilities as Record<string, number>,
                  )
                    .sort(([, a], [, b]) => b - a)
                    .map(([emotion, prob]) => (
                      <div key={emotion} className="flex items-center text-sm">
                        <span className="w-20 text-neutral-400 capitalize">
                          {emotion}
                        </span>
                        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden mx-3">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${prob * 100}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className={`h-full rounded-full ${
                              prob > 0.5 ? "bg-white" : "bg-neutral-500"
                            }`}
                          />
                        </div>
                        <span className="w-12 text-right font-mono text-neutral-400">
                          {(prob * 100).toFixed(1)}%
                        </span>
                      </div>
                    ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

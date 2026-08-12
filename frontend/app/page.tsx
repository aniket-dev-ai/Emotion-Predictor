// app/page.tsx 
import { ArrowRight, Activity, Database, Brain, GitBranch } from "lucide-react";
import { Playground } from "./components/playground";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center pt-32 pb-24 px-6 overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-white/[0.03] blur-[120px] rounded-full pointer-events-none" />

      {/* Hero Section */}
      <div className="max-w-4xl w-full text-center z-10 space-y-8 mb-24">
        {/* Status Pills */}
        <div className="flex items-center justify-center space-x-3 mb-6">
          <span className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-xs font-medium flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span>API Online</span>
          </span>
          <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-neutral-300">
            BiGRU Model Loaded
          </span>
          <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-neutral-300">
            OCR Ready
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-500">
          Emotion Intelligence, <br />
          <span className="italic font-light">Powered by Deep Learning.</span>
        </h1>

        <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto font-light leading-relaxed">
          A deep-learning based emotion classification system that analyzes text
          and image-based text to identify emotional signals with high
          precision.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button className="px-8 py-4 bg-white text-black rounded-full font-medium hover:scale-105 transition-transform flex items-center gap-2">
            Try the Model <ArrowRight size={18} />
          </button>
          <button className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full font-medium hover:bg-white/10 transition-colors">
            Explore ML Analysis
          </button>
        </div>
      </div>

      {/* Metrics Section */}
      <div className="w-full max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 z-10 mb-32">
        <MetricCard icon={<Activity />} value="92.25%" label="Test Accuracy" />
        <MetricCard icon={<Database />} value="20K" label="Dataset Samples" />
        <MetricCard icon={<Brain />} value="6" label="Emotion Classes" />
        <MetricCard icon={<GitBranch />} value="BiGRU" label="Final Model" />
      </div>

      {/* Pipeline Visualization */}
      <div className="w-full max-w-5xl z-10 mb-32">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">From Input to Emotion</h2>
          <p className="text-neutral-400">
            The complete end-to-end inference pipeline.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full relative before:absolute before:top-1/2 before:-translate-y-1/2 before:left-0 before:w-full before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent hidden md:flex">
          {[
            "Input (Text/Img)",
            "OCR / Extract",
            "Preprocess",
            "Tokenize",
            "BiGRU Model",
            "Prediction",
          ].map((step, idx) => (
            <div
              key={idx}
              className="relative z-10 glass-panel px-4 py-3 rounded-2xl hover:scale-110 hover:border-white/30 transition-all cursor-default group"
            >
              <span className="text-sm font-medium text-neutral-300 group-hover:text-white">
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Playground Section */}
      <div className="w-full z-10" id="playground">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Live Model Playground</h2>
          <p className="text-neutral-400">
            Test the model in real-time using text or image uploads.
          </p>
        </div>
        <Playground />
      </div>
    </main>
  );
}

function MetricCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="glass-panel p-6 rounded-3xl flex flex-col items-center justify-center text-center hover:bg-white/[0.08] transition-colors group">
      <div className="text-neutral-500 group-hover:text-white transition-colors mb-4">
        {icon}
      </div>
      <h4 className="text-4xl font-bold text-white mb-1">{value}</h4>
      <p className="text-sm text-neutral-400 font-medium">{label}</p>
    </div>
  );
}

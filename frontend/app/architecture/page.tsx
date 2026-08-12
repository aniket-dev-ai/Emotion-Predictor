// app/architecture/page.tsx
"use client";
import { motion } from "framer-motion";

const ARCHITECTURE_LAYERS = [
  { name: "Input Text", desc: "Raw string sequences" },
  { name: "Tokenizer", desc: "Converts text to integer sequences" },
  { name: "Sequence Padding", desc: "Ensures uniform input length (max_len)" },
  { name: "Embedding Layer", desc: "Maps vocab to dense dense vectors" },
  {
    name: "Bidirectional GRU",
    desc: "Processes sequence left-to-right & right-to-left",
  },
  { name: "Dropout (0.3)", desc: "Prevents overfitting" },
  { name: "Bidirectional GRU", desc: "Deepens context extraction" },
  { name: "Dropout (0.3)", desc: "Further regularization" },
  { name: "Dense Layer", desc: "Fully connected output layer" },
  { name: "Softmax", desc: "Converts logits to probabilities" },
  { name: "6 Emotions", desc: "Final classification output" },
];

export default function ArchitecturePage() {
  return (
    <div className="pt-32 pb-24 px-6 max-w-3xl mx-auto">
      <div className="mb-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Model Architecture</h1>
        <p className="text-neutral-400">
          Visualizing the forward pass of the BiGRU network.
        </p>
      </div>

      <div className="flex flex-col items-center space-y-4 relative before:absolute before:inset-y-0 before:left-1/2 before:-translate-x-1/2 before:w-px before:bg-white/10 before:z-0">
        {ARCHITECTURE_LAYERS.map((layer, index) => (
          <motion.div
            key={layer.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="z-10 group"
          >
            <div className="glass-panel px-8 py-4 rounded-2xl w-72 text-center relative hover:scale-105 transition-transform cursor-pointer border-white/5 hover:border-white/30 bg-black/40 hover:bg-white/10">
              <h3 className="font-semibold text-white">{layer.name}</h3>

              {/* Tooltip on hover */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-64 p-3 bg-neutral-900 border border-white/10 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-xl z-50">
                <p className="text-sm text-neutral-300">{layer.desc}</p>
              </div>
            </div>
            {index !== ARCHITECTURE_LAYERS.length - 1 && (
              <div className="h-6 w-px bg-white/20 mx-auto my-2" />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

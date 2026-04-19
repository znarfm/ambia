"use client";

import React from "react";
import { X } from "lucide-react";

interface TimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TimerModal: React.FC<TimerModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative w-full max-w-sm bg-surface-container-high border border-white/10 rounded-2xl p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>
        
        <h3 className="text-xl font-bold tracking-tight mb-2">Custom Timer</h3>
        <p className="text-on-surface-variant text-sm mb-8">Set a duration for your soundscape.</p>
        
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label 
              htmlFor="duration"
              className="text-[10px] uppercase tracking-widest font-bold text-primary/60"
            >
              Duration (Minutes)
            </label>
            <input 
              id="duration"
              type="number" 
              placeholder="e.g. 45"
              className="bg-surface-container-highest border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-primary/30 transition-colors"
            />
          </div>
          
          <button 
            onClick={onClose}
            className="w-full py-4 bg-primary text-zinc-950 font-bold rounded-xl hover:bg-primary-dim transition-colors"
          >
            Set Timer
          </button>
        </div>
      </div>
    </div>
  );
};

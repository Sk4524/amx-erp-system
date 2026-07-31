"use client";

import { motion } from "framer-motion";

import {
  Inbox,
  Sparkles,
} from "lucide-react";
interface EmptyStateProps {
  title: string;
  description: string;

  buttonText?: string;
  onButtonClick?: () => void;
}
export default function EmptyState({
  title,
  description,
  buttonText,
  onButtonClick,
}: EmptyStateProps) {

  return (

  <motion.div
    initial={{
      opacity: 0,
      y: 20,
    }}
    animate={{
      opacity: 1,
      y: 0,
    }}
    transition={{
      duration: 0.45,
    }}
    className="relative overflow-hidden rounded-[36px] border border-white/50 bg-white/80 backdrop-blur-2xl px-10 py-20 text-center shadow-[0_20px_60px_rgba(0,0,0,.08)]"
  >

    {/* TOP BORDER */}

    <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-violet-500 via-cyan-500 to-emerald-500" />

    {/* GLOW */}

    <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-cyan-400/15 blur-3xl" />

    <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-violet-400/15 blur-3xl" />

    <div className="relative z-10 flex flex-col items-center">

      {/* ICON */}

      <div className="relative">

        <div className="absolute inset-0 rounded-full bg-cyan-400/30 blur-2xl" />

        <div className="relative flex h-24 w-24 items-center justify-center rounded-[30px] bg-gradient-to-br from-cyan-500 via-blue-500 to-violet-500 text-white shadow-[0_15px_40px_rgba(59,130,246,.35)]">

          <Inbox size={42} />

        </div>

      </div>

      {/* BADGE */}

      <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700">

        <Sparkles size={16} />

        Enterprise ERP

      </div>

      {/* TITLE */}

      <h2 className="mt-6 text-4xl font-black text-slate-900">

        {title}

      </h2>

      {/* DESCRIPTION */}

      <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-500">

        {description}

      </p>

      {/* BUTTON */}

      {buttonText && onButtonClick && (

        <button
          onClick={onButtonClick}
          className="mt-10 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 px-8 py-4 font-bold text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
        >

          {buttonText}

        </button>

      )}

    </div>

  </motion.div>

);

}
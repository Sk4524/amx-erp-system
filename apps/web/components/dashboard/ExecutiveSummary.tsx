"use client";

type Props = {

  executiveSummary: string;

};

export default function ExecutiveSummary({

  executiveSummary,

}: Props) {

  return (

    <div className="bg-gradient-to-r from-slate-900 via-indigo-900 to-violet-900 text-white rounded-[32px] p-8 shadow-2xl overflow-hidden relative">

      <div className="absolute top-0 right-0 w-72 h-72 bg-fuchsia-500/20 blur-3xl rounded-full"></div>

      <div className="relative z-10">

        <p className="uppercase tracking-[0.25em] text-xs text-indigo-200 font-bold">

          AI EXECUTIVE SUMMARY

        </p>

        <h2 className="text-3xl font-black mt-3">

          Enterprise Business Overview

        </h2>

        <p className="text-indigo-100 leading-relaxed mt-5 max-w-4xl text-[15px]">

          {executiveSummary}

        </p>

      </div>

    </div>

  );

}
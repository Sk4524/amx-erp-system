"use client";

export default function FinanceSkeleton() {

  return (

    <div className="space-y-8 animate-pulse">

      {/* HERO */}

      <div className="relative overflow-hidden rounded-[36px] border border-white/50 bg-white/80 backdrop-blur-2xl p-8 shadow-[0_20px_60px_rgba(0,0,0,.06)]">

        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />

        <div className="h-6 w-44 rounded-full bg-slate-200" />

        <div className="mt-6 h-14 w-2/3 rounded-2xl bg-slate-200" />

        <div className="mt-6 h-5 w-full rounded-full bg-slate-200" />

        <div className="mt-3 h-5 w-4/5 rounded-full bg-slate-200" />

        <div className="mt-10 grid grid-cols-3 gap-4">

          {[...Array(3)].map((_, i) => (

            <div
              key={i}
              className="h-12 rounded-2xl bg-slate-200"
            />

          ))}

        </div>

      </div>

      {/* KPI */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        {[...Array(4)].map((_, i) => (

          <div
            key={i}
            className="relative overflow-hidden rounded-[32px] border border-white/50 bg-white/80 p-6 shadow-lg"
          >

            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />

            <div className="flex justify-between">

              <div className="h-4 w-24 rounded bg-slate-200" />

              <div className="h-12 w-12 rounded-2xl bg-slate-200" />

            </div>

            <div className="mt-8 h-10 w-36 rounded bg-slate-200" />

            <div className="mt-8 h-5 w-24 rounded-full bg-slate-200" />

          </div>

        ))}

      </div>

      {/* CHARTS */}

      <div className="grid xl:grid-cols-3 gap-7">

        {[...Array(3)].map((_, i) => (

          <div
            key={i}
            className="relative overflow-hidden rounded-[34px] border border-white/50 bg-white/80 p-8 shadow-lg h-[430px]"
          >

            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />

            <div className="h-5 w-28 rounded bg-slate-200" />

            <div className="mt-4 h-10 w-52 rounded bg-slate-200" />

            <div className="mt-10 h-[260px] rounded-3xl bg-slate-200" />

          </div>

        ))}

      </div>

      {/* TABLE */}

      <div className="relative overflow-hidden rounded-[34px] border border-white/50 bg-white/80 p-8 shadow-lg">

        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />

        <div className="h-6 w-52 rounded bg-slate-200" />

        <div className="mt-8 space-y-4">

          {[...Array(7)].map((_, i) => (

            <div
              key={i}
              className="h-14 rounded-2xl bg-slate-200"
            />

          ))}

        </div>

      </div>

    </div>

  );

}
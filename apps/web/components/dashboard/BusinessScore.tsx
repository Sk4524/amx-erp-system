"use client";

type Props = {

  businessHealth: number;

  businessStatus: string;

};

export default function BusinessScore({

  businessHealth,

  businessStatus,

}: Props) {

  return (

    <div className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white rounded-[32px] p-8 shadow-2xl">

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

        <div>

          <p className="uppercase tracking-[0.25em] text-xs font-bold text-green-100">

            AI BUSINESS HEALTH SCORE

          </p>

          <h2 className="text-5xl font-black mt-4">

            {businessHealth}/100

          </h2>

          <p className="mt-4 text-green-100 leading-relaxed">

            AI evaluated overall business operational performance.

          </p>

        </div>

        <div className="bg-white/15 backdrop-blur-xl px-8 py-6 rounded-3xl border border-white/20">

          <p className="text-sm text-green-100">

            Enterprise Status

          </p>

          <h2 className="text-3xl font-black mt-2">

            {businessStatus}

          </h2>

        </div>

      </div>

    </div>

  );

}
"use client";

import ReactECharts from "echarts-for-react";

type Props = {
  option: any;
};

export default function HeatMap({
  option,
}: Props) {
  return (
    <div className="relative overflow-hidden bg-white/80 backdrop-blur-2xl rounded-[32px] border border-white/50 shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 p-7">

      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500"></div>

      <div className="absolute -top-16 -right-16 w-40 h-40 bg-cyan-400/20 rounded-full blur-3xl"></div>

      <div className="relative z-10 mb-6">

        <div className="flex items-center justify-between">

          <div>

            <h2 className="text-[22px] font-bold text-[#111827]">
              Utilization Heatmap
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Department performance intensity
            </p>

          </div>

          <div className="bg-cyan-100 text-cyan-700 text-xs font-semibold px-3 py-1 rounded-full">
            LIVE
          </div>

        </div>

      </div>

      <ReactECharts
        option={option}
        notMerge
        lazyUpdate
        style={{
          height: "300px",
          width: "100%",
        }}
      />

    </div>
  );
}
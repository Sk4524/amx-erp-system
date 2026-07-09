"use client";

type Props = {
  predictions: any[];
};

export default function Predictions({

  predictions,

}: Props) {

  if (!predictions.length)
    return null;

  return (

    <div className="bg-white/80 backdrop-blur-2xl rounded-[32px] relative overflow-hidden shadow-lg border border-white/50 p-7 mb-10">

      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-red-500"></div>

      <div className="mb-6">

        <h2 className="text-[28px] font-bold text-[#111827]">

          AI Predictive Intelligence

        </h2>

        <p className="text-sm text-gray-500 mt-1">

          AI powered business forecasting

        </p>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {predictions.map(

          (item: any, index: number) => (

            <div
              key={index}
              className="rounded-3xl border border-blue-200 bg-blue-50 p-5"
            >

              <h3 className="font-bold text-lg text-[#111827]">

                {item.title}

              </h3>

              <p className="text-sm text-gray-600 mt-3 leading-relaxed">

                {item.prediction}

              </p>

              <div className="mt-5 inline-flex bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">

                Confidence: {item.confidence}

              </div>

            </div>

          )

        )}

      </div>

    </div>

  );

}
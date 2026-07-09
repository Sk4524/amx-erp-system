"use client";

type Props = {
  aiCards: any[];
  estimatedProfit: number;
};

export default function AIInsights({

  aiCards,

  estimatedProfit,

}: Props) {

  return (

    <div className="bg-white/80 backdrop-blur-2xl rounded-[32px] relative overflow-hidden shadow-lg border border-white/50 p-7">

      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-red-500"></div>

      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5 mb-5">

        <div>

          <h2 className="text-[26px] sm:text-[32px] font-bold text-[#111827]">

            AI Business Insights

          </h2>

          <p className="text-sm text-gray-500 mt-1">

            Smart ERP analytics and recommendations

          </p>

        </div>

        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-500 text-white px-6 py-4 rounded-3xl shadow-xl min-w-[220px]">

          <p className="text-xs text-indigo-100">

            Estimated Profit

          </p>

          <h2 className="text-3xl font-bold mt-1">

            ₹{estimatedProfit}

          </h2>

        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

        {aiCards.map((item: any, index: number) => (

          <div
            key={index}
            className={`rounded-2xl p-4 border

            ${
              item.type === "warning"
                ? "bg-yellow-50 border-yellow-200"
                : item.type === "danger"
                ? "bg-red-50 border-red-200"
                : item.type === "success"
                ? "bg-green-50 border-green-200"
                : "bg-blue-50 border-blue-200"
            }
            `}
          >

            <h3 className="font-bold text-base text-[#111827] mb-2">

              {item.title}

            </h3>

            <p className="text-sm text-gray-700 leading-relaxed">

              {item.message}

            </p>

          </div>

        ))}

      </div>

    </div>

  );

}
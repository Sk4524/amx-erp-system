"use client";

type Props = {
  riskAlerts: any[];
};

export default function RiskAlerts({

  riskAlerts,

}: Props) {

  if (!riskAlerts.length)
    return null;

  return (

    <div className="bg-white/80 backdrop-blur-2xl rounded-[32px] relative overflow-hidden shadow-lg border border-white/50 p-7 mb-10">

      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-red-500"></div>

      <div className="mb-6">

        <h2 className="text-[28px] font-bold text-[#111827]">

          AI Risk Detection Engine

        </h2>

        <p className="text-sm text-gray-500 mt-1">

          AI powered enterprise business risk analysis

        </p>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {riskAlerts.map((risk: any, index: number) => (

          <div
            key={index}
            className={`rounded-3xl p-5 border

            ${
              risk.level === "HIGH"
                ? "bg-red-50 border-red-200"
                : risk.level === "MEDIUM"
                ? "bg-yellow-50 border-yellow-200"
                : "bg-blue-50 border-blue-200"
            }
            `}
          >

            <div className="flex items-center justify-between">

              <h3 className="font-bold text-lg text-[#111827]">

                {risk.title}

              </h3>

              <span
                className={`text-xs font-bold px-3 py-1 rounded-full

                ${
                  risk.level === "HIGH"
                    ? "bg-red-100 text-red-600"
                    : risk.level === "MEDIUM"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-blue-100 text-blue-700"
                }
                `}
              >

                {risk.level}

              </span>

            </div>

            <p className="text-sm text-gray-600 mt-4">

              {risk.message}

            </p>

          </div>

        ))}

      </div>

    </div>

  );

}
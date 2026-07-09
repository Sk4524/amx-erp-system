"use client";

type Props = {
  procurementRecommendations: any[];
};

export default function Procurement({

  procurementRecommendations,

}: Props) {

  return (

    <div className="bg-white/80 backdrop-blur-2xl rounded-[32px] relative overflow-hidden shadow-lg border border-white/50 p-7 mb-10">

      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-red-500"></div>

      <div className="mb-6">

        <h2 className="text-[28px] font-bold text-[#111827]">

          AI Procurement Engine

        </h2>

        <p className="text-sm text-gray-500 mt-1">

          Smart inventory replenishment powered by AI

        </p>

      </div>

      {procurementRecommendations.length === 0 ? (

        <div className="text-center py-10">

          <h3 className="text-xl font-bold text-green-600">

            Inventory Stable

          </h3>

          <p className="text-gray-500 mt-2">

            AI detected no procurement risks.

          </p>

        </div>

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

          {procurementRecommendations.map(

            (item: any, index: number) => (

              <div
                key={index}
                className="border border-blue-200 bg-blue-50 rounded-3xl p-5 hover:shadow-lg transition-all"
              >

                <div className="flex items-center justify-between mb-3">

                  <h3 className="font-bold text-lg text-[#111827]">

                    {item.productName}

                  </h3>

                  <span
                    className={`text-xs px-3 py-1 rounded-full font-bold

                    ${
                      item.urgency === "HIGH"
                        ? "bg-red-500 text-white"
                        : item.urgency === "MEDIUM"
                        ? "bg-yellow-500 text-white"
                        : "bg-green-500 text-white"
                    }
                    `}
                  >

                    {item.urgency}

                  </span>

                </div>

                <div className="space-y-2 text-sm">

                  <div>

                    Current Stock:

                    <span className="ml-2 font-bold">

                      {item.currentStock}

                    </span>

                  </div>

                  <div>

                    Sold Units:

                    <span className="ml-2 font-bold">

                      {item.soldUnits}

                    </span>

                  </div>

                  <div>

                    Average Demand:

                    <span className="ml-2 font-bold">

                      {item.averageDemand}

                    </span>

                  </div>

                  <div>

                    Recommended Restock:

                    <span className="ml-2 font-bold text-blue-700">

                      {item.recommendedRestock}

                    </span>

                  </div>

                </div>

                <p className="mt-4 text-sm text-gray-600 leading-relaxed">

                  {item.aiReason}

                </p>

              </div>

            )

          )}

        </div>

      )}

    </div>

  );

}
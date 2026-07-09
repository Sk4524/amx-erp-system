"use client";

import { AlertTriangle, Package } from "lucide-react";

type Props = {
  lowStockItems: any[];
};

export default function LowStock({

  lowStockItems,

}: Props) {

  return (

    <div className="bg-white/80 backdrop-blur-2xl rounded-[32px] relative overflow-hidden p-6 shadow-lg border border-white/50 h-[420px] flex flex-col">

      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-400"></div>

      <div className="flex items-center justify-between mb-4">

        <div>

          <h2 className="text-[24px] text-black font-bold">

            Low Stock

          </h2>

          <p className="text-sm text-gray-500">

            Critical inventory alerts

          </p>

        </div>

        <div className="bg-red-100 p-2 rounded-xl">

          <AlertTriangle className="text-red-500" />

        </div>

      </div>

      <div className="space-y-4 overflow-y-auto flex-1">

        {lowStockItems.length === 0 ? (

          <div className="flex flex-col items-center justify-center h-full">

            <Package
              size={40}
              className="text-green-600 mb-3"
            />

            <h3 className="font-bold">

              Inventory Healthy

            </h3>

            <p className="text-sm text-gray-500">

              No low stock products detected.

            </p>

          </div>

        ) : (

          lowStockItems.map((item: any) => (

            <div
              key={item.id}
              className="text-black flex justify-between border rounded-2xl px-4 py-3 hover:bg-gray-50"
            >

              <div>

                <p className="font-semibold">

                  {item.productName}

                </p>

                <p className="text-sm text-gray-500">

                  SKU: {item.sku}

                </p>

              </div>

              <div className="bg-red-100 text-red-600 font-bold px-3 py-1 rounded-xl">

                {item.quantity}

              </div>

            </div>

          ))

        )}

      </div>

    </div>

  );

}
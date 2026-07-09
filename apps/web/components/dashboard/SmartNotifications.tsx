"use client";

type Props = {
  smartNotifications: any[];
};

export default function SmartNotifications({

  smartNotifications,

}: Props) {

  if (!smartNotifications.length)
    return null;

  return (

    <div className="bg-white/80 backdrop-blur-2xl rounded-[32px] relative overflow-hidden shadow-lg border border-white/50 p-7 mb-10">

      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-red-500"></div>

      <div className="mb-6">

        <h2 className="text-[28px] font-bold text-[#111827]">

          AI Smart Notifications

        </h2>

        <p className="text-sm text-gray-500 mt-1">

          AI generated enterprise alerts

        </p>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {smartNotifications.map(

          (item: any, index: number) => (

            <div
              key={index}
              className={`rounded-3xl p-5 border

              ${
                item.type === "success"
                  ? "bg-green-50 border-green-200"

                  : item.type === "danger"
                  ? "bg-red-50 border-red-200"

                  : "bg-yellow-50 border-yellow-200"
              }
              `}
            >

              <h3 className="font-bold text-lg text-[#111827]">

                {item.title}

              </h3>

              <p className="text-sm text-gray-600 mt-4 leading-relaxed">

                {item.message}

              </p>

            </div>

          )

        )}

      </div>

    </div>

  );

}
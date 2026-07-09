"use client";

import CountUp from "react-countup";
import { useRouter } from "next/navigation";

type Props = {
  cards: any[];
  role: string;
};

export default function KPICards({
  cards,
  role,
}: Props) {

  const router = useRouter();

  return (

    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-4 gap-6 mb-10">

      {cards
        .filter(card =>
          card.roles.includes(role)
        )
        .map((card, index) => {

          const Icon = card.icon;

          return (

            <div
              key={index}

              onClick={() => {

                if (
                  card.roles.includes(role)
                ) {

                  router.push(card.path);

                }

              }}

              className={`group relative overflow-hidden rounded-[32px] bg-gradient-to-br ${card.gradient} p-[1px] shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer`}
            >

              <div className="relative h-full rounded-[31px] bg-white/10 backdrop-blur-xl px-7 py-6 overflow-hidden">

                <div className="absolute -top-10 -right-10 w-44 h-44 bg-white/20 rounded-full blur-3xl"></div>

                <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white/10 to-transparent"></div>

                <div className="flex items-start justify-between relative z-10">

                  <div>

                    <p className="text-white text-sm font-semibold tracking-wide">
                      {card.title}
                    </p>

                    <h2 className="text-[26px] sm:text-[32px] xl:text-[48px] font-black text-white mt-3">

                      {card.prefix}

                      <CountUp
                        end={card.value}
                        duration={2}
                      />

                    </h2>

                  </div>

                  <div className="bg-white/15 p-4 rounded-3xl">

                    <Icon
                      size={30}
                      className="text-white"
                    />

                  </div>

                </div>

                <div className="mt-8 flex items-center justify-between">

                  <p className="text-sm text-white">

                    {card.subtitle}

                  </p>

                  <div className="bg-white/15 px-3 py-1 rounded-full text-xs text-white">

                    {card.badge}

                  </div>

                </div>

              </div>

            </div>

          );

        })}

    </div>

  );

}
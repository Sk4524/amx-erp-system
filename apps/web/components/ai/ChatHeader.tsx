"use client";

import {
    Bot,
    Sparkles,
    Wifi,
} from "lucide-react";

interface Props {

    agent?: string;

}

export default function ChatHeader({

    agent = "Enterprise Copilot",

}: Props) {

    return (

        <div className="relative overflow-hidden">

            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600" />

            <div className="relative flex items-center justify-between px-5 py-4 text-white">

                <div className="flex items-center gap-4">

                    <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-xl flex items-center justify-center">

                        <Bot size={26} />

                    </div>

                    <div>

                        <h2 className="font-bold text-lg">

                            AMX AI

                        </h2>

                        <p className="text-xs text-blue-100">

                            {agent}

                        </p>

                    </div>

                </div>

                <div className="flex items-center gap-2 text-sm">

                    <Wifi size={16} />

                    <span>

                        Online

                    </span>

                    <Sparkles
                        size={16}
                    />

                </div>

            </div>

        </div>

    );

}
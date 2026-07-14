"use client";

import { Bot } from "lucide-react";

export default function TypingAnimation() {

    return (

        <div className="flex items-end gap-3 mb-5">

            <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 text-white flex items-center justify-center shadow-lg">

                <Bot size={20} />

            </div>

            <div className="bg-white border border-gray-200 rounded-3xl rounded-bl-md px-5 py-4 shadow-md">

                <div className="flex items-center gap-2">

                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>

                    <span
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.15s" }}
                    ></span>

                    <span
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.3s" }}
                    ></span>

                </div>

                <p className="text-xs text-gray-500 mt-3">

                    AMX Enterprise Copilot is thinking...

                </p>

            </div>

        </div>

    );

}
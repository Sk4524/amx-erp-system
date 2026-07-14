"use client";

import {
    Bot,
    User,
} from "lucide-react";

interface Props {

    role: "user" | "assistant";

    message: string;

    time?: string;

}

export default function ChatBubble({

    role,

    message,

    time,

}: Props) {

    const isUser =
        role === "user";

    return (

        <div
            className={`flex gap-3 mb-5 ${
                isUser
                    ? "justify-end"
                    : "justify-start"
            }`}
        >

            {!isUser && (

                <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 text-white flex items-center justify-center shadow-lg">

                    <Bot size={20} />

                </div>

            )}

            <div
                className={`max-w-[80%] rounded-3xl px-5 py-4 shadow-md

                ${
                    isUser

                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"

                        : "bg-white border border-gray-200 text-gray-800"
                }
                `}
            >

                <div className="whitespace-pre-wrap leading-7">

                    {message}

                </div>

                {time && (

                    <div
                        className={`mt-3 text-xs ${
                            isUser
                                ? "text-blue-100"
                                : "text-gray-400"
                        }`}
                    >

                        {time}

                    </div>

                )}

            </div>

            {isUser && (

                <div className="w-10 h-10 rounded-2xl bg-slate-800 text-white flex items-center justify-center shadow-lg">

                    <User size={20} />

                </div>

            )}

        </div>

    );

}
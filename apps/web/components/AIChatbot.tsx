"use client";

import {
    useState
} from "react";

import ReactMarkdown from "react-markdown";

import {
    Bot,
    Send,
    X,
    Mic

} from "lucide-react";

export default function AIChatbot() {

    const [open, setOpen] =
        useState(false);

    const [message, setMessage] =
        useState("");

    const [messages, setMessages] =
        useState([
            {
                role: "ai",
                text: "Hello 👋 I am your Enterprise AI Assistant."

            }

        ]);
    const [loading, setLoading] =
        useState(false);
    const sendMessage = async () => {

        if (!message.trim()) return;

        const userMessage = {

            role: "user",

            text: message,
        };

        setMessages((prev: any) => [

            ...prev,

            userMessage
        ]);

        const currentMessage =
            message;

        setMessage("");
        setLoading(true);

        try {

            const tenantId =
                localStorage.getItem(
                    "tenantId"
                );

            const token =
    localStorage.getItem(
        "token"
    );

            const response =
                await fetch(

                    `${process.env.NEXT_PUBLIC_API_URL}/ai/chat`,


                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json",
                            Authorization:
                                `Bearer ${token}`,

                            tenantid:
                                tenantId || "",
                        },

                        body: JSON.stringify({

                            message:
                                currentMessage,
                        }),
                    }
                );

            const data =
                await response.json();

            setMessages((prev: any) => [

                ...prev,

                {

                    role: "ai",

                    text:
                        data?.data?.reply ||
                        data?.reply ||
                        "AI unavailable",
                },
            ]);
            {
                setLoading(false);
            }
        } catch (err) {

            console.log(err);
            setLoading(false);

            setMessages((prev: any) => [

                ...prev,

                {

                    role: "ai",

                    text:
                        "Failed to connect AI service.",
                },
            ]);
        }
    };

    return (
        <>
            {/* FLOAT BUTTON */}
            <button
                onClick={() =>
                    setOpen(!open)
                }
                className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300"
            >
                {open ? <X /> : <Bot />}
            </button>

            {/* CHATBOX */}
            {open && (

                <div className="fixed bottom-24 right-6 w-[380px] h-[420px] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden z-50">

                    {/* HEADER */}
                    <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500 text-white px-5 py-4 shadow-lg">
                        <h2 className="font-bold text-lg">
                            AI ERP Assistant
                        </h2>

                        <p className="text-xs opacity-80">
                            Enterprise AI Powered Chat
                        </p>

                    </div>

                    {/* MESSAGES */}
                    <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 bg-gradient-to-b from-gray-50 to-gray-100 scroll-smooth">

                        {loading && (

                            <div className="flex justify-start">

                                <div className="bg-white border border-gray-200 text-gray-500 px-4 py-3 rounded-3xl rounded-bl-md text-sm shadow-sm animate-pulse">

                                    AI is analyzing ERP business data...

                                </div>

                            </div>
                        )}
                        {messages.map(
                            (msg: any, index) => (

                                <div
                                    key={index}
                                    className={`

                                      max-w-[88%]
                                     px-4
                                     py-3
                                    rounded-3xl
                                    text-sm
                                     leading-7
                                     shadow-sm
                                     break-words
                                     whitespace-pre-wrap
                                     transition-all
                                    duration-300

                                    ${msg.role === "user"

                                            ? "ml-auto bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white rounded-br-md"

                                            : "bg-white text-gray-800 border border-gray-200 rounded-bl-md animate-in fade-in duration-500"
                                        }
`}
                                >

                                    <ReactMarkdown>

                                        {msg.text}

                                    </ReactMarkdown>

                                </div>
                            )
                        )}

                    </div>

                    {/* INPUT */}
                    <div className="p-4 border-t bg-white flex items-center gap-2">

                        <input
                            value={message}
                            onChange={(e) =>
                                setMessage(e.target.value)
                            }
                            onKeyDown={(e) => {

                                if (e.key === "Enter") {

                                    sendMessage();
                                }
                            }}
                            placeholder="Ask AI anything..."
                            className="flex-1 border border-gray-200 rounded-2xl px-4 py-3 outline-none text-black bg-gray-50 focus:ring-2 focus:ring-violet-500"
                        />

                        <button
                            onClick={() => {

                                const recognition =
                                    new (
                                        window as any
                                    ).webkitSpeechRecognition();

                                recognition.lang =
                                    "en-US";

                                recognition.start();

                                recognition.onresult =
                                    (event: any) => {

                                        setMessage(
                                            event.results[0][0]
                                                .transcript
                                        );
                                    };
                            }}
                            className="bg-blue-500 text-white p-3 rounded-2xl shadow-lg hover:scale-105 transition-all duration-300"
                        >
                            <Mic size={18} />
                        </button>

                        <button
                            onClick={sendMessage}
                            disabled={loading}
                            className="bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white p-3 rounded-2xl shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50"
                        >
                            {loading ? "..." : <Send size={18} />}
                        </button>
                    </div>

                </div>
            )}
        </>
    );
}
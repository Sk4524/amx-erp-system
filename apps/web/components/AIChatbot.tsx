"use client";

import {
    useState
} from "react";
import AIWindow from "./ai/AIWindow";
import type { ChatMessage } from "./ai/types/chat";
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
    useState<ChatMessage[]>([
            {
                role: "ai",
                text: "Hello 👋 I am your Enterprise AI Assistant."

            }

        ]);
    const [loading, setLoading] =
        useState(false);

    const handleVoiceInput = () => {
        const SpeechRecognition =
            (window as any).SpeechRecognition ||
            (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Speech recognition is not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();

        recognition.lang = "en-US";

        recognition.onresult = (event: any) => {
            setMessage(event.results[0][0].transcript);
        };

        recognition.start();
    };
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

                <div className="fixed bottom-24 right-6 w-[420px] h-[450px] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden z-50">

                    {/* HEADER */}
                    

                    {/* MESSAGES */}
                

                    {/* INPUT */}
                    <AIWindow
                        title="AMX AI Copilot"
                        messages={messages}
                        loading={loading}
                        inputValue={message}
                        onInputChange={setMessage}
                        onSend={sendMessage}
                        onVoiceInput={handleVoiceInput}
                    />

                </div>
            )}
        </>
    );
}
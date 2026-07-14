import { greetingResponse } from "./Greeting";

import {
    getConversation,
    saveConversation,
} from "./ConversationMemory";

import { runAI } from "../engine/AIEngine";

export async function runCopilot(

    tenantId: string,

    question: string,

    dashboard: any,

    askAI: (

        prompt: string,

        context: string

    ) => Promise<string | null>

) {

    // 1. Greeting
    const greeting =
        greetingResponse(question);

    if (greeting) {

        return {

            intent: "greeting",

            reply: greeting,

            suggestions: [

                "Business Summary",

                "Revenue Analysis",

                "Inventory Status",

                "Forecast Next Month",

                "HR Insights",

            ],

        };

    }

    // 2. Previous Conversation
    const previous =
        getConversation(tenantId);

    let finalQuestion =
        question;

    if (

        previous &&

        /^(what about|and|also|explain|why|how|more)$/i.test(

            question.trim()

        )

    ) {

        finalQuestion =

`Previous Question:
${previous.question}

Previous Answer:
${previous.answer}

Follow-up Question:
${question}`;

    }

    // 3. AI Engine
    const ai =
        await runAI(

            finalQuestion,

            dashboard,

            askAI

        );

    // 4. Save Memory
    saveConversation(

        tenantId,

        question,

        ai.response || "",

        ai.intent

    );

    // 5. Return
    return {

        intent:
            ai.intent,

        reply:
            ai.response,

        suggestions: [

            "Business Summary",

            "Revenue Analysis",

            "Inventory Health",

            "Forecast Sales",

            "Generate Report",

        ],

    };

}
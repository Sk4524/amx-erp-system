import { detectIntent } from "./IntentDetector";
import { getPrompt } from "./PromptManager";
import { buildContext } from "./ContextManager";
import { formatResponse }
from "./ResponseFormatter";

import { CFOService } from "../services/CFO.service";

export async function runAI(

    question: string,

    dashboard: any,

    askAI: (

        prompt: string,

        context: string

    ) => Promise<string | null>

) {

    // Detect user intent
    const intent =
        detectIntent(question);

    // Select prompt
    const prompt =
        getPrompt(intent);

    // Build only required context
    const context =
        buildContext(

            intent,

            dashboard,

            question

        );

    // Call LLM
  let raw: string | null = null;

switch (intent) {

    case "finance":

        raw = await new CFOService(

            askAI

        ).analyze(

            dashboard,

            question

        );

        break;

    default:

        raw = await askAI(

            prompt,

            context

        );

}

return {

    intent,

    response:
        formatResponse(
            raw || ""
        ),

};

}
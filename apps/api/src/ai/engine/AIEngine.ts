import { detectIntent } from "./IntentDetector";
import { getPrompt } from "./PromptManager";
import { buildContext } from "./ContextManager";
import { formatResponse }
from "./ResponseFormatter";
import { HandlerRegistry } from "../handlers/HandlerRegistry";


export async function runAI(

    question: string,

    dashboard: any,

    askAI: (

        prompt: string,

        context: string

    ) => Promise<string | null>

) {

    // Detect user intent
    const result =
    detectIntent(question);

const intent =
    result.intent;

    const registry =
    new HandlerRegistry();

    // Select prompt
   const handler =
    registry.getHandler(intent);

const prompt =
    handler
        ? handler.getPrompt()
        : getPrompt(intent);

const context =
    handler
        ? handler.buildContext(
              dashboard,
              question
          )
        : buildContext(
              intent,
              dashboard,
              question
          );
    // Call LLM
  let raw: string | null = null;

switch (intent) {

   case "finance": {

    const handler =
        registry.getHandler("finance");

    raw =
        handler
            ? await handler.execute(
                  question,
                  dashboard,
                  askAI
              )
            : "";

    break;
}

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
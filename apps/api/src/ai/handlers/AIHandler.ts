import { AIIntent } from "../engine/IntentDetector";

export interface AIHandler {

    intent: AIIntent;

    getPrompt(): string;

    buildContext(

        dashboard: any,

        question: string

    ): string;

    execute(

        question: string,

        dashboard: any,

        askAI: (

            prompt: string,

            context: string

        ) => Promise<string | null>

    ): Promise<string>;

}
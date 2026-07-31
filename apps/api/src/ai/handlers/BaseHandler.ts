import { AIHandler } from "./AIHandler";
import { AIIntent } from "../engine/IntentDetector";

export abstract class BaseHandler
    implements AIHandler {

    abstract intent: AIIntent;

    abstract getPrompt(): string;

    abstract buildContext(
        dashboard: any,
        question: string
    ): string;

    abstract execute(
        question: string,
        dashboard: any,
        askAI: (
            prompt: string,
            context: string
        ) => Promise<string | null>
    ): Promise<string>;

}
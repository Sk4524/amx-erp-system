import { AIIntent } from "../engine/IntentDetector";
import { AIHandler } from "./AIHandler";
import { FinanceHandler } from "./FinanceHandler";

export class HandlerRegistry {

    private handlers = new Map<
        AIIntent,
        AIHandler
    >();

    constructor() {

        const finance =
            new FinanceHandler();

        this.handlers.set(
            finance.intent,
            finance
        );

    }

    getHandler(
        intent: AIIntent
    ) {

        return this.handlers.get(
            intent
        );

    }

}
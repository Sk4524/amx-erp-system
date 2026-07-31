import { AIHandler } from "./AIHandler";

import { CFOService } from "../services/CFO.service";

import { financePrompt } from "../prompts/finance.prompt";

import { buildContext } from "../engine/ContextManager";

import { BaseHandler } from "./BaseHandler";

export class FinanceHandler
extends BaseHandler {

    intent = "finance" as const;

    getPrompt() {

        return financePrompt;

    }

    buildContext(

        dashboard: any,

        question: string

    ) {

        return buildContext(

            "finance",

            dashboard,

            question

        );

    }

    async execute(

        question: string,

        dashboard: any,

        askAI: (

            prompt: string,

            context: string

        ) => Promise<string | null>

    ): Promise<string> {

        const result =

            await new CFOService(

                askAI

            ).analyze(

                dashboard,

                question

            );

        return result || "";

    }

}
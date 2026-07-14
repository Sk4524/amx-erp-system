import { getPrompt } from "../engine/PromptManager";
import { buildContext } from "../engine/ContextManager";

export class CFOService {

    constructor(

        private askAI: (
            prompt: string,
            context: string
        ) => Promise<string | null>

    ) {}

    async analyze(

        dashboard: any,

        question: string

    ) {

        const prompt =
            getPrompt("finance");

        const context =
            buildContext(

                "finance",

                dashboard,

                question

            );

        return this.askAI(

            prompt,

            context

        );

    }

}
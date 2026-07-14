export function greetingResponse(

    message: string

): string | null {

    const text =
        message
            .toLowerCase()
            .trim();

    // Greetings
    if (

        [
            "hi",
            "hello",
            "hey",
            "hii",
            "good morning",
            "good afternoon",
            "good evening"

        ].includes(text)

    ) {

        return `👋 Welcome to AMX Enterprise ERP AI Copilot.

I'm here to help you analyze your business.

You can ask things like:

• Show today's business summary
• How much revenue did we generate?
• Which products need restocking?
• Forecast next month's sales
• Show HR insights
• Generate business report

How can I assist you today?`;

    }

    return null;

}
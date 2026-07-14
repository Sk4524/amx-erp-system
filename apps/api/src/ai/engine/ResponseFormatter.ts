export function formatResponse(
    text: string
) {

    if (!text) {

        return
`I'm sorry, I couldn't generate a response.
Please try again.`;

    }

    let cleaned = text.trim();

    // Remove markdown code blocks
    cleaned = cleaned
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    // Try JSON parsing
    try {

        const data =
            JSON.parse(cleaned);

        // If AI accidentally returns dashboard JSON,
        // convert it into readable text.

        if (
            data.executiveSummary
        ) {

            return `# Executive Summary

${data.executiveSummary}

`;

        }

    }

    catch {

        // ignore

    }

    return cleaned;

}
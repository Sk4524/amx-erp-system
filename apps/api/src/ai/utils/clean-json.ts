export function cleanAIJSON(
  response: string
) {
  try {

    let cleaned =
      response
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    const first =
      cleaned.indexOf("{");

    const last =
      cleaned.lastIndexOf("}");

    if (
      first >= 0 &&
      last >= 0
    ) {
      cleaned =
        cleaned.substring(
          first,
          last + 1
        );
    }

    return JSON.parse(cleaned);

  } catch {

    return null;

  }
}
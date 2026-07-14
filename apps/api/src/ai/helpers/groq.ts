import Groq from "groq-sdk";

const groq = new Groq({

  apiKey:
    process.env.GROQ_API_KEY,

});

export async function askGroq(

  systemPrompt: string,

  userPrompt: string,

  model =
    "llama-3.3-70b-versatile"

) {

  const completion =
    await groq.chat.completions.create({

      model,

      messages: [

        {

          role: "system",

          content:
            systemPrompt,

        },

        {

          role: "user",

          content:
            userPrompt,

        },

      ],

    });

  return (
    completion.choices[0]
      ?.message?.content || ""
  );

}
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: "https://integrate.api.nvidia.com/v1",
});


function splitExplanation(text) {
  const tacticalMatch = text.match(/Tactical purpose:(.*?)(?=2\.|Positional benefit:)/s);
  const positionalMatch = text.match(/Positional benefit:(.*?)(?=3\.|Strategic goals:)/s);
  const strategicMatch = text.match(/Strategic goals:(.*)/s);

  return {
    tactical: tacticalMatch?.[1]?.trim() || "",
    positional: positionalMatch?.[1]?.trim() || "",
    strategic: strategicMatch?.[1]?.trim() || "",
  };
}


exports.explainMove = async (req, res) => {
  const { fen, move } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: "microsoft/phi-4-mini-instruct",
      messages: [
        {
          role: "user",
          content: `You are a chess tutor. A user made the move '${move}' in the position (FEN): ${fen}. Explain this move in terms of: 1. Tactical purpose 2. Positional benefit 3. Strategic goals`,
        },
      ],
      temperature: 0.1,
      top_p: 0.7,
      max_tokens: 1024,
      stream: false,
    });

    // const aiText = response.choices?.[0]?.message?.content;

    //const { tactical, positional, strategic } = splitExplanation(aiText);

    return res.status(200).json({
      success: true,
      response,
      // bestMove: move,
      // tactical,
      // positional,
      // strategic,
    });

  } catch (err) {
    console.error("AI error details:", err.response?.data || err.message);
    return res.status(500).json({ error: "AI explanation failed" });
  }
};






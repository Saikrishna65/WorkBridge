const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini client with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Controller function
const improveTextController = async (req, res) => {
  const { inputText } = req.body;

  if (!inputText || inputText.trim() === "") {
    return res.status(400).json({ error: "Input text is required." });
  }

  const MAX_RETRIES = 5;
  let retry = 0;
  let delay = 1000;

  while (retry < MAX_RETRIES) {
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash-latest",
      });

      const prompt = `
Improve the following message for clarity and professionalism. Return only one improved version without explanation or commentary:
"${inputText}"
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const improved = response.text();

      return res.json({
        improvedText: improved || "No improvement generated.",
      });
    } catch (err) {
      if (err.status === 503 && retry < MAX_RETRIES - 1) {
        console.warn(`Gemini API overloaded. Retrying in ${delay / 1000}s...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2;
        retry++;
      } else {
        console.error("Gemini API Error:", err);
        return res.status(500).json({ error: "Failed to improve text." });
      }
    }
  }

  return res.status(500).json({ error: "All retries failed." });
};

module.exports = { improveTextController };

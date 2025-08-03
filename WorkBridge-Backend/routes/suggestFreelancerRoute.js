const express = require("express");
const suggestRouter = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize the Google Generative AI client with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Helper function to build the prompt for the Gemini API.
 * This function takes project details and freelancer information
 * and formats them into a clear prompt for the AI.
 * @param {Object} project - The project details (title, description, category).
 * @param {Array<Object>} freelancers - An array of interested freelancers, each with name, skills, experience, and proposal.
 * @returns {string} The formatted prompt string.
 */
function buildPrompt(project, freelancers) {
  let prompt = `A client has posted this project:\n\n`;
  prompt += `Title: ${project.title}\n`;
  prompt += `Description: ${project.description}\n`;
  prompt += `Category: ${project.category}\n\n`;
  prompt += `Here are the interested freelancers:\n`;

  freelancers.forEach((f, i) => {
    prompt += `\n${i + 1}. ${f.name}\n`;
    prompt += `   • Skills: ${f.skills.join(", ")}\n`;
    prompt += `   • Experience: ${f.experience} years\n`;
    prompt += `   • Proposal: ${f.proposal}\n`;
  });

  prompt += `\nWho is the best fit? Reply with ONLY the freelancer's name and one short reason.`;
  return prompt;
}

/**
 * POST /api/suggest-freelancer
 * This endpoint suggests the best-fit freelancer for a given project
 * by leveraging the Gemini AI model. It includes retry logic with
 * exponential backoff to handle API service unavailability.
 */
suggestRouter.post("/suggest-freelancer", async (req, res) => {
  const { project, freelancers } = req.body;

  // Validate incoming request body
  if (!project || !Array.isArray(freelancers) || freelancers.length === 0) {
    return res
      .status(400)
      .json({ error: "Missing project details or freelancers data." });
  }

  // --- Retry Mechanism Configuration ---
  const MAX_RETRIES = 5; // Maximum number of attempts for the API call
  let currentRetry = 0;
  let delay = 1000; // Initial delay in milliseconds (1 second)

  // Loop to attempt the API call with retries
  while (currentRetry < MAX_RETRIES) {
    try {
      // --- Debug Logging ---
      console.log(
        `[Attempt ${
          currentRetry + 1
        }/${MAX_RETRIES}] Route hit. Getting model...`
      );

      // 1) Get the Gemini model (using the specified free-tier model)
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash-latest",
      });

      console.log("Building prompt...");
      // 2) Build the prompt string using the helper function
      const prompt = buildPrompt(project, freelancers);

      console.log("Sending request to Gemini API... This may take a moment.");
      // 3) Call generateContent on the model with the prepared prompt
      const result = await model.generateContent(prompt);

      console.log("AI response received!");
      // 4) Extract the text from the response structure
      const response = await result.response;
      const suggestion = response.text() || "No suggestion generated.";

      console.log("Sending suggestion back to client.");
      // If successful, send the suggestion and exit the loop
      return res.json({ suggestion });
    } catch (err) {
      // Check if the error is a 503 Service Unavailable AND if more retries are available
      if (err.status === 503 && currentRetry < MAX_RETRIES - 1) {
        console.warn(
          `AI Error: [${err.status} ${
            err.statusText || "Service Unavailable"
          }] ` +
            `The model is overloaded. Retrying in ${delay / 1000} seconds...`
        );
        // Wait for the calculated delay before the next retry
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2; // Double the delay for the next retry (exponential backoff)
        currentRetry++; // Increment the retry counter
      } else {
        // If it's not a 503, or if all retries are exhausted for a 503,
        // log the error and send a 500 response to the client.
        console.error("AI Error:", err);
        return res
          .status(500)
          .json({
            error: "Failed to suggest freelancer after multiple attempts.",
          });
      }
    }
  }

  // If the loop completes without returning a successful response (i.e., all retries failed)
  return res
    .status(500)
    .json({ error: "Failed to suggest freelancer after all retries." });
});

module.exports = suggestRouter;

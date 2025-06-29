import axios from "axios";
import { aiEndpoints } from "../apis";

// Destructure the endpoint
const { EXPLAIN_MOVE_API } = aiEndpoints;

// Function to call the backend
export const explainMove = async (fen, move) => {
  try {
    const response = await axios.post(EXPLAIN_MOVE_API, {
      fen,
      move,
    });

    // ✅ Return the full response object for frontend parsing
    return response.data.response;
  } catch (error) {
    console.error("Explain Move Error:", error.response?.data || error.message);
    throw new Error("Failed to get explanation from AI");
  }
};


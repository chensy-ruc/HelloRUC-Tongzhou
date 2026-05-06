const { createAssistantAnswer } = require("../lib/assistant-service");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const answer = await createAssistantAnswer({
      question: body.question,
      context: body.context
    });
    res.status(200).json({ answer });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: "Assistant unavailable"
    });
  }
};

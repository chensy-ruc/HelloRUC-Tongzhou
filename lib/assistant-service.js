const DEFAULT_MODEL = "gpt-4o-mini";
const DEFAULT_BASE_URL = "https://api.openai.com/v1";

function compactContext(context = {}) {
  return JSON.stringify(context).slice(0, 12000);
}

async function createAssistantAnswer({ question, context }) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    const error = new Error("OPENAI_API_KEY is not configured");
    error.statusCode = 503;
    throw error;
  }

  const baseUrl = process.env.OPENAI_BASE_URL || DEFAULT_BASE_URL;
  const model = process.env.OPENAI_MODEL || DEFAULT_MODEL;
  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content: [
            "你是 HelloRUC Tongzhou 的校园导览问答助手。",
            "请面向参访者、新生和国际友人回答，语言自然、简洁、可靠。",
            "只根据用户问题、页面上下文和可确认的信息回答；涉及实时政策、开放时间、预约、报到安排时提醒用户以学校通知、现场信息或志愿者确认为准。",
            "不要暴露开发实现、API、后端、知识库等技术细节。"
          ].join("\n")
        },
        {
          role: "user",
          content: `页面上下文：\n${compactContext(context)}\n\n用户问题：${String(question || "").trim()}`
        }
      ]
    })
  });

  if (!response.ok) {
    const error = new Error(`Model request failed: ${response.status}`);
    error.statusCode = response.status;
    throw error;
  }

  const payload = await response.json();
  return payload.choices?.[0]?.message?.content?.trim() || "";
}

module.exports = {
  createAssistantAnswer
};

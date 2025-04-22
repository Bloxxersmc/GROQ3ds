const express = require("express");
const axios = require("axios");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/chat", async (req, res) => {
  const query = req.query.q;
  if (!query) return res.send("<pre>No question provided!</pre>");

  try {
    const groqResponse = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "mixtral-8x7b-32768",
        messages: [{ role: "user", content: query }]
      },
      {
        headers: {
          Authorization: `Bearer sk-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`,
          "Content-Type": "application/json"
        }
      }
    );

    const aiText = groqResponse.data.choices[0].message.content;
    res.send(`
      <form action="/chat" method="get">
        <input name="q" type="text" value="${query}" style="width:100%;" />
        <input type="submit" value="Ask Again" />
      </form>
      <pre>${aiText}</pre>
    `);
  } catch (err) {
    res.send(`<pre>Error: ${err.message}</pre>`);
  }
});

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
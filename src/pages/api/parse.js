// This API access point is for parsing the user's job description input and summarizing it

require("dotenv").config({
  path: "./.env",
});

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  let messages = [
    {
      role: "system",
      content:
        "Summarize the following job description. Fit the description into 50 words. Remove any unnecessary characters or words. Remove any mention of locations or compensation.",
    },
    { role: "user", content: req.body.jobDescription },
  ];

  try {
    openai
      .createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messages,
      })
      .then((data) => {
        res.status(200).json({
          summary:
            data.data.choices[data.data.choices.length - 1].message.content,
        });
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
}


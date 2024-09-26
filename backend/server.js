require('dotenv').config();
// console.log("Process env", process.env);
// console.log("Twitter bearer token: ", process.env.TWITTER_BEARER_TOKEN);
const express = require('express');
const OpenAI = require('openai');
const cors = require('cors');
const { TwitterApi } = require('twitter-api-v2');




const app = express();

app.use(cors());
app.options('*', cors());

app.use(express.json());

const port = 3007;

const openai = new OpenAI('your-openai-api-key');

app.use(express.json());

app.post('/generate', async (req, res) => {
  const { input } = req.body;
  try {
    const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You are a helpful assistant. Your job is to choose a label for the following tweet that helps the user understand how 'nutritious' the content of the tweet is: ${input}. 
                Choose from these options, and use your discretion: 
                Didactic 
                Ragebait
                Insight porn
                Satire
                Ad
                Shitpost
                Meme
                Cool Thing 
                Asking for something 

                Return your response in the following JSON format: 
                {label: 'label'}
                `
              },
            ],
            stream:false,
            response_format: { type: "json_object" }
          });
          console.log("Response: ", response.choices[0].message.content);
    res.json({ label: response.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/get_user_timeline', async (req, res)=>{
  console.log("Received request to get user timeline");
  const { userId } = req.body;
  console.log("User ID: ", userId);
  if (!userId) {
    res.status(400).json({ error: 'Missing required parameter "userId"' });
    return;
  }
  try {
    console.log("Bearer token", process.env.TWITTER_BEARER_TOKEN);
    if (!process.env.TWITTER_BEARER_TOKEN) {
      throw new Error('Twitter bearer token not found');
    }
    const twitterClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);
    const readOnlyClient = twitterClient.readOnly;
    const userResponse = await readOnlyClient.v2.userByUsername(userId);  
    const id = userResponse.data.id;
    const tweets = await readOnlyClient.v2.userTimeline(`${id}`, { exclude: 'replies' });
    // console.log("First page", tweets.data)
   
    // console.log("First page data tweets", tweets.data.data);
    res.json({ tweets: tweets.data.data });
    console.log("Successfully sent user timeline");
  }
  catch (error) {
    console.log("Error getting user timeline: ", error);
    res.status(500).json({ error: error.message });
  }
})


app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
const express = require('express');
const OpenAI = require('openai');
const { TwitterApi } = require('twitter-api-v2');


const app = express();
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
  try {
    console.log("Entered try")
    const twitterClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);
    console.log("Twitter client created")

    const readOnlyClient = twitterClient.readOnly;
    console.log("ReadOnly client created")
    const tweets = await readOnlyClient.v2.userTimeline('12', { exclude: 'replies' });
    //classify tweets here
    console.log("Tweets found"  , tweets);
    res.json({tweets: tweets});
    console.log("Tweets found: ", tweets);
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
})


app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
// const OpenAI = require('openai')
// const openai = new OpenAI(process.env.OPENAI_API_KEY)
// import OpenAI from 'openai';
// const openai = new OpenAI()
const global_url = 'http://localhost:3007'

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Received message in background: ", request);

  if (request.message === "generate") {
      const input = request.input;

      getResponse(input).then(result => {
          console.log("Generated label: ", result);
          sendResponse({ message: "Label generated", label: result });
      }).catch(error => {
          console.error("Error generating label: ", error);
          sendResponse({ message: "Error generating label", error:error });
      });

      return true; // Keeps the message channel open for sendResponse
  }
  else if (request.message === "classify") {
    const tweets = request.input;
    classifyTweets(tweets).then(result => {
        console.log("Classified tweets: ", result);
        sendResponse({ message: "Tweets classified", result: result });
    }).catch(error => {
        console.error("Error classifying tweets: ", error);
        console.log(error);
        sendResponse({ message: "Error classifying tweets", error:error });
    });

    return true; 
  }

  return false; // Explicitly return false if no async processing is done
});


function generateBatchLabels(tweets){
  //use one llm call to generate a bunch of labels then return as a map
}

async function generateLabel(input){
  console.log("Input: ", input)
  
    return ("fake response from background script")

}

async function getResponse(input, callback){
  const url = global_url + "/generate"
  try {
    body = JSON.stringify({input: input})
  }
  catch (error){
    console.log("Error stringifying body: ", error)
  }
  const response = await fetch(url, {
    method:'POST',
    headers: {
      'Content-Type':'application/json'
    },
    body:body
  });
  const data = await response.json();
  console.log("Data from getResponse: ", data)
  // if (data.label){
  //   const stringMsg = data.label;
  //   callback(stringMsg);
  // }
  return data.label;
}

async function classifyTweets(tweets) {
  console.log("Classifying tweets background: ", tweets);
  
  // Get labels for each tweet and store in labelArr
  const labelArr = [];
  for (let tweet of tweets) {
      const label = await getResponse(tweet);  
      const jsonLabel = JSON.parse(label);
      labelArr.push(jsonLabel.label);  
  }
  
  // Count occurrences of each label
  const foo = countOccurrences(labelArr);
  
  // Calculate the percentage for each label
  const percentArr = [];
  for (let label in foo) {
      const percent = foo[label] / labelArr.length;
      console.log("Percentage of ", label, " in foo: ", percent);
      percentArr.push({ label, percent });  // Store label as key, percent as value
  }
  
  return percentArr;
}

// Example countOccurrences function to count labels
function countOccurrences(arr) {
  return arr.reduce((acc, item) => {
      acc[item] = (acc[item] || 0) + 1;
      return acc;
  }, {});
}
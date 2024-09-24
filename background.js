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

  return false; // Explicitly return false if no async processing is done
});

// chrome.runtime.onMessage.addListener(async (request,sender,sendResponse)=>{

//     if(request.message === 'generate'){
      
//       const input = request.input;
//       function callback(text){
//         console.log("Callback text: ", text)
//         sendResponse({message:"Label generated", label:text});
//         // return true;
//       }

//       getResponse(input, callback)
//         .then(result=>{
//           console.log("Received result: ", result)
//           sendResponse({message:"Label generated", label:result});
//         })
//         .catch(error => {
//           console.error("Error getting response: ", error)
//         })
//       return true;
      
//     }
//     return false; 
// })

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
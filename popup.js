console.log("Popup.js loaded")

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Hello world from - popup.js")
    console.log(request);
    if(request.dom){
        console.log("got dom")
        // document.getElementById("dom").innerHTML = request.dom;
    }
    sendResponse({response: "got it"})
})

const fetchUserTweets = async () => {
        console.log("btn clicked amd Request sent")
        const response = await fetch('http://localhost:3007/get_user_timeline', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });
  
        if (response.ok) {
          const data = await response.json();
          const tweetsContainer = document.getElementById('tweets-container');
          tweetsContainer.innerHTML = ''; // Clear any existing content
  
          // Loop through the tweets and append to the container
          data.tweets.data.forEach(tweet => {
            const tweetDiv = document.createElement('div');
            tweetDiv.className = 'tweet';
            tweetDiv.textContent = tweet.text;
            tweetsContainer.appendChild(tweetDiv);
          });
        } else {
          console.error('Error fetching tweets:', response.statusText);
        }
}

document.addEventListener('DOMContentLoaded', ()=>{
    document.getElementById('fetch-tweets-btn').addEventListener('click', fetchUserTweets);

});
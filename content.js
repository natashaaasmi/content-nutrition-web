function TwitterHTMLParser(aHTMLString){
    var parser = new DOMParser();
    
    
    const doc = parser.parseFromString(aHTMLString, "text/html");
    doc.style="background-color: red;"
    // injectCSS2(document.getElementById("react-root"))
    var reactRoot = doc.getElementById("react-root");
    console.log("Second: ", second)
    var second = reactRoot.firstElementChild.firstElementChild
    // injectCSS2(second)
    const mainElement = document.querySelector('[role="main"]');
    console.log("Main element by role ", mainElement)
    // injectCSS2(mainElement, "yellow") //works
    var main = second.childNodes[2]
    console.log("Main: ", main)
    // injectCSS2(main, "red")

    const mainPgByQuery = mainElement.querySelector('[aria-label="Home timeline"]')
    console.log("Main page by query: ", mainPgByQuery)
    // injectCSS2(mainPgByQuery, "blue") //works
    var mainPage = main.childNodes[3].firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild
    console.log("Main page home timeleine: ", mainPage) //works
    var timeline = mainPage.childNodes[4]

    const timelineByQuery = mainPgByQuery.querySelector('[aria-label="Timeline: Your Home Timeline"]')
    console.log("Timeline by query: ", timelineByQuery)
    // injectCSS2(timelineByQuery, "green") //works

    console.log("Timeline: ", timeline)

    const postListByQuery = timelineByQuery.firstChild;
    console.log("Post list by query: ", postListByQuery)
    console.log("Post list by query children: ", postListByQuery.childNodes)
    // injectCSS2(postListByQuery, "orange") //works

    // const postListByQuery.
    
    // post list works, contains posts
    var postList = timeline.firstElementChild.childNodes[1].firstElementChild
    // injectCSS2(postList, "purple")
    console.log("Num tweets: ", postList.childNodes.length) 

    // console.log("Post list by query 1, ", postListByQuery.firstChild)
    // console.log("Post list by query 1.5", postListByQuery.firstChild.firstChild)
    // console.log("Post list by query 2, ", postListByQuery.firstChild.childNodes)
    // console.log("Post list by query 3, ", postListByQuery.firstChild.childNodes[0])

    console.log("Num tweets found from query: ", postListByQuery.firstChild.childNodes.length)

    postListByQuery.childNodes.forEach(post => {
        try {
            console.log("Post list entered")
            console.log("Post found: ", post)
            let testTweet = post.querySelector('[data-testid="tweet"]')
            console.log("Test tweet: ", testTweet)
            // let tweet = getTweet(post)
            // injectCSS2(tweet, "red")
            let userLine = getUserLineFromTweet(testTweet)
            // await llm here
            getLLMLabel(testTweet)
            .then((foundText)=>{
                // responseListener()
                // .then((response)=>{
                // console.log("Resposne from background: ", response)
                injectNewElement(userLine, foundText)
                // })
                
            })
            

            // injectCSS2(userLine, "blue")
            // let tweetText = getTweetText(tweet)
        }
        catch (error){
            console.log("Error: ", error)
        }
        
        // injectCSS(tweet, "gray");
    })
    // getTweet(post)

    console.log("Post list? ", postList)
    return postListByQuery
}



async function responseListener(){
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {   
        if (request.message === "Label generated"){
            console.log("Label generated request: ", request)
            console.log("Label generated: ", request.label)
            return request.label
        }
        else if (request.message === "Error generating label"){
            console.log("Error generating label")
            return "Error generating label"
        }
    });
    
}

function createPort(){
    var port = chrome.runtime.connect({name:"llm-port"});
    //do below when tweet text is found
    port.postMessage({message:"Connected to port"})
    port.onMessage.addListener((msg)=>{
        console.log("Message from port: ", msg)
    })
}

function sendMessageToBackground(message) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(message, (response) => {
        if (chrome.runtime.lastError) {
            console.log("error with runtime: ", chrome.runtime.lastError)
          reject(chrome.runtime.lastError);
        } else {
            console.log("Response from background promise: ", response)
          resolve(response);
        }
      });
    });
  }


async function getLLMLabel(tweet){
    console.log("Got here")
    try {
        console.log("In try block")
        var tweetText =tweet.childNodes[0].childNodes[0].childNodes[1].childNodes[1].childNodes[1].textContent
        // console.log("Tweet text: ", tweetText)
        // console.log("Tweet 2", tweetText.childNodes[0].childNodes[0].childNodes[1].childNodes[1].childNodes[1].textContent)
        if (tweetText){
            console.log("Tweet text: ", tweetText)
            const response = await sendMessageToBackground({ message: "generate", input: tweetText });
            console.log("Response from background: ", response)
            if (response.message === "Label generated"){
                console.log("Label found: ", response.label)
                const label = JSON.parse(response.label)
                console.log("Label: ", label.label)
                return label.label
            }
            return true;
        }
    } catch (error){
        console.log("Error getting LLM label: ", error)
        return ("Error found")
    }

}

// post has type document
function getTweet(post){
    // 5 -> childNodes[1] -> childNodes[1] -> childNodes[1]
    console.log("tweet 1; ", post.firstElementChild)
    console.log("tweet 2; ", post.firstElementChild.firstElementChild)
    console.log("tweet 3; ", post.firstElementChild.firstElementChild.firstElementChild)
    console.log("tweet 4; ", post.firstElementChild.firstElementChild.firstElementChild.firstElementChild)
    console.log("tweet 5; ", post.firstElementChild.firstElementChild.firstElementChild.firstElementChild.childNodes[1])

    var tweet = post.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild
    try {
        var tweet_2= post.firstElementChild.firstElementChild.firstElementChild.firstElementChild.childNodes[1]
        console.log("Tweet: ", tweet_2)
        return tweet_2
    }
    catch (error){
        console.log("Error getting tweet", error)
    }
    
}

function getUserLineFromTweet(tweet){
    try {
        var userLine = tweet.firstElementChild.firstElementChild.childNodes[1].childNodes[1].firstElementChild
        console.log("User line; ", userLine)
        return userLine
    }
    catch {
        console.log("Error getting user line")
    }
    // var userLine = tweet.childNodes[1].firstElementChild
    // console.log("User line; ", userLine)
    // return userLine
}

function getUserLineFromPost(post){
    try {
        var userLine = post.firstElementChild.firstElementChild.childNodes[1]
        console.log("User line 1", userLine)


    }
    catch(error){
        console.log("Error getting user line from post")
    }
}

function getTweetText(tweet){
    //childNodes[1]
    var tweetText = tweet.childNodes[1].childNodes[1].childNodes[1].firstElementChild.firstElementChild
    console.log("Tweet text: ", tweetText.textContent)
}

function parseHTML(aHTMLString){
    console.log("Test")
    const document = document.getElementById("react-root");
    var second = document.
    console.log("Document: ", document)
    return document
}

function injectCSS(el, color){
    var style = document.createElement('style');
    style.innerHTML = `
    .tweet {
        background-color: ${color};
        width:100px;
        height:100px;
    }
    `;
    document.head.appendChild(style);
    el.classList.add('tweet');
}

function injectCSS2(el ,color) {
    console.log("Inject cSS 2 called for element: ", el)
    // const style = document.createElement('style');
    // style.innerHTML = `
    //     .custom-background {
    //         background-color: red !important;
    //     }
    // `;
    // document.head.appendChild(style);
    // el.classList.add('custom-background');
    el.style.backgroundColor=color;
}

// injects tag
function injectNewElement(el, textInput){
    const text = [{text:"Ragebait",color:"crimson"},{text:"Clickbait",color:"slategray"},{text:"Inspiring",color:"seagreen"},{text:"Sad",color:"darkgreen"},{text:"Satire",color:"chocolate"},{text:"Neutral",color:"cornflowerblue"},{text:"Opinion",color:"darkblue"},{text:"Joyful",color:"blueviolet"}]
    const index = Math.floor(Math.random() * text.length)
    const textChosen = text[index].text
    const colorChosen = text[index].color
    console.log("Text input: ", textInput)
    
    if (!el.classList.contains('css-injected')) {
        var newElement = document.createElement('div');
        // newElement.style.width='50px';
        newElement.style.display='inline';
        newElement.style.backgroundColor=colorChosen;
        newElement.innerHTML = textInput;
        newElement.style.width = 'fit-content';
        // newElement.style.width='auto';
        // newElement.style.maxWidth='250px'
        newElement.style.height='20px';
        newElement.style.lineHeight='20px';
        
        newElement.style.color="white";
        newElement.style.borderRadius='20px';
        newElement.style.padding='5px';
        newElement.style.paddingLeft='12px';
        newElement.style.paddingRight='12px';
        newElement.style.textAlign='center';
        newElement.style.margin='5px';
        newElement.style.fontFamily='Arial';
        // console.log("Text found? ")
        
        el.classList.add('css-injected');
        el.appendChild(newElement);
        el.appendChild(newElement);
        }
}


// const parsedResults = parseHTML(document.body.innerHTML)
// console.log(parsedResults)

// setTimeout(() => {
    // var start = Date.now();
    // console.log("Waited for 4 seconds");
    // const target = TwitterHTMLParser(document.body.innerHTML);

    // parseHTML()
    // TwitterHTMLParser(document.body.innerHTML);

    // var observer = new MutationObserver(function(mutations){
    //     var init = Date.now() - start;
    //     console.log("Adding mutations to psot list at time: ", init, "ms")
    //     mutations.forEach(function(mutation){
    //         console.log("Mutation: ", mutation.type)
    //         console.log("New mutation of type", mutation.type, " at time: ", init, "with added nodes", mutation.addedNodes.length)
    //         console.log("Added node: ", mutation.addedNodes[0])
    //         TwitterHTMLParser(document.body.innerHTML);
    //     })
    // })
    // var config = {attributes:true, childList:true, characterData:true}
    // observer.observe(target, config)
// }, 4000);
  
function getPostList(){
    var parser = new DOMParser();
    const main = document.querySelector('[role="main"]').querySelector('[aria-label="Home timeline"]');
    const timeline = main.querySelector('[aria-label="Timeline: Your Home Timeline"]');
    const postList = timeline.firstChild;
    return postList
}

function observeDOMForPopup(){
    const observer = new MutationObserver((mutations)=>{
        mutations.forEach((mutation)=>{
            if (mutation.type === "childList"){
                mutation.addedNodes.forEach((node)=>{
                    if (node.nodeType === 1) { // Only process element nodes
                        const avatarDiv = node.querySelector('div[data-testid="Tweet-User-Avatar"]');
                        if (avatarDiv) {
                          console.log('Avatar found in newly added node:', avatarDiv);
                        }
                      }
                    // if (node.classList && node.classList.contains(""))
                    // console.log("Node added: ", node)
                })
            }
        })
    })
}
// const postList = getPostList()


// const handleMutations = (mutationsList, observer) => {
//     for (const mutation of mutationsList) {
//         if (mutation.type === 'childList') {
//             console.log('A child node has been added or removed.');
//             TwitterHTMLParser(document.body.innerHTML);
//         } else if (mutation.type === 'attributes') {
//             console.log(`The ${mutation.attributeName} attribute was modified.`);
//         }
//     }
// };

// const targetNode = document.getElementById(postList);
const config = {
    attributes: true,
    childList: true,
    characterData:true,
    subtree: true
};
// const observer = new MutationObserver(handleMutations);
setTimeout(()=>{
    console.log("Started ")
    var start = Date.now();
    // const targetNode = postList();
    const targetNode = TwitterHTMLParser(document.body.innerHTML);
    console.log("Target node: ", targetNode)
    // console.log("Target node children: ", targetNode.childNodes)
    console.log("Target node child list: ", targetNode.childList)
    
    if (targetNode){
        console.log("Target node found")
        const observer = new MutationObserver((mutations) => {
            console.log("Started mutation observer!")
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    if (mutation.addedNodes.length > 0){
                        console.log('A child node has been added or removed.');
                        setTimeout(() => {
                            console.log("Mutation observer called")
                            
                            const newList = TwitterHTMLParser(document.body.innerHTML);
                            console.log("New list child nodes: ", newList.childNodes)
                        }, 3000)
                    }
                }
                //added sept23
                mutation.addedNodes.forEach((node)=>{
                    if (node.nodeType===1){
                        const avatarDiv = node.querySelector('div[data-testid="Tweet-User-Avatar"]');
                        if (avatarDiv) {
                            console.log('Avatar found in newly added node:', avatarDiv);
                        }
                    }
                })
                
                // } else if (mutation.type === 'attributes') {
                //     console.log(`The ${mutation.attributes} attribute was modified.`);
                // }
                // else if (mutation.type === "characterData"){
                //     console.log("Character data changed")
                // }
            }
        });
        console.log("Above mutation observer")
        observer.observe(targetNode, config);   
    }

}, 4000)
console.log("Started observer")



// send message to background containing scroll position; if scroll > 50%, reinject content script. also first injection should wait 2ms
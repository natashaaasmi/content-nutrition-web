function TwitterHTMLParser(aHTMLString){
    var parser = new DOMParser();
    
    
    const doc = parser.parseFromString(aHTMLString, "text/html");
    doc.style="background-color: red;"
    // checkAvatarHover()
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
            console.log("User line: ", userLine)
            // await llm here
            let tweetText = testTweet.childNodes[0].childNodes[0].childNodes[1].childNodes[1].childNodes[1].textContent
            getLLMLabel(tweetText)
            .then((foundText)=>{
                
                injectNewElement(userLine, foundText)
                
            })
            getUserProfileDiv(testTweet)
            

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
    try {
        // var tweetText =tweet.childNodes[0].childNodes[0].childNodes[1].childNodes[1].childNodes[1].textContent
        if (tweet){
            console.log("Tweet text: ", tweet)
            const response = await sendMessageToBackground({ message: "generate", input: tweet });
            // console.log("Response from background: ", response)
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

// functions for parsing tweet base
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

//functions for parsing user hover div from timeline
function getUserProfileDiv(tweet){
    console.log("Entered user profile div")
    try {
        console.log("Entered userprofilediv")
        var secondChild = tweet.firstChild.firstChild
        console.log("Second child", secondChild)
        var next = secondChild.childNodes[1]
        console.log("Next", next)
        var userProfileDiv= next.firstChild.firstChild
        console.log("User profile div", userProfileDiv)
        var inserted = ''
        userProfileDiv.addEventListener('mouseover', (event)=>{
            console.log("User profile div hovered", userProfileDiv)
            // inserted = getLinkFromUserProfile(userProfileDiv)
        });
        userProfileDiv.addEventListener('mouseout', (event)=>{
            console.log("mouse out")
            // var el = document.getElementsByClassName="user-nutrition-div"
            // el.forEach((element)=>{
            //     element.style.display="none"
            // })
        })
    }
    catch (error) {
        console.log("Error getting user profile div", error)
    }
}

function getLinkFromUserProfile(userProfileDiv){
    try {
        var link = userProfileDiv.childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[1].firstChild.firstChild.href
        console.log("Link: ", link)
        // 
        console.log("Found user profile div", userProfileDiv)
        insertUserNutritionDiv(userProfileDiv.childNodes[0])
        // link.addEventListener('mouseover', (event) => {
        //     console.log("Link hovered", link)
        // })

    }
    catch (error) {
        console.log("Error getting link from user profile div", error)
    }
}

function insertUserNutritionDiv(parentContainer){
    console.log("Type of parent container", typeof(parentContainer.parentNode))
    const el = parentContainer.parentNode
    console.log("Entered insert user nutrition div")
    if (!el.classList.contains('user-nutrition-div')){
        var container = document.createElement("div")
        container.style.backgroundColor = "gray"
        container.className= "user-nutrition-div"
        container.style.borderRadius = "20px"
        container.style.border = "1px solid lightgray"
        container.style.height = "150px"
        container.style.width = "100px"
        container.style.position = "fixed"
        container.style.marginLeft= "10px"
        container.innerHTML = "inserted container"
        console.log("Container created", container)
        console.log("Parent container: ", el)
        el.classList.add('user-nutrition-div')
        el.appendChild(container)
    }
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
        }
}
function getPostList(){
    var parser = new DOMParser();
    const main = document.querySelector('[role="main"]').querySelector('[aria-label="Home timeline"]');
    const timeline = main.querySelector('[aria-label="Timeline: Your Home Timeline"]');
    const postList = timeline.firstChild;
    return postList
}

function insertCustomDivNextToElement(targetElement) {

    var customDiv = document.createElement("div");
    customDiv.style.backgroundColor = "black";
    customDiv.style.border = "1px solid lightgray";
    customDiv.style.height = "100px";
    customDiv.style.width = "200px";
    customDiv.style.borderRadius = "10px";
    customDiv.style.position = "absolute";
    customDiv.style.innerHTML = "Loading nutrition facts for this user";
    customDiv.id="tweets-container";

    var deleteDiv = document.createElement("div")
    deleteDiv.innerHTML = "x"
    deleteDiv.style.color = "white"
    deleteDiv.style.position = "absolute"
    deleteDiv.style.top = "6px"
    deleteDiv.style.right = "6px"
    deleteDiv.style.fontSize="11px"
    deleteDiv.style.fontFamily = "Arial"
    deleteDiv.style.cursor = "pointer"
    deleteDiv.addEventListener('click', (event)=>{
        console.log("Delete div clicked")
        removeCustomDiv();
    })
    
    customDiv.className="custom-div"
    var titleText = document.createElement("div")
    
    titleText.innerHTML = "Content nutrition"
    titleText.style.fontWidth = "bold"
    titleText.style.color = "white"
    titleText.style.textAlign = "center"
    titleText.style.padding = "10px"
    titleText.style.fontFamily = "Arial"
    customDiv.appendChild(deleteDiv)
    customDiv.appendChild(titleText)

    const rect = targetElement.getBoundingClientRect();
    customDiv.style.top = `${rect.top + window.scrollY + 40 }px`; 
    customDiv.style.left = `${rect.right + 10 + window.scrollX}px`; 
    document.body.appendChild(customDiv);
}

function removeCustomDiv() {
    const customDiv = document.querySelectorAll('.custom-div');
    if (customDiv) {
        customDiv.forEach((div) => {
            div.style.display = "none";
        });
    }
}

//get user tweets
const fetchUserTweets = async (userId, tweetsContainerId) => {
    console.log("btn clicked amd Request sent")
    const response = await fetch('http://localhost:3007/get_user_timeline', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    body: JSON.stringify({ userId }),
    });

    if (response.ok) {
      const data = await response.json();
        const tweetsContainer = document.getElementById(tweetsContainerId);
      
      data.tweets.data.forEach(tweet => {
        getLLMLabel(tweet.text)
        .then((foundText)=>{
            const tweetDiv = document.createElement('div');
            tweetDiv.className = 'tweet';
            tweetDiv.textContent = tweet.text;
            tweetsContainer.appendChild(tweetDiv);
        })
      });
    } else {
      console.error('Error fetching tweets:', response.statusText);
    }
}

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
    const targetNode = TwitterHTMLParser(document.body.innerHTML);
    console.log("Document found", document.body.innerHTML)
    // checkAvatarHover()
    console.log("Target node: ", targetNode)
    // console.log("Target node children: ", targetNode.childNodes)
    console.log("Target node child list: ", targetNode.childList)
    
    if (targetNode){
        console.log("Target node found")
        const observer = new MutationObserver((mutations) => {
            console.log("Entered mutation observer!")
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    if (mutation.addedNodes.length > 0){
                        console.log('A child node has been added or removed.');
                        console.log("Mutation added nodes: ", mutation.addedNodes)
                        // setTimeout(() => {
                        //     console.log("Mutation observer called agan")
                            
                        //     const newList = TwitterHTMLParser(document.body.innerHTML);
                        //     console.log("New list child nodes: ", newList.childNodes)
                        // }, 3000)
                    }
                }
                else if (mutation.type === 'attributes') {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                        const targetElement = document.querySelector('a[aria-hidden="true"]');
                        if (targetElement){
                            // const backgroundColor = targetElement.style.backgroundColor;
                            // console.log("Style changed! New background-color:", backgroundColor);
                            console.log("Target element: ", targetElement)
                            const baseURL = 'https://x.com/'
                            const href = targetElement.href.substring(baseURL.length)
                            console.log("Href", href)
                            setTimeout(() => {
                                if (true) {
                                    console.log("Hovered detected. Inserting custom div.");
                                    console.log("Target element classlist: ", targetElement.classList)
                                    if (!targetElement.classList.contains('hovered')) {
                                        insertCustomDivNextToElement(targetElement)
                                        targetElement.classList.add('hovered');
                                        fetchUserTweets(href, 'tweets-container');


                                        targetElement.addEventListener('mouseout', (event)=>{
                                            console.log("Mouse out")
                                            removeCustomDiv();
                                        })
                                    }
                                } 
                            }, 500)
                        }
                        
                    }

                }
                //added sept23
                // mutation.addedNodes.forEach((node)=>{
                //     if (node.nodeType===1){
                //         const avatarDiv = node.querySelector('div[data-testid="Tweet-User-Avatar"]');
                //         if (avatarDiv) {
                //             console.log('Avatar found in newly added node:', avatarDiv);
                //             avatarDiv.addEventListener('mouseover', (event)=>{
                //                 console.log("Avatar hovered", event)
                //             })
                //         }
                //     }
                // })
            }
        });
        // console.log("Above mutation observer")
        observer.observe(targetNode, config);   
    }

}, 4000)
console.log("Started observer")
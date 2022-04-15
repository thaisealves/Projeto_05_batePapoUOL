let messages = []; // messages we're going to collect from the API are going to be here

const participant = {
    name: "jou"
} // name I'm putting as mine, like, the participant one 

getMessages();

function entering() {
    axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", participant);
} // loging into the page, like, putting my name in the participants area
entering();

function seeStatus() {
    axios.post("https://mock-api.driven.com.br/api/v6/uol/status", participant);
}   //see if I'm here, still logged and everything 
setInterval(seeStatus, 3000);

function getMessages() {
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");

   
    promise.then(loadData);
} // getting the messages from the API 
setInterval(getMessages, 2000)
function error() {
    console.log(error.response);
} //if something goes wrong on the part off getting messages

function loadData(response) {
    messages = response.data;
    printMessages();
    console.log("deu certo")
} // if everything goes well, we're putting the messages on our array **THE PROMISE HAS A RESPONSE
setInterval(loadData, 4000); // keep on showing messages at the time it appears 
function printMessages(){
    const ulMessages = document.querySelector("main ul")
    ulMessages.innerHTML ="";
    for (let i = 0; i < messages.length; i++){
        ulMessages.innerHTML += `
        <li id=${i}>
        <span class="time">(${messages[i].time})</span>
        <span class="name">${messages[i].from}</span> 
        
        ${messages[i].text}
        </li>`
        if (messages[i].type === "status"){
            document.getElementById(`${i}`).classList.add("statusMsg")
        }
        if (messages[i].type === "message"){
            document.getElementById(`${i}`).classList.add("groupMsg")
        }
        if (messages[i].type === "private_message"){
            document.getElementById(`${i}`).classList.add("privateMsg")
        }
        
    }
    pageScroll();
}
function pageScroll() {
    window.scrollBy(0,1);
    setTimeout(pageScroll,10);
}
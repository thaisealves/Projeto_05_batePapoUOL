let messages = []; // messages we're going to collect from the API are going to be here
const participant = {
    name: ''
} // name I'm putting as mine, like, the participant one 
let textEnter = document.querySelector("footer textarea")
textEnter.addEventListener("keyup")
function entering() {
    participant.name = document.querySelector(".begin input").value;
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", participant);
    promise.catch(error)
    promise.then(getMessages)// keep on showing messages at the time it appears, reloading the messages all the time

} // loging into the page, like, putting my name in the participants area


function error(err) {
    if (err.response.status === 400) {
        alert("Nome já utilizado, você deve escolher outro!")
        setTimeout(entering, 5000)
    }
} //if something goes wrong on the part of getting messages (username already used)

function getMessages() {
    document.querySelector(".begin").classList.add("hidden")
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");

    promise.then(loadData);
} // getting the messages from the API 

function loadData(response) {
    messages = response.data;
    printMessages();
} // if everything goes well, we're putting the messages on our array **THE PROMISE HAS A RESPONSE

function keepStatus() {
    axios.post("https://mock-api.driven.com.br/api/v6/uol/status", participant);
}   //see if I'm here, still logged and everything 
setInterval(keepStatus, 4000);

//the messages appearing on the "app" 
function printMessages() {
    const ulMessages = document.querySelector("main ul")
    ulMessages.innerHTML = "";
    for (let i = 0; i < messages.length; i++) {
        ulMessages.innerHTML += `
        <li id=${i}>
        <span class="time">(${messages[i].time})</span>
        <span class="name">${messages[i].from}</span> 
        
        ${messages[i].text}
        </li>`
        if (messages[i].type === "status") {
            document.getElementById(`${i}`).classList.add("statusMsg")
        }
        if (messages[i].type === "message") {
            if (messages[i].to !== "Todos") {
                document.getElementById(`${i}`).classList.add("hidden")
            }
            else {
                document.getElementById(`${i}`).classList.add("groupMsg")
            }

        }
        if (messages[i].type === "private_message") {
            if (messages[i].to !== participant.name) {
                document.getElementById(`${i}`).classList.add("hidden")
            }
            else {
                document.getElementById(`${i}`).classList.add("privateMsg")
            }
        }
        if (messages[i].type === "message" || messages[i].type === "status") {
            document.getElementById(`${i}`).querySelector(".name").innerHTML += ` <span class='not-bold'>para</span> ${messages[i].to}`
        }
        if (messages[i].type === "private_message") {
            document.getElementById(`${i}`).querySelector(".name").innerHTML += ` <span class='not-bold'> reservadamente para</span> ${messages[i].to}`
        }

    }

    pageScroll();
    setInterval(getMessages, 4000);
}
function pageScroll() {
    window.scrollBy(0, 1);
    setTimeout(pageScroll, 25);
}

function publicMessage() {
    let text = document.querySelector("textarea");
    const message = {
        from: participant.name,
        to: "Todos",
        text: text.value,
        type: "message"
    }
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", message);
    text.value = ''; // here I can clear the input area, so I can write another thing
    promise.then(getMessages());
    promise.catch(function () {
        alert("Desconectado da sala, vamos te conectar novamente")
        window.location.reload();
    })
}
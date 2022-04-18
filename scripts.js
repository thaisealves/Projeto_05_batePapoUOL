let messages = []; // messages we're going to collect from the API are going to be here
let users = [];
let msgTo = "Todos";
let msgType = "message"
const participant = {
    name: ''
} // name I'm putting as mine, like, the participant one

//if i press enter being in the textarea, this will happen
let textEnter = document.querySelector("footer textarea")
textEnter.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();//preventing the enterbutto to make the thing its used to do
        document.querySelector("footer ion-icon").click(); //making the 'on-click' to work by pressing enter
    }
});

function entering() {
    document.querySelector(".login").classList.add("hidden")
    document.querySelector(".loading").classList.remove("hidden")
    participant.name = document.querySelector(".begin input").value;
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", participant);
    promise.catch(error)
    promise.then(msgInterval)// keep on showing messages at the time it appears, reloading the messages all the time

} // loging into the page, like, putting my name in the participants area
function msgInterval() {
    setInterval(getMessages, 3000);
    setInterval(getUsers, 10000)
}

function error(err) {
    if (err.response.status === 400) {
        alert("Nome já utilizado, você deve escolher outro!")
        document.querySelector(".login").classList.remove("hidden")
        document.querySelector(".loading").classList.add("hidden")
    }
} //if something goes wrong on the part of getting messages (username already used)

function getMessages() {
    document.querySelector(".begin").classList.add("hidden")
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");

    promise.then(loadData);
} // getting the messages from the API

function loadData(response) {
    messages = response.data;
    printMessages(messages);
} // if everything goes well, we're putting the messages on our array **THE PROMISE HAS A RESPONSE

function keepStatus() {
    axios.post("https://mock-api.driven.com.br/api/v6/uol/status", participant);
}   //see if I'm here, still logged and everything
setInterval(keepStatus, 4000);

//the messages appearing on the "app"
function printMessages(messages) {
    const ulMessages = document.querySelector("main ul")
    ulMessages.innerHTML = "";
    for (let i = 0; i < messages.length; i++) {
        ulMessages.innerHTML += `
        <li >
        <span class="time">(${messages[i].time})</span>
        <span class="name">${messages[i].from}</span>
        
        <span>${messages[i].text}</span>
        </li>`
        ulMessages.lastChild.id = i;

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
            if (messages[i].to !== participant.name && messages[i].from !== participant.name) {
                document.getElementById(`${i}`).classList.add("hidden")
            }
            else {
                document.getElementById(`${i}`).classList.add("privateMsg")
            }
        }
        if (messages[i].type === "message" || messages[i].type === "status") {
            document.getElementById(`${i}`).querySelector(".name").innerHTML += `<span class='not-bold'> para</span> ${messages[i].to}`
        }
        if (messages[i].type === "private_message") {
            document.getElementById(`${i}`).querySelector(".name").innerHTML += `<span class='not-bold'> reservadamente para</span> ${messages[i].to}`
        }

    }
    document.querySelector("main").scrollIntoView(false) //putting in the last msg everytime it reload
}


function publicMessage() {
    let text = document.querySelector("textarea");
    const message = {
        from: participant.name,
        to: msgTo,
        text: text.value,
        type: msgType
    }
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", message);
    text.value = ''; // here I can clear the input area, so I can write another thing
    promise.then(getMessages());
    promise.catch(function () {
        alert("Desconectado da sala, vamos te conectar novamente")
        window.location.reload();
    })
}

//looking for the participants

function getUsers() {
    let promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants')
    promise.then(loadUsers);
}

function loadUsers(response) {
    users = response.data;
    printUsers();

}
function printUsers() {
    const ulUsers = document.querySelector(".users")
    ulUsers.innerHTML = "";
    ulUsers.innerHTML +=
        `<li class="all">
    <ion-icon name="people"></ion-icon>
    <span onclick="msgSender(this)">Todos</span>
    </li>`

    for (let i = 0; i < users.length; i++) {
        ulUsers.innerHTML += `
        <li id=${i}>
        <ion-icon name="person-circle"></ion-icon>
        <span onclick="msgSender(this)" >${users[i].name} </span>
        </li>`
    }
}
function showUsers() {
    document.querySelector("aside").classList.remove("hidden");
    document.querySelector("aside").classList.add("upper");
}
function hideUsers() {
    document.querySelector("aside").classList.add("hidden");
    document.querySelector("aside").classList.remove("upper");
}

function msgSender(el) {
    msgTo = el.innerHTML;
    if (msgTo !== "Todos") {
        document.querySelector("footer p").innerHTML = `Enviando para ${msgTo} (reservadamente)`
    }
    if (msgTo === "Todos"){
        document.querySelector("footer p").innerHTML = ""
    }
}

function privacity (el){
    if (document.querySelector("selected")!== null){

        el.querySelector(".mark").classList.add("hidden")
    el.querySelector(".mark").classList.remove("selected")
    }
    if (el.querySelector("span").innerHTML === "Reservadamente"){
        msgType = "private_message";
        
    }
    else{
        msgType = "message";
    }

    el.querySelector(".mark").classList.remove("hidden")

    el.querySelector(".mark").classList.add("selected")
}
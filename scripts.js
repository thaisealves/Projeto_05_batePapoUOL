const participant = {
    name: "Thaíse"
}

function entering (){
  axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", participant)
}
entering();

function seeStatus(){
    axios.post("https://mock-api.driven.com.br/api/v6/uol/status", participant)
}
setInterval(seeStatus, 4000)
const prompt = require('prompt');
var request = require('request');

prompt.start();


var baseUrl = "https://us-central1-rival-chatbot-challenge.cloudfunctions.net";
var conversation_id = "";

// send POST requests to the api with the specifi object and url
async function sendRequest(object,url) {
  
  let promise = new Promise((resolve, reject) => {
	    request({
	    url: baseUrl+url,
	    method: "POST",
	    headers: {
	        "content-type": "application/json",  
	    },
	    json: true,   
	    body: object
		}, function (error, response, body){
	    resolve(response.body);
	});
  });

  return await promise;

}

// get answer from user input
async function getAnswer() {

  let promise = new Promise((resolve, reject) => {
	    prompt.get(['answer'], function (err, result) {
	    if (err) { return onErr(err); }
		resolve({ 'content':result.answer});
		});	
  });

  return await promise;
  
}

// send GET request to the api to receive the question
async function getQuestion(conversation_id) {
  
  let promise = new Promise((resolve, reject) => {
	    request({
	    url: baseUrl + '/challenge-behaviour/'+conversation_id ,
	    method: "GET",
	    headers: {
	        "content-type": "application/json",  
	    },
	    json: true,   
		}, function (error, response, body){
	    console.log(response.body);
	    if (JSON.stringify(response.body).includes('Thank')) { return ; }
	    resolve(response.body);
	});
  });

  return await promise;

}

// get name and email from user input
async function getInfo() {

  let promise = new Promise((resolve, reject) => {
	    prompt.get(['name', 'email'], function (err, result) {
	    if (err) { return onErr(err); }
		resolve({ 'name':result.name,'email':result.email});

		});	
  });

  return await promise;
  
}



// loop over questions till we receive the thank you message
const loop = async value => {
  let result = null
  while (true) {
    result = await getQuestion(conversation_id)
    .then(result=>getAnswer())
	.then(result => sendRequest(result,'/challenge-behaviour/'+conversation_id));

  }
}

// start the process by getting the user info
async function start(){
	getInfo()
	.then(result => sendRequest(result,'/challenge-register'))
	.then(result => sendRequest(result,'/challenge-conversation'))
	.then(result => conversation_id = result.conversation_id)
	.then(result => loop())
	.then(() => console.log('all done!'))

}



const init = () => start();


module.exports = { init: init, sendRequest: sendRequest, getQuestion:getQuestion };

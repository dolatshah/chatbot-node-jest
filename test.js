const chat = require("./chat");


describe("sendRequest function (register)", () => {
  test("it should receive an user id from server", () => {
    

    var object = { 'name':'test','email':'test'}

    return chat.sendRequest(object, "/challenge-register").then(data => expect(data).toHaveProperty('user_id'));

  });
});



describe("sendRequest function (conversation)", () => {
  test("it should receive a conversation id from server", () => {
    

    const object = { 'user_id':'5705838115160064'}

    return chat.sendRequest(object, "/challenge-conversation").then(data => expect(data).toHaveProperty('conversation_id'));    
  });
});



describe("getQuestion function (behaviour)", () => {
  test("it should receive the correct question from server", () => {
    

    const conversation_id = "5672529351933952"
    const output = "Welcome to the Rival Chatbot Challenge."

    return chat.getQuestion(conversation_id).then(data => expect(data.messages[0].text).toEqual(output));
  });
});



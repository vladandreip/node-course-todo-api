const {SHA256} = require('crypto-js');//playground purposes 
//the entire token identification mechanism is actually a standard called the Json Web Token
const jwt = require('jsonwebtoken');
var message = ' I am user number 3'
var hash = SHA256(message).toString();
console.log(`Message: ${message}`);
console.log(`Hash: ${hash}`);
//secret is only on the server
// var data = {
//     id :4
// };
// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }
// token.data.id = 5;//user 4 wants to fuck up user 5
// token.hash = SHA256(JSON.stringify(token.data)).toString();

// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
// if(resultHash === token.hash){
//     console.log('Data was not change');
// }else {
//     console.log('Data was changed. Do not trust!');
// }
var data = {
    id:10
};
//data and secret
var token = jwt.sign(data, '123abc')//takes the object, in this case the data with the user id and it signs it -> creates that hash and then returns the token value
//only when the token is unmodified and the secret is the same, we get the data back.
// Once we decode the data after the person makes the request with the token, we can use that id to start doing what the user wanted to 

var decoded = jwt.verify(token, '123abc')//takes the token and the secret and makes sure the data was not manipulated
console.log('decoded', decoded);//iat is the timestamp in which the token was created
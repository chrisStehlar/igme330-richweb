//console.log("Hello World!");

const request = require('request');

let options = {
    url: 'https://geek-jokes.sameerkumar.website/api?format=json',
    method: 'GET'
}

let cowsay = require('cowsay');

request(options, (err, response, body) => {
    if(!err && response.statusCode == 200)
        console.log(cowsay.say({
            text: body,
            e: "oO"
    }))
});
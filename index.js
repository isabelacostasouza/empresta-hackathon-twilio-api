const express = require('express');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var path = require('path');
var cors = require('cors');
const App = express();

const config = require('./config');
const client = require('twilio')(config.accountSID, config.authToken)

App.use(cors());

App.get('/', async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    return res.sendFile(path.resolve('main-page.html'));
});

App.get('/send_sms', async (req, res) => {
    const entries = req.headers;
    const phoneNumber = "+55" + entries.telefone.toString();

    client.verify.services(config.serviceID)
    .verifications
    .create({
        to: phoneNumber,
        channel: 'sms'
    })
    .then(data => {
        res.status(200).send(data)
    }) 
    .catch(error => {
        response.setBody({
        "success": false,
        "message": error
        })
        response.setStatusCode(400)
        callback(null, response)
    });
});

App.get('/validate_sms', async (req, res) => {
    const entries = req.headers;
    const phoneNumber = "+55" + entries.telefone.toString();
    const validationCode = entries.codigo;

    client.verify.services(config.serviceID)
    .verificationChecks
    .create({
        to: phoneNumber,
        code: validationCode
    })
    .then(data => {
        if (data.status == "approved") {
            res.status(200).send(data.status)
        } else {
            res.status(300).send(data.status)
        }
    })
    .catch(error => { res.status(300).send('wrong code!'); });
});

var porta = process.env.PORT || 8080;
App.listen(porta);

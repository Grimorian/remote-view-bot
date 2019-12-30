const bodyParser = require('body-parser'),
jsonParser = bodyParser.json()

const request = require('request') 

const express = require('express'),
app = express()
port = process.env.PORT || 8080,
botkey = process.env.BOTKEY || ':',
url = `https://api.telegram.org/bot${ botkey }/sendMessage`


app.get('/', (req, res) => {
    res.send('Remote Viewer Bot API')
})

app.post('/', jsonParser, (req, res) => {
    console.log(req.body)
    res.send(req.body)
})

app.post('/target', jsonParser, target)

app.listen(port, () => console.log(`Listening on port ${port}`))

function target(req, res) {
  request
  .post(url)
  .form({ chat_id: req.body.message.chat.id, text: 'Greetings from the server ' + JSON.stringify(req.body.message) })
  .on('response', response => res.send('Test'))
}



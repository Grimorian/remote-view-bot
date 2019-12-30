const bodyParser = require('body-parser'),
jsonParser = bodyParser.json()

const request = require('request') 

const express = require('express'),
app = express()
port = process.env.PORT || 8080,
botkey = process.env.BOTKEY || ':',
url = `https://api.telegram.org/bot${ botkey }`

let chats = {}

app.get('/', (req, res) => {
    res.send('Remote Viewer Bot API')
})

app.post('/', jsonParser, (req, res) => {
    console.log('Update received')
    console.log(req.body)
    
    const chatId = req.body.message.chat.id,
    name = req.body.message.from.first_name

    if(chats[chatId]) {
      sendMessage(chatId, `Welcome back, ${ name }!`)
    } else {
      sendMessage(chatId, 
      `Hello ${ name }, I am the Remote View bot. 
      You can use the following commands:
      /target     To specify a new target (random picture)
      /reveal     To reveal the target`)
      chats[chatId] = { target : undefined }
    }
    
    res.send(req.body)
})

app.listen(port, () => console.log(`Listening on port ${port}`))

function sendMessage(chatId, text, callback) {
  request
  .post(`${ url }/sendMessage`)
  .form({ chat_id: chatId, text })
  .on('response', response => {
    console.log(JSON.stringify(response))
    callback && callback(response)
  })
}



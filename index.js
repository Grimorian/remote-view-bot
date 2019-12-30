/**
 * 
 * ================
 * Remote View Bot
 * ================
 * You can use the following commands:
 *    /target     To specify a new target (random picture)
 *    /reveal     To reveal the target
 * 
 */

 const instructions = `
 You can use the following commands:
/target     To specify a new target (random picture)
/reveal     To reveal the target
`
 
const nanoid = require('nanoid'),
generate = require('nanoid/generate')

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
    name = req.body.message.from.first_name,
    msg = req.body.message.text

    if(chats[chatId]) {
      sendMessage(chatId, `Welcome back, ${ name }! ${ instructions }`)
    } else {
      sendMessage(chatId, `Hello ${ name }, I am the Remote View bot. ${ instructions }`)
      chats[chatId] = { target : undefined }
    }

    switch(msg) {
      case '/target': 
        const id = randomId()

        chats[chatId].id = id
        chats[chatId].image = `https://picsum.photos/seed/${ id }/450`

        sendMessage(chatId, 'OK, I have found a random image and assigned it this random ID: ' + id)
        sendMessage(chatId, 'When you are ready to see the image use the command /reveal')
      break
      
      case '/reveal': 
        if(chats[chatId] && chats[chatId].id && chats[chatId].image) {
          sendMessage(chatId, `Revealing id ${ chats[chatId].id }`)
          sendMessage(chatId, chats[chatId].image)
        } else sendMessage(chatId, 'Nothing to reveal. Use the /target command first.')
      break
        
      default: 
        sendMessage(chatId, instructions)
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

function randomId() {
  return `${ generate('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 4) }-${ generate('1234567890', 4) }`
}



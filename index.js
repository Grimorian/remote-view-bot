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
    
    const chatId = req.body.message.chat.id,
    name = req.body.message.from.first_name,
    msg = req.body.message.text
    console.log(`${ chatId } ${ name } ${ msg }`)

    if(!chats[chatId]) {
      sendMessage(chatId, `Welcome ${ name }, I am the Remote View Bot 🤖.`)
      chats[chatId] = { id : undefined }
    }

    switch(msg) {
      case '/target': 
        const id = randomId()

        chats[chatId].id = id
        chats[chatId].image = `https://picsum.photos/seed/${ id }/600`

        sendMessage(chatId, `✅ OK, I have found a random image and assigned it this random ID: *${ id }*. When you are ready to see the image use the command /reveal.`)
      break
      
      case '/reveal': 
        if(chats[chatId] && chats[chatId].id && chats[chatId].image) {
          sendMessage(chatId, chats[chatId].image, () => {
            sendMessage(chatId, `Revealed image with ID *${ chats[chatId].id }*. Would you like to try again? ${ instructions }`)
          })
        } else sendMessage(chatId, 'Nothing to reveal. Use the /target command first.')
      break
        
      default: 
        sendMessage(chatId, instructions)
    }
    res.send(req.body)
})

app.listen(port, () => console.log(`Bot is LISTENING on port ${port}`))

function sendMessage(chatId, text, callback) {
  request
  .post(`${ url }/sendMessage`)
  .form({ chat_id: chatId, text, parse_mode: 'Markdown' })
  .on('response', response => {
    console.log(response.statusCode)
    callback && callback(response)
  })
}

function randomId() {
  return `${ generate('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 4) }-${ generate('1234567890', 4) }`
}



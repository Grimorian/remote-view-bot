const bodyParser = require('body-parser'),
jsonParser = bodyParser.json()

const express = require('express'),
app = express()
port = process.env.PORT || 8080,
botkey = process.env.BOTKEY || '',
url = `https://api.telegram.org/bot${ botkey }/getMe`


app.get('/', (req, res) => {
    res.send('Remote Viewer Bot API')
})

app.post('/', jsonParser, (req, res) => {
    console.log(req.body)
    res.send(req.body)
})

app.listen(port, () => console.log(`Listening on port ${port}`))

function target(req, res, next) {
    http.get(url, res => {
      const { statusCode } = res
      const contentType = res.headers['content-type']
    
      let error
      if (statusCode !== 200) {
        error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`)
      } 

      if (error) {
        console.error(error.message)
        res.resume()
        return
      }
    
      res.setEncoding('utf8')
      let rawData = ''
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(rawData);
          console.log(parsedData)
        } catch (e) {
          console.error(e.message)
        }
      })
    }).on('error', console.error)
}

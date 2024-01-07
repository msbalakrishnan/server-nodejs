// common core modules needed //...
const http = require('http')
const event = require('events')
const path = require('path')
const fs = require('fs')
const fspromises = require('fs/promises')

// define port number 
const PORT = process.env.PORT || 3001

// creating the server 
const server = http.createServer((req, res) => {
    // console.log(req.url, req.method)
    // console.log("url parse ->", path.parse(req.url))
    const extension = path.parse(req.url).ext;
    let contentType;
    let filePath;
    const url = req.url
    switch (extension) {
        case '.css':
            contentType = 'text/css'
            filePath = path.join(__dirname, url)
            break;
        case '.js':
            contentType = 'text/javascript'
            filePath = path.join(__dirname, url)
            break
        case '.json':
            contentType = 'application/json'

            filePath = path.join(__dirname, url)
            break
        case '.png':
            contentType = 'image/png'
            filePath = path.join(__dirname, url)
            break
        case '.text':
            filePath = path.join(__dirname, url)
            contentType = 'text/plain'
            break
        default:
            filePath = path.join(__dirname, 'views', url)
            contentType = 'text/html'
            break
    }

    // creating the async function for serve the file
    const serveFile = async (filePath, contentType) => {
        try {

            const code = filePath.includes('404.html') ? 404 : 200
            const encryption = contentType === 'image/png' ? '' : 'utf-8'
            const data = await fspromises.readFile(filePath, encryption)
            // const rawData = data
            // console.log(data)
            const rawData = filePath.includes('.json') ? JSON.parse(data) : data
            res.statusCode = code
            res.write(filePath.includes('.json') ? JSON.stringify(rawData) : rawData)
            res.end()
        } catch (err) {
            console.log(err)
        }

    }
    console.log('request path is -> ', filePath)
    if (fs.existsSync(filePath)) {
        serveFile(filePath, contentType)

    } else {
        serveFile(path.join(__dirname, 'views', '404.html'), 'text/html')
    }

})
// setting the port to the server to run 
server.listen(PORT, () => console.log(`server is running on port --${PORT} `))

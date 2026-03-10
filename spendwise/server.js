const http = require("http")
const fs = require("fs")
const path = require("path")

const PORT = 5000
const SAVE_FILE = path.join(__dirname, "save.json")

const server = http.createServer((req, res) => {

    // API Routes
    if (req.url === "/api/load" && req.method === "GET") {
        fs.readFile(SAVE_FILE, "utf8", (err, data) => {
            res.writeHead(200, { "Content-Type": "application/json" })
            res.end(data || "[]")
        })
        return
    }

    if (req.url === "/api/save" && req.method === "POST") {
        let body = ""
        req.on("data", chunk => body += chunk.toString())
        req.on("end", () => {
            fs.writeFile(SAVE_FILE, body, err => {
                if (err) {
                    res.writeHead(500)
                    res.end("Error saving data")
                } else {
                    res.writeHead(200)
                    res.end("Success")
                }
            })
        })
        return
    }

    // Static Files
    let filePath = "./public" + req.url
    if (req.url === "/") filePath = "./public/index.html"

    const ext = path.extname(filePath)
    let contentType = "text/html"

    if (ext === ".css") contentType = "text/css"
    if (ext === ".js") contentType = "text/javascript"
    if (ext === ".json") contentType = "application/json"
    if (ext === ".png") contentType = "image/png"

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404)
            res.end("Page not found")
        } else {
            res.writeHead(200, { "Content-Type": contentType })
            res.end(content)
        }
    })
})

server.listen(PORT, () => {
    console.log(`SpendWise running on http://localhost:${PORT}`)
})

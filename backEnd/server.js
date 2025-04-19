import express from 'express'
import url from 'url'
import path, { dirname,join } from "path"
import connection from './connection.js'

import insta_routes from "./router/router.js"

import env from "dotenv"

env.config()

const file_name = url.fileURLToPath(import.meta.url)

const __dirname = dirname(file_name)

// const frontEnd = join(__dirname,"..","frontEnd")


const port = 8080
// console.log(frontEnd)
const app = express()
const frontEnd = join(__dirname, "..", "frontEnd")
app.use(express.static(frontEnd))

// app.get("/", (req, res) => {
//     res.sendFile(join(frontEnd, "index.html"));
//   });


app.use(express.json({limit:"150mb"}))



app.use("/api",insta_routes)

connection().then(()=>{
    app.listen(port,()=>{
        console.log("Server Running on http://localhost:8080")
    })
})



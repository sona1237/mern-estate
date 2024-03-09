import express from "express"
import mongoose from "mongoose"

mongoose.connect("mongodb+srv://netninja:Sona123Test@cluster0.juhwuwp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
const app = express()

app.listen(3000, () => {
    console.log("server running on port 3000!!")                                                                                 
})
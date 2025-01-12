require('dotenv').config();
const express = require("express");
const app = express();
const authRoutes = require("./routes/authRouter");
const portalRouter = require("./routes/portalRouter");
const jobRouter = require("./routes/jobRouter");
const documentRouter = require("./routes/documentRouter");
const bodyParser = require('body-parser');

const port = process.env.PORT ;


app.use(bodyParser.json());
app.use("/api/auth", authRoutes);
app.use("/api", portalRouter)
app.use("/api", jobRouter)
app.use("/api", documentRouter)

app.listen(port, ()=>{
    console.log(`application Running on Port ${port}`);
    
})
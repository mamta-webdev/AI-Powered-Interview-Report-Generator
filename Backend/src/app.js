const express = require("express");
const cookieParser = require("cookie-parser")
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials:true
}))

/**require all the routes here */
const router = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes")


/**using all the routes */
app.use("/api/auth", router)
app.use("/api/interview",interviewRouter)


module.exports = app;
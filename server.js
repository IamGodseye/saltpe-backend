import express from "express";
import cors from "cors";

// morgan for debugging incoming requests
const morgan = require("morgan");

require("dotenv").config();
// database operations
import mongoose from "mongoose";

// file-system
import { readdirSync } from "fs";

// cookie and csrf token
import cookieParser from "cookie-parser";
import csrf from "csurf";

//create express app
const app = express();
const csrfProtection = csrf({ cookie: true });

//db connection
mongoose
    .connect(process.env.DATABASE, { useUnifiedTopology: true })
    .then(() => console.log("<== DB Connected ==>"))
    .catch((err) => console.log("DB Connection Err=>", err));

//apply middle-wares
app.use(cors());

app.use(express.json({ limit: "5mb" }));

// only dev middlewares
const environment = process.env.NODE_ENV
const isDev = environment === 'development'
if (isDev) app.use(morgan("dev"));

app.use(cookieParser());
//route
readdirSync("./routes").map((r) => {
    app.use("/api", require(`./routes/${r}`));
});
app.use(csrfProtection);
app.get("/api/csrf-token", (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

// error handler middleware
app.use((error, req, res, next) => {
    console.error("ERROR", error.stack)
    res.status(500).json({ message: error.message || 'Something broke on server-side!', error })
})
//port
const port = process.env.PORT || 5500;

app.listen(port, () => console.log(`server is running on port ${port}`));
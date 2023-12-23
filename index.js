import express from "express";
import dotenv from "dotenv";
import passport from "passport";

import authRouter from "./routes/auth.js";
import userRouter from "./routes/user.js";
import { initPassport } from "./lib/passport.js";
import { connect } from "./lib/db.js";

dotenv.config();

const app = express();

const port = process.env.PORT || 3000;

connect(); // Database connection
initPassport();

app.use(express.json());
app.use(passport.initialize());

app.get("/", (_, res) => {
    res.json({
        message: "Hello World!"
    });
});

app.get("/facebook", (req, res) => {
    res.sendFile("./index.html");
});

app.use("/auth", authRouter);
app.use("/users", userRouter);

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})

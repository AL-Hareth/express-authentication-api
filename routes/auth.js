import { Router } from "express";
import passport from "passport";
import { User } from "../lib/db.js";
import { hash, genSalt } from "bcrypt";
import { validatePassword, issueToken } from "../lib/utils.js";

const router = Router();

router.get("/", (_, res) => {
    res.json({
        message: "Hello from auth",
    });
});

router.get("/protected", passport.authenticate("jwt", { session: false }), (_, res) => {
    res.json({
        message: "Hello from protected",
    });
});

router.post("/login", async (req, res) => {
    console.log("auth");
    const { email, password } = req.body;
    const user = await User.findOne({
        where: {
            email,
        }
    });

    if (!user) {
        return res.status(401).json({ message: "User not found" });
    }

    const isValid = validatePassword(password, user.password, user.salt);

    if (!isValid) {
        return res.status(401).json({ message: "Invalid password" });
    }

    const jwt = issueToken(user);

    res.status(200).json({ token: jwt.token, expiresIn: jwt.expiresIn, success: true });

});

router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    const salt = await genSalt();
    const hashedPassword = await hash(password, salt);

    const user = await User.findOne({ where: { email } });

    if (user) {
        return res.status(400).json({ message: "User already exists" });
    }

    try {
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            salt
        });

        res.status(201).json({
            message: "User created successfully",
            user
        });

    } catch (error) {
        res.status(301).json({ error: error.message });
    }

});

router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

router.get('/google/callback', passport.authenticate('google', { session: false }), async (req, res) => {
    try {
        const user = await User.findOrCreate({
            where: {
                username: req.user[0].dataValues.username,
                googleId: req.user[0].dataValues.googleId
            }
        });

        const jwt = issueToken(user[0]);

        res.status(200).json({ token: jwt.token, expiresIn: jwt.expiresIn, success: true });
    } catch (error) {
        res.json({ error });
    }
});

export default router;


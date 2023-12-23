import { Router } from "express";
import { User } from "../lib/db.js";

const router = Router();

router.get('/', async (req, res) => {
    if(req.headers.authorization) {
        console.log("here");
        const users = await User.findAll();
        return res.json(users);
    }

    return res.status(403).json({
        message: "Not authorized"
    })
});

export default router;

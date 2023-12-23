import jsonwebtoken from "jsonwebtoken";
import { hash } from "bcrypt";
import { readFileSync } from "fs";

const PRIV_KEY = readFileSync("./id_rsa_priv.pem", "utf8");

export async function validatePassword(password, hashedPassword, salt) {
    return hashedPassword === await hash(password, salt);
}

export function issueToken(user) {
    const { id } = user;
    const expiresIn = 60 * 60 * 24 * 7; // 7 days

    const payload = {
        sub: id,
        username: user.username,
        iat: Date.now()
    };

    const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, {
        expiresIn,
        algorithm: "RS256"
    });

    return {
        token: "Bearer " + signedToken,
        expiresIn
    };
}

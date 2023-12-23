import { Strategy, ExtractJwt } from "passport-jwt";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { readFileSync } from "fs";
import { User } from "./db.js";
import passport from "passport";

const PUB_KEY = readFileSync("./id_rsa_pub.pem", "utf8");

export function initPassport() {

    // set up email-password auth
    passport.use(new Strategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: PUB_KEY,
        algorithms: ["RS256"]
    }, (payload, done) => {

        User.findOne({
            where: {
                id: payload.sub
            }
        }).then(user => {
            if (user) {
                return done(null, user);
            }

            return done(null, false);
        }).catch(err => {
            done(err, false);
        });
    }));

    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID ?? "",
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: "http://localhost:3000/auth/google/callback"
    }, async function(accessToken, refreshToken, profile, done) {
        try {
            const user = await User.findOrCreate({
                where: {
                    email: "",
                    username: profile.displayName,
                    googleId: profile.id
                }
            });

            if (!user) {
                return done(null, false);
            }

            return done(null, user);
        } catch (error) {
            console.log(error);
            return done(error);
        }
    }));

    passport.serializeUser((user, done) => {
        console.log("serialization");
        done(null, user);
    });

    passport.deserializeUser((obj, done) => {
        console.log("deserialization");
        done(null, obj);
    });
}

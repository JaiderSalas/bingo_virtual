import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

export function createAccessToken(payload) {


    return new Promise((resolve, reject) => {
        jwt.sign(
            payload, 
            dotenv.config().parsed.JWT_SECRET, 
            { 
                expiresIn: '1d' 
            }, 
            (err, token) => {
            if (err) {
                reject(err)
            }
            resolve(token)
        })
    })

}
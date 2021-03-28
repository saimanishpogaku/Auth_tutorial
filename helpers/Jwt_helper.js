const JWT = require('jsonwebtoken');
const createError = require('http-errors');

module.exports = {
    signAccessToken : function(payload) {
        return new Promise((resolve,reject) => {
            let secret = process.env.SECRETKEY,options = { expiresIn : "1h"};
            JWT.sign(payload,secret,options,(err,token) => {
                if(err) reject(createError.InternalServerError('Failed creating access token'));
                resolve(token);
            });
        });
    },
    verifyAccessToken : function(token){
        return new Promise((resolve,reject) => {
            JWT.verify(token, process.env.SECRETKEY, function(err, decoded) {
                if(err) reject(createError.Unauthorized('Invalid access token!'));
                resolve(decoded);
            });
        })
    },
    signRefreshToken : function(payload) {
        return new Promise((resolve,reject) => {
            let secret = process.env.REFRESHKEY,options = { expiresIn : "1y"};
            JWT.sign(payload,secret,options,(err,token) => {
                if(err) reject(createError.InternalServerError('Failed to verify refresh token'));
                resolve(token);
            });
        });
    },
    verifyRefreshToken : function(token){
        return new Promise((resolve,reject) => {
            JWT.verify(token, process.env.REFRESHKEY, function(err, decoded) {
                if(err) reject(createError.Unauthorized('Invalid refresh token!'));
                resolve(decoded);
            });
        })
    }
}
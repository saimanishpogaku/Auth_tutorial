const router = require('express')();
const bcrypt = require("bcrypt");
const createError = require('http-errors');
const User = require('../Models/User.model');
const UserRegisterSchema = require('../helpers/UserRegisterSchema');
const UserLoginSchema = require('../helpers/UserLoginSchema');
const UserUpdateSchema = require('../helpers/UserUpdateSchema');
const  { 
    signAccessToken,
    verifyAccessToken,
    signRefreshToken,
    verifyRefreshToken 
    } = require('../helpers/Jwt_helper');

router.post('/register',async (req,res,next) => {
    let output = {code:1,message:"Oops Something went wrong"};
    try{
        let filter;
        let user = await UserRegisterSchema.validateAsync(req.body);
        if(!user.email && !user.mobile) {
            throw createError.BadRequest('email or mobile is mandatory!');
        }
        if(!user.email) {
            filter = {
                mobile:user.mobile
            } 
        }
        if(!user.mobile) {
            filter = {
                email:user.email
            }
        }
        if(user.email && user.mobile) {
            filter = {
                $or : [
                    {email:user.email},
                    {mobile:user.mobile}
                ] 
            } 
        }
        // console.log(filter);return;
        let userList = await User.find(filter);//returns empty array if no user exists.
        // console.log(userList);return;
        if(userList.length <= 0){
        
            let userObj = new User({
                email:!(user.email) ? '' : user.email,
                mobile: !(user.mobile) ? '' : user.mobile,
                password:user.password
            });
            user = await userObj.save();
            user = JSON.parse(JSON.stringify(user));
            user.user_id = user._id;
            delete user['_id'];
            delete user['__v'];
            output.data = user;
            output.accessToken = await signAccessToken(user);
            output.refreshToken = await signRefreshToken(user);
            output.code = 0;
            output.message = 'User registered successfully';
        } else {
            throw createError.BadRequest('User already exists with this login id');
        }
    }catch(err){
        // console.log(err);return;
        if(err.isJoi) { err.status = 400}
        next(err);
        return;
    }
    res.status(200).json(output);
});

router.post('/login',async (req,res,next) => {
    let output = {code:500,message:"Unable to login at this movement.Please try again after some time"};
    try {
        let filter;
        let user = await UserLoginSchema.validateAsync(req.body);
        if(!user.email && !user.mobile){
            throw createError.BadRequest('Please provide email or mobile to login');
        }
        if(!user.email) {
            filter = {
                mobile:user.mobile
            } 
        }
        if(!user.mobile) {
            filter = {
                email:user.email
            }
        }
        let userDoc = await User.find(filter);//returns empty array if no user exists.
        if(userDoc.length > 0) {
            // check user password with hashed password stored in the database
            const validPassword = await bcrypt.compare(user.password, userDoc[0].password);
            if(validPassword) {
               let userToken = JSON.parse(JSON.stringify(userDoc[0]));
               let token = await signAccessToken(userToken);
               output.refreshToken = await signRefreshToken(userToken);
               output.code = 200;
               output.message = 'Login Successful';
               output.token = token;
            } else {
                output.code = 401;
                output.message = 'Username or password combination is incorrect!';
            }
        } else {
            output.code = 404;
            output.message = 'User does not exists with this email/mobile!';
        }
    } catch(err) {
        if(err.isJoi) { err.status = 400}
        next(err);
        return;
    }
    res.status(output.code).json(output);
});

router.post('/refresh-token', async (req,res,next) => {
    let output = {code:500,message:'Something went wrong!'};
    try {
        let { refreshToken } = req.body;
        if(!refreshToken) {
            throw createError.BadRequest('Missing Refresh Token!')
        }
        let userDetails = await verifyRefreshToken(refreshToken);
        let plainObject = JSON.parse(JSON.stringify(userDetails));
        let user = await signAccessToken(plainObject);
        output.code = 200
        output.accessToken = user;
    } catch (error) {
        return next(error);
    }
    res.status(output.code).json(output);
});

router.put('/manage/user', async (req,res,next) => {
    let output = {code:500,message:"Unable to update at this movement!"};
    try {
        let user = await UserUpdateSchema.validateAsync(req.body);
        if(Object.keys(user).length < 0) {
            throw createError.BadRequest('Invalid json!');
        }
        let id = user.user_id;
        delete user.user_id;
        let data = user;
        let userDetails = await User.findByIdAndUpdate(id, data); 
        /**
         * update query is returning only older data but not updated data
         * so due to this we are again making a select query to show updated results 
        */
        userDetails = await User.findById(id).select({"password":0,"__v":0});
        delete output.message;
        delete output.code;
        output = userDetails;
    } catch (error) {
        return next(error);
    }
    res.status(200).json(output);
});

router.delete('/manage/user', async (req,res,next) => {
    output = {code:500,message:"Something went wrong while removing account!"};
    try {
        let id = req.body.user_id;
        let user = await User.findByIdAndRemove(id);
        output.code = 200;
        output.message = "User deleted successfully";
        output.data = user;
    } catch (error) {
        return next(error);
    }
    res.status(200).json(output);
});

module.exports = router;


/**
 * {
    "code": 200,
    "message": "User deleted successfully",
    "data": {
        "_id": "605b5bcfb414051958d76aca",
        "email": "maisftydt@gmail.com",
        "mobile": "19904777740074",
        "password": "$2b$10$QXPoVqPZy8t64lM4hkSNlOQwSEjRoaaw2Rg..S.uuSkAy5oa1nKRW",
        "__v": 0,
        "country": "IN",
        "city": "hyderabad",
        "birthday": "1997-09-04"
    }
}
 */
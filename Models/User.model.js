const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email:{
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    mobile:{
        type: String,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    country:{
        type: String
    },
    city:{
        type: String
    },
    birthday:{
        type: String
    }
});

/**
 * Mongoose Middlewares are called before saving user
 */
UserSchema.pre('save',async function (next) {
    console.log("Event fired before saving user");
    try {
        let salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password,salt);
        next()
    } catch(err) {
        next(err);
    }
});

/**
 * Mongoose Middlewares are called after saving user
 */
UserSchema.post('save',async function (next) {
    console.log("Event fired after saving user")
});

module.exports = mongoose.model('user',UserSchema);


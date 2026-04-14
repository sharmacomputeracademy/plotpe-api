const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        username:{
            type: String,
            required: true,
            unique: true
        },
        email:{
            type: String,
            required : true,
            unique: true,
        },
        password:{
            type: String,
            required: true
        },
        avatar:{
            type: String,
            default: "https://pixabay.com/images/download/wanderercreative-blank-profile-picture-973460_1920.png"
        }
    },
    {timestamps: true}
);

const User = mongoose.model('user', userSchema);

module.exports=User;
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
            default: "https://static.vecteezy.com/system/resources/thumbnails/051/498/303/small/social-media-chatting-online-default-male-blank-profile-picture-head-and-body-icon-people-standing-icon-grey-background-free-vector.jpg"
        }
    },
    {timestamps: true}
);

const User = mongoose.model('user', userSchema);

module.exports=User;

const mongoose = require("mongoose") ;

const userSchema = new mongoose.Schema( {

    name : {
        type : String ,
        required : true ,
        trim: true
    },

    address : {
        type : String ,
        required : true ,
        trim : true 
    },

    state : {
        type:String ,
        required: true 
    },

    mobile : {
        type : Number,
        required : true,
        trim : true,
        unique: true
    },

    password : {
        type: String,
        required: true 
    },

    isVerified : {
        type: Boolean ,
        default: false
    }
},
    {
        timestamps: true
    }
);

const User = mongoose.model("User" , userSchema);
module.exports = User ;
const mongosse=require('mongoose');
const schema=mongosse.Schema;

const userSchema=new schema({
    username:{
        type:String,
        required:true,

    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true
    }
});

module.exports=mongosse.model("User",userSchema);
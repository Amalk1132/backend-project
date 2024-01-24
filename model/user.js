const mongoose=require("mongoose");
const bcrypt=require("bcrypt");


const userschema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    profilelmg:String,
    profileThumblmg:String,
    accountCreatedDate:Date,
    wishlist:Array,
    order:Array,
    cart:Array,
    isDeleated:Boolean

});

////////////////---PASSWORD----////////////////
userschema.pre("save",async function (next){
    if(!this.isModified("password")){
        next()
    }else{
        this.password=await bcrypt.hash(this.password,10)
    }
})

module.exports=mongoose.model("User",userschema);


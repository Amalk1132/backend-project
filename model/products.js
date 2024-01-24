const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  title:{
    type:String
  } ,
  description: {
    type:String
  },
  price:{
    type:Number
  },
  image:{
    type:String

  } ,
  category:{
    type:String

  } 
});
module.exports = mongoose.model("products", productSchema);

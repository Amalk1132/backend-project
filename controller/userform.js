
const express = require("express");
const app = express();
const UserModel = require("../model/user");
const productModel = require("../model/products");
const jwt = require("jsonwebtoken");
const { trycatch } = require("../middleware/trycatchHandler");
const bcrypt = require("bcrypt");

app.use(express.json());

////////////////////---signup---/////////////////////////

const userSignUp = async (req, res) => {
  try {
    const userExist = await UserModel.findOne({ email: req.body.email });
    // console.log(userExist);

    if (userExist) {
      return res.status(401).json({
        message: "Email already in use",
      });
    } else {
      const user = await UserModel.create(req.body);
      return res.status(201).json({
        user,
        message: "User created successfully",
      });
    }
  } catch (error) {
    console.log("Error creating user:", error);
    return res.status(500).json({
      message: "Internal server error. Please try again later.",
    });
  }
};

/////////////////////----login----////////////////////////



const login = trycatch(async (req, res) => {
  const { email, password } = req.body;
  const userDetails = await UserModel.aggregate([{ $match: { email: email } }]);
  console.log(userDetails);
  let hashPassword = userDetails[0].password;

  if (!userDetails) {
    res.status(401).json({
      success: false,
      message: err.message,
    });
  }

  const result = await bcrypt.compare(password, hashPassword);

  if (!result) {
    res.send(401).json({
      success: false,
      message: "password incorrect",
    });
    return;
  }

  const accessToken = jwt.sign(
    { email: email, id: password },
    "123456"
  );
  console.log(accessToken);
  console.log("login success");

  res.status(202).cookie("token", accessToken).json({
    success: true,
    message: "login successfull",
  });
});

////////////////---user logout---///////////////////

const userlogout = trycatch(async(req,res)=>{
  res.clearCookie("token");
  res.status(200).json({
    success:true,
    message:"logout successfully"
  })

})

//////////////////---show product---///////////////

const products = trycatch(async (req, res) => {
  const productData = await productModel.find();

  if (!productData) {
    res.status(401).json({
      success: false,
      messge: " no products ",
    });
  } else {
    res.status(201).json(productData);
  }
});


/////////////////---- show product By Id----/////////////////


const productId = trycatch(async (req, res) => {
  const id = req.params.id;
  // console.log(id);
  const findProduct = await productModel.findById(id);
  if (!findProduct) {
    res.status(401).json({
      success: false,
      message: "product not found",
    });
  } else {
    res.status(201).json(findProduct);
  }
});

////////////////////--- show products category by id---////////////////////

const productCategory = trycatch(async (req, res) => {
  const categ = req.params.id;
  const categoryFind = await productModel.aggregate([
    { $match: { category: categ } },
  ]);
  if (!categoryFind || categoryFind.length === 0) {
    res.status(404).json({
      success: false,
      message: "category not found",
    });
  } else {
    res.status(201).json(categoryFind);
  }
});

//////////////////---add product to cart---///////////////////

const addCart = trycatch(async (req, res) =>{
  const { id: userid } = req.params;
  console.log(userid);

  const addProduct = await productModel.findById(req.body.id);
  const checkUser = await UserModel.findById(userid);

  if (!addProduct && !checkUser){
    res.status(404).json({
      success: false,
      message: "user id or product id  incorrect",
    });
  } else {
    const isExist = checkUser.cart.find((item) => item._id == req.body.id);

    if (isExist){
      res.status(404).send("item is already in cart");
    } else {
      checkUser.cart.push(addProduct);
      await checkUser.save();
      res.status(201).json(checkUser);
    }
  }
});

/////////////////---view product in cart---////////////////


const showCart = trycatch(async (req, res) => {
  const id = req.params.id;
  console.log(id);

  const userCheck = await UserModel.findById(id);
  console.log(userCheck);

  if (!userCheck) {
    res.status(404).json({
      sucess: false,
      message: "invallid product",
    });
  } else {
    const cartData = userCheck.cart;
    res.status(201).json(cartData);
  }
});

////////////////add to wishlist/////////////////
  
const wishlistAdd = trycatch(async(req,res)=>{
    const userid=req.params.id;

    
  const addProduct = await productModel.findById(req.body.id);
  const checkUser = await UserModel.findById(userid);

  if (!addProduct && !checkUser) {
    res.status(404).json({
      success: false,
      message: "user id or product id  incorrect",
    });
  } else {
    const isExist = checkUser.wishlist.find((item) => item._id == req.body.id);

    if (isExist) {
      res.status(404).send("item is already in wishlist");
    } else {
      checkUser.wishlist.push(addProduct);
      await checkUser.save();
      res.status(201).json(checkUser);
    }
  }
});
///////////////////show wishlist///////////////
const showWishlist = trycatch(async (req, res) => {
    const id = req.params.id;
    console.log(id);
  
    const userCheck = await UserModel.findById(id);
    console.log(userCheck);
  
    if (!userCheck) {
      res.status(404).json({
        sucess: false,
        message: "invallid product",
      });
    } else {
      const wishData = userCheck.wishlist;
      res.status(201).json(wishData);
    }
  });

  ////////////deleate section//////////////
  const removeWishlist = trycatch(async(req,res) => {
    const userid = req.params.id;
    
    const user = await UserModel.findById(userid);
  
    if(!user){
      return res.status(404).json({
        success:false,
        message:'User not found'
      });
    }
  
    const  {wishlist} = user;
    const productRemove = wishlist.find(product => product._id.equals(req.body.id));
  
    if(productRemove) {
      const updateWishlist = wishlist.filter(product => product !== productRemove);
      user.wishlist = updateWishlist;
  
      const updateUser = await user.save();
  
      res.status(201).json({
        message:'Product Successfully removed from wishlist',
        data:updateUser.wishlist
      });
    } else {
      return res.status(201).json({
        success:false,
        message:'Product not fond in the wishlist'
      })
    }
  })

  //////////////// user orders ///////////////
const placingOrder = trycatch(async function (req, res) {
  const userId = req.params.id;
  const userCheck = await UserModel.findById(userId);

  if (!userCheck) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const { cart } = userCheck;

  if (cart.length === 0) {
    return res.status(404).json({
      success: false,
      message: "you have to add product to cart",
    });
  } else {
    const totalPrice = cart
      .reduce((accumulator, products) => {
        return accumulator + products.price;
      }, 0)
      .toFixed(2);

    return res.status(200).json({
      success: true,
      message:` the total amount you have to pay ${totalPrice}`,
      products: `${cart.length}, products`, 
      data: cart,
    });
  }
});

module.exports = {
  userSignUp,
  login,
  userlogout,
  products,
  productId,
  productCategory,
  addCart,
  showCart,
  wishlistAdd,
  showWishlist,
  removeWishlist,
  placingOrder
};

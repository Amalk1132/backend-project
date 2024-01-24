const usersModel = require("../model/user");
const productModel = require("../model/products");
const { trycatch } = require("../middleware/trycatchHandler");
const { signToken } = require("../middleware/jwt");
const cloudinary = require("../utlis/cloudinary");

/////////////////// ADMIN LOGIN ////////////////////

const Adminlogin = async(req, res) =>{
  const admin = {
    username: process.env.Admin_Username,
    password: process.env.Admin_Password,
  };

  const { username, password } = req.body;

  const validator = password == admin.password && username == admin.username;

  if (validator) {
    res.status(202).cookie("adminAuth", signToken).json({
      success: true,
      message: "successfully login",
    });
  } else {
    res.status(400).send("enter the username and password");
  }
};

/////////////GET ALL USERS//////////////

const displayUsers = trycatch(async (req, res) => {
  const userData = await usersModel.find();

  if (userData.length === 0) {
    res.status(400).send("database error");
  } else {
    res.status(202).json(userData);
  }
});

/////////////////---USER BY ID----///////////////////

const finduserid = trycatch(async (req, res) =>{
  const id = req.params.id;
  const checkUser = await usersModel.find({ _id: id });

  if (!checkUser) {
    res.status(404).json({
      success: false,
      message: "User not  found",
    });
  } else {
    res.status(202).json(checkUser);
  }
});

//////////----SHOW PRODUCTS----/////////////

const showproduct = trycatch(async (req, res) => {
  const checkproduct = await productModel.find();

  if (!checkproduct) {
    res.status(404).json({
      success: false,
      message: "product not found",
    });
  } else {
    res.status(202).json(checkproduct);
  }
});

///////////----- PRODUCT BY ID -----//////////////

const productById = trycatch(async (req, res) => {
  const { id } = req.params;

  const productId = await productModel.find({ _id: id });

  if (!productId) {
    res.status(404).josn({
      success: false,
      message: "not found the product",
    });
  } else {
    res.status(202).json(productId);
  }
});

/////////SHOW PRODUCT CATEGORY//////////
const productCategory = trycatch(async (req, res) => {
  const categ = req.params.id;
  const categoryfind = await productModel.aggregate([
    { $match: { category: categ } },
  ]);

  if (!categoryfind || categoryfind.length === 0) {
    res.status(404).json({
      success: false,
      message: "not found the category",
    });
  } else {
    res.status(202).json(categoryfind);
  }
});

////////////////////----ADD PRODUCT---//////////////////

const addproducts = trycatch(async (req, res) => {
  const { title, description, price, category } = req.body;
  const existingproduct = await productModel.findOne({ title: title });

  if (!existingproduct) {
    const adding = await cloudinary.uploader.upload(req.file.path);
    const added = await productModel.create({
      title,
      description,
      price,
      category,
      image: adding.url,
    });
    res.status(202).json({
      success: true,
      message: "successfully",
      data: added,
    });
  } else {
    res.status(404).json({
      success: false,
      message: "product not found",
    });
  }
});

/////////////////update product/////////////////


const updateproduct = trycatch(async (req, res) => {
  const productId = req.params.id;
  const isExist = await productModel.findById(productId);
  const { title, description, price,category } = req.body;

  if(isExist) {
    const adding = await cloudinary.uploader.upload(req.file.path);
    const products = await productModel.findById(productId);

    products.title = title || products.title;
    products.description = description || products.description;
    products.price = price || products.price;
    products.category || products.category;
    products.image = adding.url || products.image;
    await products.save();

    res.status(202).json({
      status: "success",
      message: "product updated success",
      data: products,
    });
  }
});

////////////////DELEATE PRODUCTS//////////////
const deletateProduct = trycatch(async (req, res) => {
  const productId = req.params.id;

  const deleateproduct = await productModel.findByIdAndDelete(productId);

  if(!deleateproduct) {
    res.status(404).json({
      success: false,
      message: "product is not found",
    });
  } else {
    res.status(202).json({
      status: true,
      message: "successfully product deleated",
      data: deleateproduct,
    });
  }
});
module.exports = {
  Adminlogin,
  displayUsers,
  finduserid,
  showproduct,
  productById,
  productCategory,
  addproducts,
  updateproduct,
  deletateProduct,
};

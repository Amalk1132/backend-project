const express = require("express");
const router = express.Router(); 
const controller = require("../controller/userform");
const {authentication}=require("../middleware/authentication");

///////////////////---register and login---///////////////////
router.route("/signup").post(controller.userSignUp);
router.route("/login").post(controller.login);
router.route("/logout").post(controller.userlogout)

//////////////////////----user Routers----//////////////////////
router.route("/product").get(authentication,controller.products);
router.route("/product/:id").get(authentication,controller.productId);
router.route("/product/category/:id").get(authentication,controller.productCategory);
router.route("/:id/cart").post(authentication,controller.addCart);
router.route("/:id/cart").get(authentication,controller.showCart);
router.route("/:id/wishlist").post(authentication,controller.wishlistAdd);  
router.route("/:id/wishlist").get(authentication,controller.showWishlist);
router.route("/:id/wishlist").delete(authentication,controller.removeWishlist);
router.route("/:id/order").get(authentication,controller.placingOrder);


module.exports = router;                                                        

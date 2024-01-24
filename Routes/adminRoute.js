const express=require("express");
const router=express();
const{adminAuth}=require("../middleware/adminAuth");
const adminForm=require("../controller/adminForm");

const upload = require("../utlis/multer");


router.route("/admin/login").post(adminForm.Adminlogin);
router.route("/admin/user").get(adminAuth,adminForm.displayUsers);
router.route("/admin/getuser/:id").get(adminAuth,adminForm.finduserid);
router.route("/admin/getproduct").get(adminAuth,adminForm.showproduct);
router.route("/admin/product/:id").get(adminAuth,adminForm.productById);
router.route("/admin/product/category/:id").get(adminAuth,adminForm.productCategory);
router.route("/admin/addproduct").post(adminAuth,upload.single('image'),adminForm.addproducts);
router.route("/admin/updateproduct/:id").put(adminAuth,upload.single('image'),adminForm.updateproduct);
router.route("/admin/productDelete/:id").delete(adminAuth,adminForm.deletateProduct);

module.exports=router;
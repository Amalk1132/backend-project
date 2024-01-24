const adminAuth=(req,res,next)=>{
    const token=req.cookies.adminAuth;
    if(!token){
        res.status(401).send("unauthorized");
    }else{
        next()
    }
}
module.exports={adminAuth}


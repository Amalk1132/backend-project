const authentication=(req,res,next)=>{
    const token=req.cookies.token;
    if(!token){
        res.status(401).send("Authentication Access needed");
    }else{
        next();
    }

}
module.exports={authentication}



const express = require("express");
const app = express();
const cookies = require("cookie-parser");

const dotenv = require("dotenv");
const dbconnect = require("./config/dbconnection");
dotenv.config({ path: "./config/config.env" });
dbconnect();


app.use(express.json());
app.use(cookies());

//////////user--regi--signu--and--login//////////
const userroute = require("./Routes/userRoutes");
app.use("/api", userroute);

////////////admin--session////////////////
const adminrouter = require("./Routes/adminRoute");
app.use("/api", adminrouter);

app.listen(process.env.PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("successful");
  }
});



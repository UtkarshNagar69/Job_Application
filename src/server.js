require("dotenv").config(); //env file ko har jagah use krne ke lie iske config ko require krna pdta h
const dns = require("dns");
dns.setServers(["8.8.8.8"]);

const express = require("express");
const dBConnection = require("./config/db");

const userRoute = require("./routes/userRoute");
const jobRoute = require("./routes/jobRoute");

const app = express();

// let middleware1 = (req, res, next) => {
//   console.log("Middleware1");
//   // res.send("req. Ended")
//   next();
// };
// let middleware2 = (req, res, next) => {
//   console.log("Middleware2");
//   // res.send("req. Ended")
//   next();
// };

// app.use(middleware1);
// app.use(middleware2);

app.use(express.json());
app.use("/users", userRoute);
app.use("/jobs", jobRoute);
dBConnection();

const PORT = process.env.PORT;

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server running at port ${PORT}`);
  }
});

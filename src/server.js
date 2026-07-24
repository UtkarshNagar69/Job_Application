require("dotenv").config(); //env file ko har jagah use krne ke lie iske config ko require krna pdta h
const dns = require("dns");
dns.setServers(["8.8.8.8"]);

const express = require("express");
const dBConnection = require("./config/db");

const userRoute = require("./routes/userRoute");

const app = express();

app.use(express.json());
app.use("/users", userRoute);
dBConnection();

const PORT = process.env.PORT;

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server running at port ${PORT}`);
  }
});

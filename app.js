require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();
connectDB();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use("/auth", authRoutes);


app.get( "/" , (req , res) => {
  res.render("dashboard/index");
});

app.get("/chat" , (req , res) => {
  res.render("chatbot/chat");
});

app.get("/explore" , (req , res) => {
  res.render("explore/index")
});

app.get("/home" , (req , res) => {
  res.render("home.ejs")
});






app.listen(3000, () => {
    console.log("server is running on " );
});
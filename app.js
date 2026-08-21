const express = require("express");
const app = express();


app.set("view engine", "ejs");
app.use(express.static("public"));

app.get( "/" , (req , res) => {
  res.render("dashboard/index");
});

app.get("/chat" , (req , res) => {
  res.render("chatbot/chat");
});

app.get("/explore" , (req , res) => {
  res.render("explore/index")
});

app.listen(3000, () => {
    console.log("server is running on " );
});
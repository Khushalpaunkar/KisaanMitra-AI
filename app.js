require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const pageRoutes = require("./routes/pageRoutes");
const weatherRoutes = require("./routes/weatherRoutes");
const session = require("express-session");
const User = require("./Models/User");


const app = express();
connectDB();

const isAuthenticated = require("./middleware/authmiddleware");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({secret : "kisaanmitra-secret-key" , resave: false , saveUninitialized : false}));
app.use((req, res, next) => {
  res.locals.isAuthenticated = Boolean(req.session.userId);
  res.locals.isLoggedIn = Boolean(req.session.userId);
  next();
});
app.use("/auth", authRoutes);
app.use("/chat", chatRoutes);
app.use("/", pageRoutes);
app.use("/weather" , weatherRoutes);



app.get( "/" , (req , res) => {
  res.render("dashboard/index");
});

app.get("/explore" , (req , res) => {
  res.render("explore/index")
});

app.get("/home" , isAuthenticated, async (req , res) => {

  try {
       const user = await User.findById(req.session.userId);
       res.render("home" , {
        user:user
       });

  } catch (error) {
    console.error("Dashboard Error:" , error);
    res.status(500).send("Something went wrong");
  }
  
});


app.listen(3000, () => {
    console.log("server is running on " );
});


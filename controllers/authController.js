const bcrypt = require("bcrypt");
const User = require("../Models/User");

const registerUser = async (req , res ) => {
    try {
        const { name , address , state , mobile , password} = req.body ;

        if (!name || !address || !state || !mobile || !password ) {
            return res.status(400).send("All field are required");
        }

        const existingUser = await User.findOne({ mobile}) ;
        
        if(existingUser) {
            return res.status(400).send("mobile already registerd");
        }

        if (password !== confirmPassword) {
        return res.status(400).send("Passwords do not match");
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = new User ({
            name,
            address,
            state,
            mobile,
            password : hashedPassword
        });

        await newUser.save();

        res.send("Account created successfuly!");

    } catch(error) {
      console.error("Registration Error:" , error);
      res.status(500).send("Something went wrong");
    }
};

const loginUser = async (req, res) => {
    try {

        // Get data from login form
        const { mobile, password } = req.body;

        // Check fields
        if (!mobile || !password) {
            return res.status(400).send("Mobile and password are required");
        }

        // Find user by mobile number
        const user = await User.findOne({ mobile });

        // User not found
        if (!user) {
            return res.status(401).send("Invalid mobile number or password");
        }

        // Compare password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        // Password incorrect
        if (!isPasswordCorrect) {
            return res.status(401).send("Invalid mobile number or password");
        }

        // Login successful
        res.send("Login successful!");

    } catch (error) {

        console.error("Login Error:", error);

        res.status(500).send("Something went wrong");
    }
};

module.exports = {
    registerUser,  loginUser
};
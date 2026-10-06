require("dotenv").config();

const express = require('express');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const connect = require("./db");
const User = require("./models/UserSchema");

connect();

const app = express()
const port = process.env.PORT || 8080

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not set. Copy .env.example to .env and fill it in.");
}

app.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name) {
            return res.status(400).json({ error: "Name not found" });
        }
        if (!email) {
            return res.status(400).json({ error: "Email not found" });
        }
        if (!password) {
            return res.status(400).json({ error: "Password not found" });
        }

        const salt = await bcrypt.genSalt(10);
        let encryptedPassword = await bcrypt.hash(password, salt);
        let useremail = email.toLowerCase();

        const existingUser = await User.findOne({ email: useremail });
        if (existingUser) {
            return res.status(400).json({ error: "An account with this email already exists." });
        }

        const user = await User.create({
            name: name,
            email: useremail,
            password: encryptedPassword
        });
        const data = {
            id: user.id,
        };

        // Signing authtoken
        const authtoken = jwt.sign(data, JWT_SECRET);
        res.json({ authtoken: authtoken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong, please try again." });
    }

});

app.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if(!email) {
          return res.status(400).json({ error: "Email not found" });
      }
      if(!password) {
          return res.status(400).json({ error: "Password not found" });
      }
      let useremail = email.toLowerCase();
      let user = await User.findOne({ email: useremail });
        if (!user) {
          return res
            .status(400)
            .json({ error: "Please try to login with correct credentials." });
        }

        // Comparing password using bcryptjs.
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
          return res
            .status(400)
            .json({ error: "Please try to login with correct credentials." });
        }

        const data = {
          user: {
            id: user.id,
          },
        };
        // Compare authentication token using "jsonwebtoken".
        const authtoken = jwt.sign(data, JWT_SECRET);
        let usersend = await User.findById(data.user.id).select("-password");
        // Sending authentication token to user.
        res.json({ authtoken: authtoken, user: usersend, userid: data.user.id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Something went wrong, please try again." });
    }
  });


app.listen(port, () => {
    console.log(`Symbi-mart backend listening on port ${port}`)
})

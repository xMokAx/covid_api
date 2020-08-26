const bcrypt = require("bcrypt");
const {
  signupValidation,
  signinValidation,
  tokenValidation,
} = require("../utils/validation");
const { findByEmail, findById, createUser } = require("../models/user");
const jwt = require("jsonwebtoken");

module.exports = function (app) {
  app.post("/signup", async (req, res) => {
    try {
      console.log(req.body);
      const { error } = signupValidation(req.body);

      // validation errors
      if (error) {
        return res.status(400).send({ error: error.details[0].message });
      }

      const emailExists = await findByEmail(req.body.email);

      // email already registered
      if (emailExists) {
        return res.status(400).send({ error: "Email already exists" });
      }

      // hash the password
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(req.body.password, salt);
      try {
        const user = {
          name: req.body.name,
          email: req.body.email,
          password,
        };
        const savedUser = await createUser(user);

        // create token
        const token = jwt.sign(
          // payload data
          {
            id: savedUser._id,
          },
          process.env.TOKEN_SECRET,
          {
            expiresIn: 86400,
          }
        );

        return res.status(201).send({ token, userId: savedUser._id });
      } catch (error) {
        return res.status(400).send({ error });
      }
    } catch (error) {
      return res.sendStatus(500);
    }
  });

  app.post("/signin", async (req, res) => {
    try {
      // validate the user
      const { error } = signinValidation(req.body);

      // validation errors
      if (error) {
        return res.status(400).send({ error: error.details[0].message });
      }

      const user = await findByEmail(req.body.email);

      if (!user) {
        return res.status(400).send({ error: "Email is wrong" });
      }

      // check for password correctness
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword) {
        return res.status(400).send({ error: "Password is wrong" });
      }

      // create token
      const token = jwt.sign(
        // payload data
        {
          id: user._id,
        },
        process.env.TOKEN_SECRET,
        {
          expiresIn: 86400,
        }
      );

      delete user.password;

      return res.status(201).send({ token, user });
    } catch (error) {
      return res.sendStatus(500);
    }
  });

  app.get("/signin", tokenValidation, async (req, res) => {
    try {
      const user = await findById(req.jwt.id);

      delete user.password;
      if (!user) {
        return res.sendStatus(401);
      }
      return res.send({ user });
    } catch (error) {
      res.sendStatus(500);
    }
  });
};

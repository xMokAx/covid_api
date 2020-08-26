const Joi = require("joi");
const jwt = require("jsonwebtoken");

exports.signupValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    email: Joi.string().max(255).required().email(),
    password: Joi.string().min(8).max(20).required(),
    confirmPassword: Joi.string()
      .equal(Joi.ref("password"))
      .required()
      .error((errors) => {
        errors[0].message = "Passwords don't match";
        return errors;
      }),
  });

  return schema.validate(data);
};

exports.signinValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().max(255).required().email(),
    password: Joi.string().min(8).max(20).required(),
  });

  return schema.validate(data);
};

exports.tokenValidation = (req, res, next) => {
  if (!req.headers["authorization"]) {
    return res.sendStatus(401);
  }

  try {
    let authorization = req.headers["authorization"].split(" ");
    if (authorization[0] !== "Bearer") {
      return res.sendStatus(401);
    } else {
      const decoded = jwt.verify(authorization[1], process.env.TOKEN_SECRET);
      req.jwt = decoded;
      next();
    }
  } catch (err) {
    res.sendStatus(403);
  }
};

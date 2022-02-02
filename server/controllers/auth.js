const User = require("../models/user");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.signup = (req, res) => {
  const { name, email, password } = req.body;
  User.findOne({ email }).exec((err, user) => {
    if (user) {
      return res.status(400).json({
        error: "Email is taken",
      });
    }
    const token = jwt.sign(
      { name, email, password },
      process.env.JWT_ACCOUNT_ACTIVATION,
      { expiresIn: "10m" }
    );

    const emailData = {
      // from: process.env.EMAIL_FROM,
      from: "alexhunter@live.co.uk",
      to: email,
      subject: `Account activation link`,
      html: `
              <h1>Please use the following link to activate your account</h1>
              <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
              <hr />
              <p>This email may contain sensetive information</p>
              <p>${process.env.CLIENT_URL}</p>
          `,
    };

    sgMail
      .send(emailData)
      .then((sent) => {
        return res.send({
          message: `Email has been sent to ${email}. Follow the instruction to activate your account`,
          // link: `${process.env.CLIENT_URL}/auth/activate/${token}`,
        });
      })
      .catch((err) => {
        return res.json({
          message: err.message,
        });
      });
  });
};

exports.activateAccount = (req, res) => {
  const { token } = req.body;

  if (token) {
    jwt.verify(
      token,
      process.env.JWT_ACCOUNT_ACTIVATION,
      function (err, decoded) {
        if (err) {
          return res.status(401).json({
            error: "Token is invalid or expired. Please signup again",
          });
        }

        const { name, email, password } = jwt.decode(token);
        const user = new User({ name, email, password });

        user.save((err, user) => {
          if (err) {
            return res.status(401).json({
              error: "Error saving user in database. Try signing up again",
            });
          }
          return res.json({
            message: `Hi, ${name}! Please login...`,
          });
        });
      }
    );
  } else {
    return res.status(500).json({
      error: "Something went wrong. Try signing up again.",
    });
  }
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({ error: "Email not found" });
    }

    if (!user.authenticate(password)) {
      return res.status(400).json({ error: "Email and Password do not match" });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const { _id, name, email, role } = user;

    return res.json({
      token,
      user: {
        _id,
        name,
        email,
        role,
      },
    });
  });
};
/**
 * check if user is trying to signin but hasnt signed up
 * check if password matches hashed password in db
 * if yes, generate a token with expiry to client (eg localstorage)
 * it will be used as jwt based authentication system
 * we can allow user to access protected routes if they have valid token
 * jwt is like a password with an expiry
 * if signin valid server sends user info and valid jwt token
 * this token will be sent to server to access protected routes
 */

exports.forgotPassword = (req, res) => {
  const { email } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "Can't find user with this email",
      });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_RESET_PASSWORD, {
      expiresIn: "10m",
    });

    const emailData = {
      // from: process.env.EMAIL_FROM,
      from: "alexhunter@live.co.uk",
      to: email,
      subject: `Password Reset Link`,
      html: `
            <h1>Please use the following link to reset your password</h1>
            <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
            <hr />
            <p>This email may contain sensetive information</p>
            <p>${process.env.CLIENT_URL}</p>
        `,
    };
    return user.updateOne({ resetPasswordLink: token }, (err, success) => {
      if (err) {
        return res.status(400).json({
          error: "Database connection error on user forgot password request",
        });
      } else {
        sgMail
          .send(emailData)
          .then((sent) => {
            return res.send({
              message: `Email has been sent to ${email}. Follow the instruction to reset your password`,
              // link: `${process.env.CLIENT_URL}/auth/activate/${token}`,
            });
          })
          .catch((err) => {
            return res.json({
              message: err.message,
            });
          });
      }
    });
  });
};

exports.authorizeResetPassword = (req, res) => {
  const resetPasswordLink = req.headers.resetpasswordlink;
  if (resetPasswordLink) {
    jwt.verify(
      resetPasswordLink,
      process.env.JWT_RESET_PASSWORD,
      function (err, decodedData) {
        if (err) {
          return res.status(400).json({
            error: "Expired link! Please try again",
          });
        }

        User.findOne({ resetPasswordLink }, (err, user) => {
          if (err || !user) {
            return res.status(400).json({
              error: "Something went wrong! Please try again",
            });
          }
          return res.json({
            name: user.name,
            id: user._id,
          });
        });
      }
    );
  }
};

exports.resetPassword = (req, res) => {
  const { id, newPassword } = req.body;

  User.findOne({ _id: id }, (err, user) => {
    if (err) {
      return res.status(400).json({
        error: "Error resetting user password",
      });
    }
    const updatedFields = {
      password: newPassword,
      resetPasswordLink: "",
    };
    user = _.extend(user, updatedFields);
    user.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: "Error resetting user password",
        });
      }

      res.json({
        message: "Password reset! Login with new password",
      });
    });
  });
};

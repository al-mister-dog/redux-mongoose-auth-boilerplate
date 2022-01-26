const User = require("../models/user");
const jwt = require("jsonwebtoken");
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

    /*
    this will act as email send functionality if sendgrid account suspended
    message is sent to user with a link that contains activation token
    DEV MODE ONLY
    */
    // return res.json({
    //   message: `Email has been sent to ${email}. Follow the instruction to activate your account`,
    //   link: `${process.env.CLIENT_URL}/auth/activate/${token}`,
    // });

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
        console.log("SIGNUP EMAIL SENT", sent);
        return res.send({
          message: `Email has been sent to ${email}. Follow the instruction to activate your account`,
          // link: `${process.env.CLIENT_URL}/auth/activate/${token}`,
        });
      })
      .catch((err) => {
        // console.log('SIGNUP EMAIL SENT ERROR', err)
        console.log(err);
        return res.json({
          message: err.message,
        });
      });
  });
};

exports.activateAccount = (req, res) => {
  const { token } = req.body;
  console.log(token)
  if (token) {
    jwt.verify(
      token,
      process.env.JWT_ACCOUNT_ACTIVATION,
      function (err, decoded) {
        if (err) {
          console.log("JWT VERIFY IN ACCOUNT ACTIVATION ERROR", err);
          return res.status(401).json({
            error: "Token is invalid or expired. Please signup again",
          });
        }
        
        const { name, email, password } = jwt.decode(token);
        const user = new User({ name, email, password });

        user.save((err, user) => {
          if (err) {
            console.log("SAVE USER IN ACCOUNT ACTIVATION ERROR", err);
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
  //check if user exists
  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      console.log("user not found or error")
      return res.status(400).json({ error: "Email not found" });
    }
    
    //authenticate
    if (!user.authenticate(password)) {
      return res.status(400).json({ error: "Email and Password do not match" });
    }
    
    //generate token and send to client
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const { _id, name, email, role } = user;
    console.log(user)
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

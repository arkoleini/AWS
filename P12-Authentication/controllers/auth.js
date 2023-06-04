const User = require('../models/user');
const bcrypt = require('bcryptjs');
const logger = require('../util/logger'); // adjust the path as necessary


exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: true
  });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: true
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({email: email})
   .then(user=>{
    if (!user){
      logger.info(`${Function.prototype.name.call(this)} : Valid User`);
      return res.redirect('/login');
    }
    bcrypt.compare(password,user.password)
    .then((doMatch)=>{
      if (!doMatch) {  
        logger.info(`${Function.prototype.name.call(this)} : password is IN-correct !`);
        return res.redirect('/login');
      }
      logger.info(`${Function.prototype.name.call(this)} : password is IN-correct !`);
        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.save(err => {
          console.log(err);
          res.redirect('/');
        });
    })  
   })   
    .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
  
  const email = req.body.email;
  const password = req.body.password;
  

  User.findOne({email:email}).then(result=>{
    if (result){
      return res.redirect('/signup');
    }  
    return bcrypt.hash(password, 12).
    then(hashpassword=>{
      const user = new User ({email: email , password:hashpassword, cart:{iterms:[]}});
      user.save().then(result=>{res.redirect('/login')});
    })
  });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

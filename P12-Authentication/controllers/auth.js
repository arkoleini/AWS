const User = require('../models/user');
const bcrypt = require('bcryptjs');
const logger = require('../util/logger'); // adjust the path as necessary


exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false
  });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  logger.info(`exports.postLogin  ${email}`)
  logger.info(`exports.postLogin  ${password}`)
  User.findOne({email: email})
   .then(user=>{
    if (!user){
      const date_ob = new Date();
      logger.info(`${date_ob.toISOString()}:Not Valid User`)
      return res.redirect('/login');
    }
    bcrypt.compare(password,user.password)
    .then((doMatch)=>{
      if (!doMatch) {  
        const date_ob = new Date();
        logger.info(`${date_ob.toISOString()}: password is IN-correct !`);
        return res.redirect('/login');
      }
      const date_ob = new Date();
      logger.info(`${date_ob.toISOString()}: password is IN-correct !`);
        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.save(err => {
          const date_ob = new Date();
          logger.info(`${date_ob.toISOString()}: Error!  ${err}`);
          res.redirect('/');
        });
    })  
   })   
   .catch(err => {
    const date_ob = new Date();
    logger.info(`${date_ob.toISOString()}: Error!  ${err}`);
  })
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
      const date_ob = new Date();
      logger.info(`${date_ob.toISOString()}: Error!  ${err}`);
      res.redirect('/');
    });  
};

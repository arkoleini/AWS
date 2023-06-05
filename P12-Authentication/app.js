const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const cors = require('cors'); // Add this line
const logger = require('./util/logger'); // assuming logger.js is in the util directory


const errorController = require('./controllers/error');
const User = require('./models/user');
const csrdProtection = csrf();  //-- define CSRF---

const cloudUri='mongodb+srv://arkoleini:Test123456789@cluster0.0b8zxrp.mongodb.net/shop?retryWrites=true&w=majority';
const localUri='mongodb://localhost:27017/shop'

const fs = require('fs');

if (!fs.existsSync(path.join(__dirname, 'Drivelog'))) {
    fs.mkdirSync(path.join(__dirname, 'Drivelog'));
}


const app = express();
const store = new MongoDBStore({
  uri: cloudUri,
  collection: 'session'
});

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(cors()); // Use cors middleware here

//----Define session-------
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

app.use(csrdProtection);  //----add CSRF to middleware---

//--add user manually from session into req to pipulating issue------
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => {
      const date_ob = new Date();
      logger.info(`${date_ob.toISOString()}: Error!  ${err}`);
    });
});

app.use((req, res, next)=>{
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();;  //----pass every response with cSRF token
  next()
})


app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes)
app.use(errorController.get404);

mongoose
.connect(cloudUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => {
    const date_ob = new Date();
    logger.info(`${date_ob.toISOString()}: System started ----> on 3000 V2`);
    app.listen(3000);
  })
  .catch(err => {
    const date_ob = new Date();
    logger.info(`${date_ob.toISOString()}: Error!  ${err}`);
  });

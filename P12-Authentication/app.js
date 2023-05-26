const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const cors = require('cors'); // Add this line

const errorController = require('./controllers/error');
const User = require('./models/user');
const csrdProtection = csrf();  //-- define CSRF---


const app = express();
const store = new MongoDBStore({
  uri: "mongodb+srv://arkoleini:Test123456789@cluster0.0b8zxrp.mongodb.net/shop?retryWrites=true&w=majority",
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
    .catch(err => console.log(err));
});

app.use((req, res, next)=>{
   res.locals.isAuthenticated = req.session.isLoggedIn;
   res.locals.csrToken = req.csrfToken();  //----pass every response with cSRF token
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes)
app.use(errorController.get404);

mongoose
  .connect('mongodb+srv://arkoleini:Test123456789@cluster0.0b8zxrp.mongodb.net/shop?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => {
    console.log(`system started ----> on 3000`)
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
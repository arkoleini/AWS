exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: req.isLoggedIn
  });
};

exports.postLogin = (req, res, next) => {
    req.isLoggedIn = true;
    res.cookie('Cookie1Test','true', {maxAge: 12000} );

    //----or an use Cookie with more details----
      //   res.cookie(`Cookie token name2`,`encrypted cookie string Value`,{
      //     maxAge: 5000,
      //     // expires works the same as the maxAge
      //     expires: new Date.now(),
      //     secure: true,
      //     httpOnly: true,
      //     sameSite: 'lax'
      // });
    res.redirect('/');
  };

module.exports =(req, res, next)=>{
    if (!req.session.isLoggedIn){
        console.log(`##### middle ware is-Auth`);
        return res.redirect('/loggin');
    }
    next();
}
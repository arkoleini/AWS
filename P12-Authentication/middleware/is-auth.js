const logger = require('../util/logger'); // adjust the path as necessary

module.exports =(req, res, next)=>{
    if (!req.session.isLoggedIn){
        const date_ob = new Date();
        logger.info(`${date_ob.toISOString()}:middle ware is-Auth`)
        return res.redirect('/login');
    }
    next();
}

const User = require('../models/user')

module.exports.renderRegister = (req, res)=>{
    res.render('user/register');
}

module.exports.register = async(req, res)=>{
    try{
        const {email,username,password} = req.body.user;
        const newUser = new User({username,email});
        const registeredUser = await User.register(newUser,password);
        req.login(registeredUser, function(err) {
            if (err) { return next(err); }
            req.flash('success','Welcome to YelpCamp');
            const redirectUrl = req.session.returnTo || '/campgrounds';
            delete req.session.returnTo;
            res.redirect(redirectUrl);        
        });
        
    } catch(e){
        req.flash('error: ',e.message);
        res.redirect('/register');
    }
    
}

module.exports.renderLogin = (req, res)=>{
    res.render('user/login');
}

module.exports.logout = (req, res)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash('success','Successfully logged out!');
        res.redirect('/campgrounds');
    });
    
}

module.exports.login = (req, res)=>{
    req.flash('success','Welcome back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}
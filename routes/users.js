const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport')
const catchAsync = require('../utils/CatchAsync')

router.get('/register',(req, res)=>{
    res.render('user/register');
})

router.post('/register',catchAsync(async(req, res)=>{
    try{
        const {email,username,password} = req.body.user;
        const newUser = new User({username,email});
        const registeredUser = await User.register(newUser,password);
        req.login(registeredUser, function(err) {
            if (err) { return next(err); }
            req.flash('success','Welcome to YelpCamp');
            const redirectUrl = req.session.returnTo || '/campgrounds';
            res.redirect(redirectUrl);        
        });
        
    } catch(e){
        req.flash('error: ',e.message);
        res.redirect('/register');
    }
    
}))

router.get('/login',(req, res)=>{
    res.render('user/login');
})

router.get('/logout',(req, res)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash('success','Successfully logged out!');
        res.redirect('/campgrounds');
    });
    
})

router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login',keepSessionInfo:true}),(req, res)=>{
    req.flash('success','Welcome back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
})

module.exports = router;

var express = require('express');
const { PRODUCTS } = require('../config/collections');
const adminHelpers = require('../helpers/admin-helpers');
const dealerHelpers = require('../helpers/dealer-helpers');
var router = express.Router();
var userHelpers = require('../helpers/user-helpers')
module.exports=router
const verifyLogin=(req,res,next)=>{
    if(req.session.user){
      next()
    }else{
      res.redirect('/login')
    }
  }
router.get('/',function(req,res,next){
    let userDetails = req.session.user
    console.log('user='+userDetails);
    if(req.session.userLoggedIn)
    {
        res.render('user/home',{userDetails,user:true,loggedIn:true})
    }else{
        res.redirect('/login')
    }
    
});
router.get('/view-dealers',verifyLogin,(req,res)=>{
  userDetails=req.session.user
  adminHelpers.allDealers().then((dealers)=>{
    res.render('user/view-dealers',{userDetails,user:true,dealers})
  })
});
router.get('/view-products/:dealer',verifyLogin,(req,res)=>{
  userDetails=req.session.user
  userHelpers.getAllProducts(req.params.dealer).then((products)=>{
  adminHelpers.allDealers().then((dealers)=>{
    res.render('user/view-products',{userDetails,user:true,products,dealers})
  })
    
  })
})
router.get('/login',(req,res)=>{
    if(req.session.userLoggedIn){
      res.redirect('/')
    }else{
      res.render('user/login',{header:true})
    }
    
  });
  router.post('/loginByEmail',(req,res)=>{
    userHelpers.doLogin(req.body).then((response)=>{
      if(response.status){
        req.session.userLoggedIn=true
        req.session.user=response.user
        console.log(req.session.user.Email);
        res.redirect('/')
      }else{
        res.redirect('/login')
      }
    })
  });
  router.get('/logout',(req,res)=>{
      req.session.user=null
      req.session.userLoggedIn=false
      res.redirect('/')
  })
router.get('/signup',(req,res)=>{
    res.render('user/signup',{header:true})
});
router.post('/signup',(req,res)=>{
    userHelpers.doSignup(req.body).then((response)=>{
        res.redirect('/')
    })
});
router.get('/cart',verifyLogin,async(req,res)=>{
 let cart =await userHelpers.cartItems(req.session.user._id)
    res.render('user/cart',{user:true,cart})
    
})
router.get('/addToCart/:id',(req,res)=>{
  userHelpers.addToCart(req.params.id,req.session.user._id).then(()=>{
    res.redirect('/view-products')
  })
})
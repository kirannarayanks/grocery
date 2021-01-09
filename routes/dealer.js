var express = require('express');
var router = express.Router();
var dealerHelpers = require('../helpers/dealer-helpers');
/* GET home page. */
const verifyLogin=(req,res,next)=>{
  if(req.session.dealer){
    next()
  }else{
    res.redirect('/login')
  }
}
router.get('/', function(req, res, next) {
  if(req.session.dealerLoggedIn){
    dealer=req.session.dealer
    dealerName=req.session.dealer.StoreName
    dealerHelpers.allitems(dealerName).then((products)=>{
      res.render('dealer/dealerdash',{dealer,products});
    })
    
  }else{
    res.redirect('/dealer/login')
  }
  
});
router.get('/login',(req,res)=>{
  if(req.session.dealerLoggedIn){
    res.redirect('/dealer')
  }else{
    res.render('dealer/login',{dealerLogInErr:true})
  }
  
});
router.post('/login',(req,res)=>{
  dealerHelpers.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.dealerLoggedIn=true
      req.session.dealer=response.dealer
      console.log(req.session.dealer.StoreName);
      res.redirect('/dealer')
    }else{
      res.redirect('/dealer/login')
    }
  })
})
router.get('/logout',(req,res)=>{
  req.session.dealer=null
  req.session.dealerLoggedIn=false
  res.redirect('/dealer')
});
router.get('/products',(req,res)=>{
  res.redirect('/dealer')
});
router.get('/additem',verifyLogin,(req,res)=>{
  res.render('dealer/additem')
});
router.post('/additem',(req,res)=>{
  dealerHelpers.additem(req.session.dealer.StoreName,req.body , (id)=>{
    let image=req.files.Image
    image.mv('./public/product-images/'+id+'.jpg',(err)=>{
      if(!err){
        res.redirect('/dealer')
      }else{
          console.log(err);
      }
    })
  })
});
router.get('/edit-item/:id',async(req,res)=>{
 let product =await dealerHelpers.getProductDetails(req.params.id)
 res.render('dealer/edit-item',{product})
});
router.post('/edit-item/:id',(req,res)=>{
  console.log(req.params.id);
  let proid = req.params.id
  dealerHelpers.updateProduct(req.params.id,req.body).then(()=>{
    res.redirect('/dealer')
    if(req.files.Image){
      let image=req.files.Image
      image.mv('./public/product-images/'+proid+'.jpg')
    }
  })
});
router.get('/delete-dealer/:id',verifyLogin,(req,res)=>{
  let id = req.params.id
    dealerHelpers.deleteProduct(id).then((response)=>{
    res.redirect('/dealer')
  })
  })

module.exports = router;

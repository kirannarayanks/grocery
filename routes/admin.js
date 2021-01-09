const { request, response } = require('express');
var express = require('express');
const { allDealers } = require('../helpers/admin-helpers');
var router = express.Router();
var adminHelpers=require('../helpers/admin-helpers');

/* GET users listing. */
router.get('/', function(req, res, next) {
  if(req.session.adminLoggedIn){
    adminHelpers.allDealers().then((dealers)=>{
      console.log('*&'+dealers);
      res.render('admin/adminDash',{adminDash:true,dealers})
    })
    
  }else{
    res.redirect('/admin/Login')
  }
});
router.get('/login',(req,res)=>{
  if(req.session.adminLoggedIn){
    res.redirect('/admin')
  }else{
    console.log('888 ');
    res.render('admin/adminLogin',{admin:true})
  }
});
router.post('/login',(req,res)=>{
  adminHelpers.doLogin(req.body).then((response)=>{
    console.log(response);
    if(response.status){
      req.session.admin=response.admin
      console.log("hello"+response.admin);
      req.session.adminLoggedIn=true
        res.redirect('/admin')
    }
    else{
      console.log("login failed");
      res.redirect('/admin/login')
    }
  })
});
router.get('/logout',(req,res)=>{
  req.session.admin=null
  req.session.adminLoggedIn=false
  res.redirect('/admin')
})
router.get('/add-dealer',(req,res)=>{
  res.render('admin/addDealer')
})
router.post('/add-dealer',(req,res)=>{
  adminHelpers.addDealer(req.body,(id)=>{
    let image = req.files.Image
    image.mv('./public/dealer-images/'+id+'.jpg',(err,done)=>{
      if(!err){
        res.redirect('/admin')
      }else{
        console.log(err);
      }
    })
  })
})

router.get('/edit-dealer/:id',async(req,res)=>{
  let dealer = await adminHelpers.getDealerDetails(req.params.id)
  console.log(dealer);
  res.render('admin/edit-dealer',{dealer})
})
router.post('/edit-dealer/:id',(req,res)=>{
  console.log(req.params.id);
  let id = req.params.id
  adminHelpers.updateDealer(req.params.id,req.body).then(()=>{
    res.redirect('/admin')
    if(req.files.Image){
      let image=req.files.Image
      image.mv('./public/dealer-images/'+id+'.jpg')
    }
  })
})
router.get('/delete-dealer/:id',(req,res)=>{
let id = req.params.id
adminHelpers.deleteDealer(id).then((response)=>{
  res.redirect('/admin/')
})
})

module.exports = router;

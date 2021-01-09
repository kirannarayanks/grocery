var db = require('../config/connection');
var collection = require('../config/collections');
const { response } = require('express');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const { request } = require('../app');

module.exports = {
    doLogin:(dealerData)=>{
        return new Promise(async(resolve,reject)=>{
            let dealer=await db.get().collection(collection.DEALERS).findOne({username:dealerData.username})
            if(dealer){
                bcrypt.compare(dealerData.Password,dealer.Password).then((status)=>{
                    if(status){
                        console.log("login success");
                        response.dealer=dealer
                        response.status=true
                        resolve(response)
                    }else{
                        console.log("dealer loginn failed");
                        resolve({status:false})
                    }
                })
            }else{
                console.log("dealer not found");
                resolve({status:false})
            }
        })
    },
    additem:(dealer,product,callback)=>{
        db.get().collection(collection.PRODUCTS).insertOne( 
            {
                Name:product.Name,
                Category:product.Category,
                Price:product.Price,
                TotalStock:product.TotalStock,
                dealer:dealer
            }
        ).then((data)=>{
            callback(data.ops[0]._id)
        })
    },
    allitems:(dealer)=>{
        return new Promise(async(resolve,reject)=>{
            let products = db.get().collection(collection.PRODUCTS).find({dealer:dealer}).toArray()
            resolve(products)
        })
    },
    getProductDetails:(proid)=>{
            return new Promise((resolve,reject)=>{
                db.get().collection(collection.PRODUCTS).findOne({_id:ObjectId(proid)}).then((product)=>{
                    resolve(product)
                })
            
        })
    },
    updateProduct:(proid,proDetails)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCTS).updateOne({_id:ObjectId(proid)},{
                $set:{
                    Name:proDetails.Name,
                    Category:proDetails.Category,
                    Price:proDetails.Price,
                    TotalStock:proDetails.TotalStock,
                }
            }).then((response)=>{
                resolve(response)
            })
        })
    },
    deleteProduct:(id)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCTS).removeOne({_id:ObjectId(id)}).then((response)=>{
                resolve(response)

            })
    })
}
}
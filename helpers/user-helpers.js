var db = require('../config/connection');
var collection = require('../config/collections');
const { response } = require('express');
const bcrypt = require('bcrypt');
const { ObjectId, ObjectID } = require('mongodb');
const { request } = require('../app');

module.exports={
    getAllProducts:(dealer)=>{
        return new Promise(async(resolve,reject)=>{
            let products = await db.get().collection(collection.PRODUCTS).find({dealer:dealer}).toArray()
            resolve(products)
        })
    },
    doSignup:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            userData.Password=await bcrypt.hash(userData.Password,10)
            db.get().collection(collection.USERS).insertOne(userData).then((data)=>{
                resolve(data.ops[0])
            })
        })
    },
    doLogin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let user=await db.get().collection(collection.USERS).findOne({Email:userData.Email})
            if(user){
                bcrypt.compare(userData.Password,user.Password).then((status)=>{
                    if(status){
                        console.log("login success");
                        response.user=user
                        response.status=true
                        
                        resolve(response)
                    }else{
                        console.log("user loginn failed");
                        resolve({status:false})
                    }
                })
            }else{
                console.log("user not found");
                resolve({status:false})
            }
        })
    },
    addToCart:(proId,userId)=>{
        return new Promise(async(resolve,reject)=>{
            let userCart=await db.get().collection(collection.CART).findOne({user:ObjectId(userId)})
            if(userCart){
                db.get().collection(collection.CART).updateOne({user:ObjectID(userId)},{
                    $set:{products:ObjectID(proId)}
                }).then((response)=>{
                    resolve()
                })
            }else{
                let cartObj={
                    user:ObjectId(userId),
                    products:[ObjectId(proId)]
                }
                db.get().collection(collection.CART).insertOne(cartObj).then((response)=>{
                    resolve()
                })
            }
        })
    }
    
}
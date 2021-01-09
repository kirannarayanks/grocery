var db = require('../config/connection');
var collection = require('../config/collections');
const { response } = require('express');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');

module.exports={
    doLogin:(adminData)=>{
        return new Promise(async(resolve,reject)=>{
            let response={}
            let admin = await db.get().collection(collection.ADMIN_LOGIN).findOne({Email:adminData.Email})
            if(admin)
            {
                if(adminData.Password === admin.Password)
                {
                    console.log("login successful");
                    response.admin=admin
                    response.status=true
                    resolve(response)
                }else{
                    console.log("Login Failed");
                    resolve({status:false})
                }
            }
        })
    },
    addDealer:async(dealerData,callback)=>{
        
            dealerData.Password=await bcrypt.hash(dealerData.Password,10)
            db.get().collection(collection.DEALERS).insertOne(dealerData).then((data)=>{
                callback(data.ops[0]._id)
            })
        },
    allDealers:()=>{
        return new Promise(async(resolve,reject)=>{
            let dealers = db.get().collection(collection.DEALERS).find().toArray()
            resolve(dealers)
        })
    },
    getDealerDetails:(dealerid)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.DEALERS).findOne({_id:ObjectId(dealerid)}).then((dealer)=>{
                resolve(dealer)
            })
        })
    },
    deleteDealer:(id)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.DEALERS).removeOne({_id:ObjectId(id)}).then((response)=>{
                resolve(response)

            })
        })
    },
    updateDealer:(dealerid,dealerDetails)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.DEALERS).updateOne({_id:ObjectId(dealerid)},{
                $set:{
                    Name:dealerDetails.StoreName,
                    username:dealerDetails.username,
                    Password:dealerDetails.Password,
                    Address:dealerDetails.Address,
                    ExtraInfo:dealerDetails.ExtraInfo,
                    Phone:dealerDetails.Phone
                }
            }).then((response)=>{
                resolve(response)
            })
        })
    }
}
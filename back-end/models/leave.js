const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema(
    {
        userId:{type:mongoose.Schema.Types.ObjectId,ref:'Employee',required:true},
        date:{type:Date,required:true},
        type:{
            type:String,
            enum:['sick','personal','vacation','other'],
            required:true
        },
        reason:{type:String,required:true},
        approved:{type:Boolean,default:false},
        approvedAt:{type:Date,default:null},
    },
    {timestamps:true}
);

module.exports = mongoose.model('Leave',leaveSchema);
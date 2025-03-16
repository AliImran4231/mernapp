const { Timestamp } = require('bson');
const mongoose=require('mongoose');

const goalSchema=mongoose.Schema({
    title:{
        type:String,
        required:true
    },
},
    {
    Timestamp:true
    }
);

module.exports=mongoose.model('Goal',goalSchema);
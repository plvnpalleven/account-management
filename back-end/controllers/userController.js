const user = require('../models/userModel');

const registerUser = async (req,res) =>{
    const {name , email , password} = req.body;
};

module.exports = {registerUser};
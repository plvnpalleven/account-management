const Employee = require("../models/employeeModel");

const checkUsername = async (req,res) =>{
    const { username } = req.body;
    try{
        const existingUser = await Employee.findOne({"accountInfo.username":username});
        res.json({exists: !!existingUser});
    }catch(error){
        res.status(500).json({message: "Error checking username"});
    }
};

const registerEmployee = async (req,res) => {
    const {accountInfo , personalInfo} = req.body;
    try{
        const existingUsername = await Employee.findOne({"accountInfo.username": accountInfo.username});
        if(existingUsername){
            return res.status(400).json({message:"Username already exists"});
        }

        const employee = new Employee(req.body);
        const savedEmployee = await employee.save();
        res.status(201).json({message:"Registration successful", data: savedEmployee});
        
    }catch(error){
        res.status(500).json({message:"Registration failed",error:error.message});
    }
};

module.exports = { checkUsername , registerEmployee };
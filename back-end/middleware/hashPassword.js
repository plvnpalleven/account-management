const bcrypt = require("bcrypt");

const hashPassword = async function (next) {
    if(!this.isModified("accountInfo.password"))return next();

    try{
        const salt = await bcrypt.genSalt(10);
        this.accountInfo.password = await bcrypt.hash(this.accountInfo.password, salt);
        next();
    }catch(error){
        console.error("Error hashing password:", error);
        next(error);//ส่งต่อ error ถ้ามีปัญหา
    }
};

module.exports = hashPassword;
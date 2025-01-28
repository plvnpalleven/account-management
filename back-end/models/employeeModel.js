const mongoose = require('mongoose');
const hashPassword = require("../middleware/hashPassword");

const employeeSchema = new mongoose.Schema({
    accountInfo:{
      username:{
        type:String,
        required:true,
        unique:true,
      },
      password:{
        type:String,
        required:true,
      },
    },

    personalInfo: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      dateOfBirth: { type: Date, required: true },
      age: { type: Number, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true, unique: true },
    },
    additionalInfo: {
      religion: {
        type: String,
        enum: ["Buddhism", "Christianity", "Islam", "Hinduism", "Other"],
      },
      ethnicity: { type: String },
      nationality: { type: String },
      militaryStatus: {
        type: String,
        enum: ["Exempted", "Reserve", "Not Yet Drafted", "Other"],
      },
      maritalStatus: {
        type: String,
        enum: ["Single", "Married", "Divorced", "Widowed", "Other"],
      },
    },
    addressInfo: {
      currentAddress: { type: String },
      villageNumber: { type: Number },
      streetName: { type: String },
      subDistrict: { type: String },
      province: { type: String },
      postalCode: { type: Number },
    },
    jobInfo: {
      position: { type: String, required: true },
      expectedSalary: { type: Number, required: true },
    },
    documents: {
      idCard: { type: String },
      houseRegistration: { type: String },
      diploma: { type: String },
      bankAccount: { type: String },
    },
    applicationStatus: {
      type: String,
      enum: ["สมัครใหม่", "รอสัมภาษณ์", "ผ่านการสัมภาษณ์", "ทดลองงาน", "พนักงาน"],
      default: "สมัครใหม่",
    },
    createdAt: { type: Date, default: Date.now },
  });
  
  employeeSchema.pre("save", hashPassword);

  module.exports = mongoose.model("Employee", employeeSchema);
  
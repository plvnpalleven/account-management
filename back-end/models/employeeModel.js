const mongoose = require("mongoose");
const hashPassword = require("../utils/hashPassword");

const employeeSchema = new mongoose.Schema({
  accountInfo: {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
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
    villageName: { type: String },
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
    profilePicture: {
      secure_url: { type: String },
      public_id: { type: String },
      resource_type: { type: String },
    },
    idCard: {
      secure_url: { type: String },
      public_id: { type: String },
      resource_type: { type: String },
    },
    houseRegistration: {
      secure_url: { type: String },
      public_id: { type: String },
      resource_type: { type: String },
    },
    diploma: {
      secure_url: { type: String },
      public_id: { type: String },
      resource_type: { type: String },
    },
    bankAccount: {
      secure_url: { type: String },
      public_id: { type: String },
      resource_type: { type: String },
    },
  },
  applicationStatus: {
    type: String,
    enum: ["new", "interview", "approved", "probation", "employee", "rejected"],
    default: "new",
  },

  accessStatus: {
    type: String,
    enum: ["pending", "granted", "revoked"],
    default: "pending",
  },

  role: {
    type: String,
    enum: ["user", "admin"], // "admin" = HR / Manager / Boss
    default: "user",
  },
  createdAt: { type: Date, default: Date.now },
});

employeeSchema.pre("save", hashPassword);

module.exports = mongoose.model("Employee", employeeSchema);

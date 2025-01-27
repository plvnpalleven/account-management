import { z } from "zod";

//สร้าง schema ครอบคลุมข้อมูลทั้งหมด
export const employeeInfoSchema = z.object({
  jobInfo: z.object({
    position: z.string().min(1, "Position is required"),
    expectedSalary: z
    .coerce.number().min(1,"Expected Salary is required"),
    }),
  personalInfo: z.object({
    firstName: z.string().min(1, "First Name is required"),
    lastName: z.string().min(1, "Last Name is required"),
    dateOfBirth: z.string().optional(),
    age: z.coerce.number().min(18, "Age must be at least 18").max(100),
    phone: z
      .string()
      .nonempty("Phone number is required")
      .regex(/^\d+$/, "Phone must be numeric")
      .min(10, "Phone number is not correct"),
    email: z.string().email("Invalid email address"),
  }),
  additionalInfo: z.object({
    religion: z.string().min(1, "Religion is required"),
    ethnicity: z.string().min(1, "Ethnicity is required"),
    nationality: z.string().min(1, "Nationality is required"),
    militaryStatus: z.string().min(1, "Military Status is required"),
    maritalStatus: z.string().min(1, "Marital Status is required"),
  }),
  addressInfo: z.object({
    currentAddress: z.string().min(1, "Current Address is required"),
    villageNumber: z.string().optional(),
    streetName: z.string().optional(),
    subDistrict: z.string().optional(),
    province: z.string().min(1, "Province is required"),
    postalCode: z
      .string()
      .regex(/^\d+$/, "Postal Code must be numeric")
      .min(1, "Postal Code is required"),
  }),
  documents: z.object({
    idCard: z.string().url("Please upload your id card"),
    houseRegistration: z
      .string()
      .url("Please upload your house registration file"),
    diploma: z.string().url("Please upload your diploma / certificate"),
    bankAccount: z.string().url("Please upload your bank account file"),
  }),
});

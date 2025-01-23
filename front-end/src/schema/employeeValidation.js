import { z } from "zod";

//สร้าง schema ครอบคลุมข้อมูลทั้งหมด
export const employeeInfoSchema = z.object({
  jobInfo: z.object({
    position: z.string().min(1, "Position is required"),
    expectedSalary: z
      .string()
      .regex(/^\d+$/, "Expected Salary must be a number"),
  }),
  personalInfo: z.object({
    firstName: z.string().min(1, "First Name is required"),
    lastName: z.string().min(1, "Last Name is required"),
    age: z.number().min(18, "Age must be at least 18").max(100),
    phone: z.string().regex(/^\d+$/, "Phone must be numeric"),
    email: z.string().email("Invalid email address"),
  }),
  additionInfo: z.object({
    religion: z.string().min(1, "Religion is required"),
    ethnicity: z.string().optional(),
    nationality: z.string().optional(),
    militaryStatus: z.string().optional(),
    maritalStatus: z.string().optional(),
  }),
  addressInfo: z.object({
    currentAddress: z.string().min(1, "Current Address is required"),
    villageNumber: z.string().optional(),
    streetName: z.string().optional(),
    subDistrict: z.string().optional(),
    province: z.string().optional(),
    postalCode: z.string().regex(/^d+$/, "Postal Code must be numeric"),
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

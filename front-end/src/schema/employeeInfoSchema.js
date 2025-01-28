import { z } from "zod";

const nonEmptyString = (fieldName, errorMessage = {}) =>
  z.preprocess(
    (value) => {
      if (typeof value === "string") {
        const trimmed = value.trim();
        return trimmed === "" ? undefined : trimmed;
      }
      return value;
    },
    z
      .string({
        required_error: errorMessage.required || `${fieldName} is required`,
        invalid_type_error:
          errorMessage.invalid || `Invalid input for ${fieldName}`,
      })
      .nonempty(`${fieldName} cannot be empty`)
  );
const nonEmptyStringWithRegex = (
  fieldName,
  regex,
  message,
  errorMessage = {}
) =>
  z.preprocess(
    (value) => {
      if (typeof value === "string") {
        const trimmed = value.trim();
        return trimmed === "" ? undefined : trimmed;
      }
      return value;
    },
    z
      .string({
        required_error: errorMessage.required || `${fieldName} is required`,
        invalid_type_error:
          errorMessage.invalid || `Invalid input for ${fieldName}`,
      })
      .nonempty(`${fieldName} cannot be empty`)
      .regex(regex, message)
  );

//สร้าง schema ครอบคลุมข้อมูลทั้งหมด
export const employeeInfoSchema = z.object({
  accountInfo: z
    .object({
      username: z
        .string()
        .min(3, "User must be at least 3 characters long")
        .trim(),
      password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .trim(),
      confirmPassword: z.string().trim(),
    })
    .superRefine((data, ctx) => {
      if (data.confirmPassword !== data.password) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Passwords do not match",
          path: ["confirmPassword"], // ระบุ field ที่มีปัญหา
        });
      }
    }),

  jobInfo: z.object({
    position: nonEmptyString("Position"),
    expectedSalary: z.coerce
      .number({
        required_error: "Expected Salary is required",
        invalid_type_error: "Please enter a valid number",
      })
      .min(15000, "Expected Salary must be at least 15,000"),
  }),
  personalInfo: z.object({
    firstName: nonEmptyString("First name"),
    lastName: nonEmptyString("Last name"),
    dateOfBirth: nonEmptyStringWithRegex(
      "Date of Birth",
      /^\d{4}-\d{2}-\d{2}$/,
      "Date of Birth must be in the format YYYY-MM-DD"
    ),

    age: z.preprocess(
      (value) => {
        //ถ้าเป็น string ว่าง ให้ return เป็น undefined
        //จะได้ไปกระตุ้น required_error แทน invalid_type_error
        if (typeof value === "string" && value.trim() === "") {
          return undefined;
        }
        return value;
      },
      z.coerce
        .number({
          required_error: "Age is required",
          invalid_type_error: "Please enter a valid number",
        })
        .min(18, "Age must be atleast 18")
    ),

    phone: nonEmptyStringWithRegex(
      "Phone number",
      /^\d{10,15}$/,
      "Phone number must be numeric and between 10 to 15 digits"
    ),

    email: z.preprocess(
      (value) => (typeof value === "string" ? value.trim() : value), // ตัดช่องว่างก่อน
      z

        .string({
          required_error: "Email is required",
        })
        .min(1, "Email is required")
        .email("Invalid email address")
    ),
  }),
  additionalInfo: z.object({
    religion: nonEmptyString("Religion"),
    ethnicity: nonEmptyString("Ethnicity"),
    nationality: nonEmptyString("Nationality"),
    militaryStatus: nonEmptyString("Military Status"),
    maritalStatus: nonEmptyString("Marital Status"),
  }),
  addressInfo: z.object({
    currentAddress: nonEmptyString("Current Address"),
    villageNumber: z.string().optional().default(""),
    streetName: z.string().optional().default(""),
    subDistrict: z.string().optional().default(""),
    province: nonEmptyString("Province"),
    postalCode: nonEmptyStringWithRegex(
      "Postal Code",
      /^\d{5}$/,
      "Postal Code must be exactly 5 digits"
    ),
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

import * as Yup from "yup";

export const LoginSchemas = Yup.object().shape({
  Email: Yup.string()
    .email("Invalid email address, please add @ or .com")
    .required("Please Enter Your Email"),
  Password: Yup.string().required("Please Enter Your Password"),
});

export const ForgotSchemas = Yup.object().shape({
  Email: Yup.string().email("Invalid email address, please add @ or .com"),
});
export const UpdatepasswordSchemas = Yup.object().shape({
  Newpassword: Yup.string().required("Please enter your new password"),

  confirmpassword: Yup.string()
    .oneOf([Yup.ref("Newpassword"), null], "Passwords must match")
    .required("Please enter your confirmation password"),
});
export const EditprofileSchemas = Yup.object().shape({
  Fristname: Yup.string("Please Enter Your First name"),
  Lastname: Yup.string("Please Enter Your Last name"),
});
export const ChnagepasswordSchemas = Yup.object().shape({
  oldpassword: Yup.string().required("Please Enter Your old Password"),
  Newpassword: Yup.string().required("Please Enter Your New Password"),
  confirmpassword: Yup.number().required("Please Enter Your Confirm Password"),
});

export const ProviderSchemas = Yup.object().shape({
  Name: Yup.string().required("Please Enter Your name"),
  Email: Yup.string()
    .email("Invalid email address, please add @ or .com")
    .required("Please Enter Your Email"),
  Number: Yup.string()
    .required("Please enter your number")
    .max(21, "Mobile number must be exactly 16 digits"),
});
export const CarbrandSchemas = Yup.object().shape({
  BrandName: Yup.string().required("Please Enter Car Brand"),
});
const currentYear = new Date().getFullYear();

export const CarModelSchemas = Yup.object().shape({
  BrandName: Yup.string().required("Please Enter Car Brand"),
  ModelName: Yup.string().required("Please Enter Model Name"),
  Year: Yup.number()
    .typeError("Year must be a number")
    .required("Please Enter Year")
    .min(2008, `Year must be at least 2008`)
    .max(currentYear, `Year cannot be more than ${currentYear}`),
});
export const SerivesSchemas = Yup.object().shape({
  serviceName: Yup.string().required("Please Enter Your Service Name "),
  servicedesc: Yup.string().required("Please Enter Your Service description "),
  rate: Yup.number()
    .typeError("Please Enter Service Price")
    .required("Please Enter Service Price")
    .max(999, "Service Price cannot be more than 999"),
  image: Yup.mixed()
    .required("Please upload a Service Image")
    .test("fileType", "Only image files are allowed", (value) => {
      return (
        value &&
        ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(
          value.type
        )
      );
    }),
});
export const ExtrasSchemas = Yup.object().shape({
  extrasName: Yup.string().required("Please Enter Your Service Name "),

  rate: Yup.number()
    .typeError("Please Enter Service Price")
    .required("Please Enter Service Price")
    .max(999, "Service Price cannot be more than 999"),
  image: Yup.mixed()
    .required("Please upload a Service Image")
    .test("fileType", "Only image files are allowed", (value) => {
      return (
        value &&
        ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(
          value.type
        )
      );
    }),
});
export const AssignSchemas = Yup.object().shape({
  ServiceTittle: Yup.string().required("Please Selecte a Service Tittle"),
  Zone: Yup.string().required("Please Selecte a Zone"),

  Provider: Yup.string().required("Please Selecte a Provider"),
});
export const AddFaqsSchemas = Yup.object().shape({
  question: Yup.string().required("Please enter your question"),
  answer: Yup.string().required("Please enter your answer"),
});

export const SupportsSchemas = Yup.object().shape({
  reply: Yup.string().required("Reply is required"),
});

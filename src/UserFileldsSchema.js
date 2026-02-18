import { type } from "@testing-library/user-event/dist/type";

export const formFields = [
  {
    name: "firstName",
    label: "First Name",
    rules: [{ required: true, message: "First Name is required" }],
    showInTable: true,
    type: "text"
  },
  {
    name: "lastName",
    label: "Last Name",
    rules: [{ required: true, message: "Last Name is required" }],
    showInTable: true,
    type: "text"
  },
  {
    name: "phoneNumber",
    label: "Phone Number",
    rules: [
      { required: true, message: "Phone is required" },
      { pattern: /^[0-9]{10}$/, message: "Enter valid 10 digit number" }
    ],
    showInTable: true,
    type: "number"
  },
  {
    name: "email",
    label: "Email Address",
    rules: [
      { required: true, message: "Email is required" },
      { type: "email", message: "Invalid email" }
    ],
    showInTable: true,
    type: "email"
  },
  {
    name: "address",
    label: "Address",
    rules: [
      { required: false, message: "Address is required" } ,   
    ],
    showInTable: false,
    type: "text"
  },
  {
    name: "dob",
    label: "Date of Birth",
    rules: [
      { required: false, message: "Date of Birth is required" } ,   
    ],
    showInTable: false,
    type: "date"
  }
  
];


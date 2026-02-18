import { Modal, message, Form, Input, Button } from "antd";
import { formFields } from "./UserFileldsSchema";
import React, { useState, useEffect } from "react";
const AddNewUser = ({ setMode, form, setSelectedUser, selectedUser, mode, fetchUsers, setIsModalOpen, initialValues }) => {
  // 🔹 CREATE + UPDATE
  const onSubmit = async (values) => {
    const url =
      mode === "edit"
        ? `http://localhost/assignment/Home/updateUser/${selectedUser.userId}`
        : "http://localhost/assignment/Home/registerUser";
    const response = await fetch(url, {
      method: mode === "edit" ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const result = await response.json();
    if (result.status) {
      message.success(mode === "edit" ? "User Updated" : "User Added");
      fetchUsers();
    } else {
      message.error(result.message);
    }
    setIsModalOpen(false);
    setSelectedUser(null);
    setMode("add");
  };
  console.log("Form submitted with values:", selectedUser);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onSubmit}
    >
      {formFields.map(field => (
        <Form.Item
          key={field.name}
          name={field.name}
          label={field.label}
          rules={field.rules}
          type={field.type}
        >
          <Input />
        </Form.Item>
      ))}
      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          {mode === "edit" ? "Update User" : "Save User"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddNewUser;

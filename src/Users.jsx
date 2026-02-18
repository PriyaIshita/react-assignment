import React, { useState, useEffect } from "react";
import { Form, message, Modal, Card, Input, Button, Space, DatePicker, Table, Typography } from "antd";
import AddNewUser from "./AddNewUser";
import { formFields } from "./UserFileldsSchema";

const { Title } = Typography;
const Users = () => {
  const [records, setRecords] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [mode, setMode] = useState("add"); // add | edit
  const [selectedUser, setSelectedUser] = useState(null);
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
  });

  const fetchUsers = () => {
    fetch("http://localhost/assignment/Home/showallrecords")
      .then((res) => res.json())
      .then((data) => {
        setRecords(data);
        setFilteredItems(data);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = () => {
    const filtered = records.filter(item =>
      item.firstName.toLowerCase().includes(searchTerm.firstName.toLowerCase()) &&
      item.lastName.toLowerCase().includes(searchTerm.lastName.toLowerCase()) &&
      item.phoneNumber.includes(searchTerm.phoneNumber) &&
      item.email.toLowerCase().includes(searchTerm.email.toLowerCase())
    );
    setFilteredItems(filtered);
    console.log("Search Term:", filtered);
  };

  const handleChange = (key, value) => {
    setSearchTerm(prev => ({ ...prev, [key]: value }));
  };

  const handleEdit = (record) => {
    setMode("edit");
    setSelectedUser(record);
    let extraFields = {};

    // Convert string → object
    if (record.extra_fields) {
      try {
        extraFields = JSON.parse(record.extra_fields);
      } catch (e) {
        console.error("Invalid extra_fields JSON", e);
      }
    }

    // Merge normal + dynamic fields
    const formData = {
      ...record,
      ...extraFields,
    };
    form.setFieldsValue(formData);
    setIsModalOpen(true);
  };

  // 🔹 DELETE USER
  const handleDelete = async (userId) => {
    const response = await fetch(
      `http://localhost/assignment/Home/deleteuser/${userId}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      }
    );

    const result = await response.json();
    if (result.status) {
      message.success("User Deleted");
      fetchUsers();
    }
  };

  const columns = [
    ...formFields
      .filter(field => field.showInTable)
      .map(field => ({
        title: field.label,
        dataIndex: field.name,
        key: field.name,
      })),
    {
      title: "Extra Fields",
      key: "extra_fields",
      render: (_, record) => (
        <Space>
          {Object.keys(record).map(key => {
            if (key === 'extra_fields') {
              return (
                <div key={key}>
                  {record[key]}
                </div>
              );
            } else {
              return null;
            }
          })}
        </Space>
      )
    },

    // ✅ ACTION COLUMN ADDED HERE
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button danger onClick={() => handleDelete(record.userId)}>
            Delete
          </Button>
        </Space>
      )
    }
  ];

  const showModal = () => {
    setIsModalOpen(true);
    setMode("add");
    setSelectedUser(null);
    form.resetFields();
  };

  return (
    <div style={styles.container}>
      <Card style={styles.card}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16
          }}
        >
          <Title level={3} style={{ margin: 0 }}>
            User Details
          </Title>

          <Button type="primary" onClick={showModal}>
            Add User
          </Button>
        </div>
        {/* Search Section */}
        <Space wrap size="middle" style={{ marginBottom: 16 }}>
          <Input
            placeholder="Search First Name"
            value={searchTerm.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
          />
          <Input
            placeholder="Search By Last Name"
            value={searchTerm.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
          />
          <Input
            placeholder="Search Phone Number"
            value={searchTerm.phoneNumber}
            onChange={(e) => handleChange("phoneNumber", e.target.value)}
          />
          <Input
            placeholder="Search Email"
            value={searchTerm.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
          <Button type="primary" onClick={handleSearch}>
            Search
          </Button>
          <Button
            onClick={() => {
              setSearchTerm({
                firstName: "",
                lastName: "",
                phoneNumber: "",
                email: "",
              });
              setFilteredItems(records);
            }}
          >
            Reset
          </Button>
        </Space>
        {/* Table Section */}
        <Table
          columns={columns}
          dataSource={filteredItems}
          rowKey={(record, index) => index}
          pagination={{ pageSize: 5 }}
          bordered
        />
        <Modal
          title={mode === "edit" ? "Update User" : "Add User"}
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
        >
          <AddNewUser setMode={setMode} form={form} setSelectedUser={setSelectedUser} selectedUser={selectedUser} mode={mode} fetchUsers={fetchUsers} initialValues={searchTerm} setIsModalOpen={setIsModalOpen} />
        </Modal>
      </Card>
    </div>
  );
};

const styles = {
  container: {
    padding: 2,
    minHeight: "100vh",
    minHeight: "100vh",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    borderRadius: 12,
    boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
  },
}
export default Users;

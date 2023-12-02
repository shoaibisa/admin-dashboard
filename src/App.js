import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [editItemId, setEditItemId] = useState(null);

  // editing the rows and saving the changes
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("");

  const pageSize = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
        );
        const res = await response.json();
        setUsers(res);
        console.log(res);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const filteredData = users.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleEdit = (row) => {
    setEditItemId((prevId) => (prevId === row.id ? null : row.id));
    setEditEmail(row.email);
    setEditName(row.name);
    setEditRole(row.role);
  };

  const handleDelete = (id) => {
    const updatedUsers = users.filter((u) => u.id !== id);
    setUsers(updatedUsers);
  };

  const handleSave = (id, updatedUser) => {
    const updatedUsers = users.map((u) =>
      u.id === id ? { ...u, ...updatedUser } : u
    );
    setUsers(updatedUsers);
    setEditItemId(null);
    setEditName("");
    setEditEmail("");
    setEditRole("");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRowSelect = (id) => {
    const isSelected = selectedRows.includes(id);
    if (isSelected) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleBulkDelete = () => {
    const updatedData = users.filter((row) => !selectedRows.includes(row.id));
    setUsers(updatedData);
    setSelectedRows([]);
  };

  return (
    <div style={{ margin: "auto" }}>
      <h1 style={{ textAlign: "center" }}>Admin Dashboard</h1>
      <div style={{ width: "20rem", marginLeft: "10%" }}>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table style={{ margin: "auto", overflow: "auto" }}>
        <thead>
          <tr>
            {/* select all rows check box */}
            <th>
              <input
                type="checkbox"
                checked={
                  selectedRows.length === paginatedData.length &&
                  paginatedData.length !== 0
                }
                onChange={() => {
                  if (selectedRows.length === paginatedData.length) {
                    setSelectedRows([]);
                  } else {
                    setSelectedRows(paginatedData.map((row) => row.id));
                  }
                }}
              />
            </th>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {paginatedData.map((row) => (
            <tr
              key={row.id}
              className={selectedRows.includes(row.id) ? "selected" : ""}
            >
              <td>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(row.id)}
                  onChange={() => handleRowSelect(row.id)}
                />
              </td>
              <td>{row.id}</td>
              <td>
                {/* mapping if not edited */}
                {editItemId === row.id ? (
                  <input
                    type="text"
                    value={editName !== "" ? editName : row.name}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                ) : (
                  row.name
                )}
              </td>
              <td>
                {editItemId === row.id ? (
                  <input
                    type="text"
                    value={editEmail !== "" ? editEmail : row.email}
                    onChange={(e) => setEditEmail(e.target.value)}
                  />
                ) : (
                  row.email
                )}
              </td>

              <td>
                {editItemId === row.id ? (
                  <select
                    value={editRole !== "" ? editRole : row.role}
                    onChange={(e) => setEditRole(e.target.value)}
                  >
                    <option value="admin">admin</option>
                    <option value="member">member</option>
                  </select>
                ) : (
                  row.role
                )}
              </td>
              <td>
                {editItemId === row.id ? (
                  <button
                    onClick={() =>
                      handleSave(row.id, {
                        name: editName,
                        email: editEmail,
                        role: editRole,
                      })
                    }
                  >
                    Save
                  </button>
                ) : (
                  <button onClick={() => handleEdit(row)}>Edit</button>
                )}
                <button onClick={() => handleDelete(row.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* users counts */}
      <p style={{ textAlign: "left", marginLeft: "100px" }}>
        <strong>{filteredData.length}</strong> results
      </p>
      <div style={{ textAlign: "center" }}>
        <button className="first-page" onClick={() => handlePageChange(1)}>
          First Page
        </button>
        <button
          className="previous-page"
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous Page
        </button>

        {Array.from({ length: totalPages }).map((_, index) => (
          <button key={index} onClick={() => handlePageChange(index + 1)}>
            {index + 1}
          </button>
        ))}
        <button
          className="next-page"
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next Page
        </button>
        <button
          className="last-page"
          onClick={() => handlePageChange(totalPages)}
        >
          Last Page
        </button>
        <button className="delete-selected" onClick={handleBulkDelete}>
          Delete Selected 🗑️
        </button>
      </div>
      <p style={{ textAlign: "center" }}>
        <span>
          <a
            href="https://github.com/shoaibisa/admin-dashboard"
            rel="noreferrer"
          >
            @shoaibisa
          </a>{" "}
        </span>
      </p>
    </div>
  );
};

export default App;

import React, { useEffect, useState } from 'react'
import jwt from 'jsonwebtoken'
import { useHistory } from 'react-router-dom'

const Admin = () => {
    const [users, setUsers] = useState([]);

	const history = useHistory()
	

	const handleClick = () => {
    history.push('/game'); 
  };

const fetchUsers = async () => {
  try {
    const response = await fetch("http://localhost:3000/users", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    const data = await response.json();
    setUsers(data);
  } catch (error) {
    console.error(error);
    // Handle error state or display an error message
  }
};

useEffect(() => {
  fetchUsers(); 
}, []);

	useEffect(() => {
		const token = localStorage.getItem('token')
		if (token) {
			const user = jwt.decode(token)
			if (!user) {
				localStorage.removeItem('token')
				history.replace('/signin')
			} else {
        console.log("user detail----------------------",user)
			}
		}
	}, [])

  const tableStyle = {
    backgroundColor: "#f8f8f8",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  };

  const headingStyle = {
    marginBottom: "20px",
    fontSize: "24px",
    color: "#333",
  };

  const invisibleTableStyle = {
    width: "100%",
    borderCollapse: "collapse",
  };

  const invisibleTableHeaderStyle = {
    background: "transparent",
    color: "#888",
    fontWeight: "normal",
    borderBottom: "1px solid #ddd",
    padding: "8px",
  };

  const invisibleTableDataStyle = {
    background: "transparent",
    borderBottom: "1px solid #ddd",
    padding: "8px",
  };

	return (
    <div>
      <h1>Admin Page</h1>
      <div style={tableStyle}>
        <h2 style={headingStyle}>User List</h2>
        <table style={invisibleTableStyle}>
          <thead>
            <tr>
              <th style={invisibleTableHeaderStyle}>Email</th>
              <th style={invisibleTableHeaderStyle}>Address</th>
              <th style={invisibleTableHeaderStyle}>isAdmin</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td style={invisibleTableDataStyle}>{user.email}</td>
                <td style={invisibleTableDataStyle}>{user.address}</td>
                <td style={invisibleTableDataStyle}>
                  {user.isAdmin.toString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* <ul>
        {users.map((user) => (
          <li key={user._id}>
            <strong>Email:</strong> {user.email} <strong>Address:</strong>{" "}
            {user.address} | <strong>isAdmin:</strong> {user.isAdmin.toString()}
          </li>
        ))}
      </ul> */}
      <button onClick={handleClick}>Go to Other Page</button>
    </div>
  );
}

export default Admin

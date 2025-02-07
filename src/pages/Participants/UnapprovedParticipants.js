import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UnapprovedParticipants.css";
import Header from "../../components/Header/Header";
import Menu from "../../components/Menu/Menu";

export default function UnapprovedParticipants({ userRole }) {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8081/participantdetails/displayunapprovedusers"
        );
        setUsers(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users.");
      }
    };

    fetchUsers();
  }, []);

  const handleSelection = (userId) => {
    setSelectedUsers((prev) => ({
      ...prev,
      [userId]: !prev[userId], // Toggle selection
    }));
  };

  const updateUserRole = async (newRole) => {
    const selectedIds = Object.keys(selectedUsers).filter((id) => selectedUsers[id]);

    if (selectedIds.length === 0) {
      alert("Please select at least one user.");
      return;
    }

    try {
      await axios.put("http://localhost:8081/participantdetails/updateusers", {
        userIds: selectedIds,
        position: newRole,
      });

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          selectedIds.includes(user.user_id.toString()) ? { ...user, position: newRole } : user
        )
      );
      setSelectedUsers({});
    } catch (error) {
      console.error("Error updating users:", error);
      alert("Failed to update users.");
    }
  };

  const deleteUsers = async () => {
    const selectedIds = Object.keys(selectedUsers).filter((id) => selectedUsers[id]);

    if (selectedIds.length === 0) {
      alert("Please select at least one user to deny.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete the selected users?")) {
      return;
    }

    try {
      await axios.delete("http://localhost:8081/participantdetails/deleteusers", {
        data: { userIds: selectedIds }, // Pass userIds in request body
      });

      // Remove deleted users from state
      setUsers((prevUsers) =>
        prevUsers.filter((user) => !selectedIds.includes(user.user_id.toString()))
      );
      setSelectedUsers({});
    } catch (error) {
      console.error("Error deleting users:", error);
      alert("Failed to delete users.");
    }
  };

  return (
    <>
      <Header />
      <Menu />

      <h1 id="partheader">Unapproved Participants</h1>
      <div className="approvals">
        {error ? <p>{error}</p> : null}
        {users.length === 0 ? <p>Loading users...</p> : null}

        {users.map((user) => (
          <div className="userselection" key={user.user_id}>
            <input
              type="checkbox"
              checked={!!selectedUsers[user.user_id]}
              onChange={() => handleSelection(user.user_id)}
            />
            <label>{user.first_name} {user.last_name}</label>
          </div>
        ))}

        <div className="approvepartcont">
          <button onClick={() => updateUserRole("Participant")}>Approve (Member)</button>
          <button onClick={() => updateUserRole("Board Member")}>Approve (Board)</button>
          <button onClick={deleteUsers}>Deny Request</button>
        </div>
      </div>
    </>
  );
}

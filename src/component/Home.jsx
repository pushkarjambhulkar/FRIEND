import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [users, setUsers] = useState([]); // List of all users
  const [friends, setFriends] = useState([]); // List of friends
  const [searchQuery, setSearchQuery] = useState(""); // Search query
  const navigate = useNavigate();

  // Fetch initial users and friends
  useEffect(() => {
    fetchUsers();
    fetchFriends();
  }, []);

  // Fetch all users (excluding the current user)
  const fetchUsers = () => {
    axios
      .get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        if (Array.isArray(response.data.users)) {  // Check if `users` is an array
          setUsers(response.data.users);  // Correctly set users from the response
        } else {
          console.error("Invalid users data:", response.data);
          setUsers([]); // Fallback to an empty array
        }
      })
      .catch((error) => {
        console.error(error);
        if (error.response?.status === 401) {
          navigate("/login"); // Redirect to login if unauthorized
        }
      });
  };

  // Fetch the current user's friends
  const fetchFriends = () => {
    axios
      .get("http://localhost:5000/api/friends", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        if (Array.isArray(response.data)) {
          setFriends(response.data);
        } else {
          console.error("Invalid friends data:", response.data);
          setFriends([]); // Fallback to an empty array
        }
      })
      .catch((error) => {
        console.error(error);
        if (error.response?.status === 401) {
          navigate("/login"); // Redirect to login if unauthorized
        }
      });
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    axios
      .get(`/api/friends/users/search?query=${e.target.value}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        if (Array.isArray(response.data.users)) {  // Handle the `users` array in the response
          setUsers(response.data.users);
        } else {
          console.error("Invalid search data:", response.data);
          setUsers([]); // Fallback to an empty array
        }
      })
      .catch((error) => console.error(error));
  };

  // Handle adding a friend
  const handleAddFriend = (user) => {
    axios
      .post(
        "http://localhost:5000/api/friends/addNew",
        { friendId: user._id },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      )
      .then(() => {
        setFriends([...friends, user]); // Update friends list
        setUsers(users.filter((u) => u._id !== user._id)); // Remove user from the list
      })
      .catch((error) => console.error(error));
  };

  // Handle removing a friend
  const handleRemoveFriend = (friendId) => {
    axios
      .delete(`http://localhost:5000/api/friends/${friendId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(() => {
        setFriends(friends.filter((friend) => friend._id !== friendId)); // Update friends list
      })
      .catch((error) => console.error(error));
  };

  // Filter users based on search query
  const filteredUsers = Array.isArray(users)
    ? users.filter((user) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Home Page</h1>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Display Users */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">All Users</h2>
        <ul className="space-y-2">
          {filteredUsers.map((user) => (
            <li
              key={user._id}
              className="flex justify-between items-center p-2 bg-gray-100 rounded-md"
            >
              <span>{user.username}</span>
              <button
                onClick={() => handleAddFriend(user)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Add Friend
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Display Friends */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Friends List</h2>
        <ul className="space-y-2">
          {friends.map((friend) => (
            <li
              key={friend._id}
              className="flex justify-between items-center p-2 bg-gray-100 rounded-md"
            >
              <span>{friend.username}</span>
              <button
                onClick={() => handleRemoveFriend(friend._id)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Unfriend
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
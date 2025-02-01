import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [users, setUsers] = useState([]); // List of all users
  const [friends, setFriends] = useState([]); // List of friends
  const [searchQuery, setSearchQuery] = useState(""); // Search query
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status
  const navigate = useNavigate();

  // Check if the user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      fetchUsers();
      fetchFriends();
    }
  }, []);

  // Fetch all users (excluding the current user)
  const fetchUsers = () => {
    axios
      .get("https://friend-zdqg.onrender.com/api/users", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        if (Array.isArray(response.data.users)) {
          setUsers(response.data.users);
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
      .get("https://friend-zdqg.onrender.com/api/friends", {
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
        if (Array.isArray(response.data.users)) {
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
        "https://friend-zdqg.onrender.com/api/friends/addNew",
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
      .delete(`https://friend-zdqg.onrender.com/api/friends/${friendId}`, {
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

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    setIsLoggedIn(false); // Update login status
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Home Page</h1>

      {/* Login Button */}
      {!isLoggedIn && (
        <div className="mb-6">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Login
          </button>
        </div>
      )}

      {/* Display Content if Logged In */}
      {isLoggedIn && (
        <>
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
            <ul className="space-y-4">
              {filteredUsers.map((user) => (
                <li
                  key={user._id}
                  className="p-4 bg-gray-100 rounded-md shadow-sm"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">{user.username}</h3>
                      <p className="text-sm text-gray-600">
                        <strong>Profession:</strong> {user.profession}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Hobbies:</strong> {user.hobbies.join(", ")}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Location:</strong> {user.location}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>DOB:</strong> {new Date(user.dob).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleAddFriend(user)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      Add Friend
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Display Friends */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Friends List</h2>
            <ul className="space-y-4">
              {friends.map((friend) => (
                <li
                  key={friend._id}
                  className="p-4 bg-gray-100 rounded-md shadow-sm"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">{friend.username}</h3>
                      <p className="text-sm text-gray-600">
                        <strong>Profession:</strong> {friend.profession}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Hobbies:</strong> {friend.hobbies.join(", ")}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Location:</strong> {friend.location}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>DOB:</strong> {new Date(friend.dob).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveFriend(friend._id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      Unfriend
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Logout Button */}
          <div className="mt-6">
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
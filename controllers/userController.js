const { User } = require('../models/userModel');

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err });
  }
};

// Create a new user
const createUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.create({ username, email, password });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error creating user', error: err });
  }
};

module.exports = { getUsers, createUser };

const express = require('express');
const controllers = require('../controllers ')
const userController = controllers.userController;
const userRouter = express.Router();  

// Create a new user
userRouter.post('/', userController.createUser);

// Get all users
userRouter.get('/', userController.getAllUsers);

// Get a user by ID
userRouter.get('/:id', userController.getUser);

// Update a user by ID
userRouter.put('/:id', userController.updateUser);

// Delete a user by ID
userRouter.delete('/:id', userController.deleteUser);

module.exports = userRouter;

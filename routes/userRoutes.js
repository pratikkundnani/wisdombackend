const express = require('express');
const controllers = require('../controllers ')
const userController = controllers.userController;
const userRouter = express.Router();  
const jwt = require('jsonwebtoken');


function verifyToken(req, res, next) {
    const secret_key = process.env.SECRET_KEY;
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    jwt.verify(token, secret_key, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        req.userId = decoded.userId;
        next();
    });
}

// write a route to check if the user is logged in
userRouter.get('/check', verifyToken, (req, res) => {
    res.status(200).json({message: 'User is logged in'});
});
// Create a new user
userRouter.post('/', userController.createUser);

// Get all users
userRouter.get('/', verifyToken,userController.getAllUsers);

// Get a user by ID
userRouter.get('/:id',verifyToken ,userController.getUser);

// Update a user by ID
userRouter.put('/:id', verifyToken,userController.updateUser);

// Delete a user by ID
userRouter.delete('/:id', verifyToken,userController.deleteUser);

// authenticate a user
userRouter.post('/login', userController.logInUser);

module.exports = userRouter;

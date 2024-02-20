User = require('../models/User');

const userController = {
    async createUser(req, res) {
        try {
        const {username, email, password} = req.body;
        const newUser = new User({username, email, password});
        await newUser.save();
        return res.status(201).json({message : 'User createad successfully', user: newUser});
        }
        catch(error) {
            console.log(error);
            return res.status(500).json({message: 'Error while creating user', error: error.stack});
        }
    },
    async getAllUsers(req, res) {
        try {
            const users = await User.find();
            res.status(201).json(users);
        }
        catch(error) {
            res.status(500).json({message : 'Error while fetching all users', error : error.stack});
        }
    }, 
    async getUser(req, res) {
        try {
            const{userId} = req.params;
            const user = await User.find(userId);
            if(!user) {
                return res.status(404).json({error : 'User not found'});
            }
            return res.status(200).json(user);
        }
        catch(error) {
            return res.status(500).json({message: 'Error while fetching the user', error: error.stack});
        }
    }, 
    async updateUser(req, res) {
        try { 
            const { id } = req.params; // Assuming the user ID is passed as a route parameter
            const { username, password, email } = req.body; // Extract the fields to be updated from the request body

            // Validate the fields to be updated, if necessary

            // Find the user in the database based on their ID
            const user = await User.findById(id);

            // Check if the user exists
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Update the user object with the new values for the fields to be updated
            if (username) {
                user.username = username;
            }
            if (password) {
                user.password = password;
            }
            if (email) {
                user.email = email;
            }

            // Save the changes to the database
            await user.save();

            // Return a success response
            return res.status(200).json({ message: 'User updated successfully', user });
        } 
        catch(error) {
            res.status(500).json({message : 'Error while updating the user', error : error.stack});
        }
    },
    async deleteUser(req, res) {
        try {
            const{userId} = req.body;
            let user = await User.findOneAndDelete({userId : userId});
            if(!user) {
                return res.status(404).json({message : 'user not found'});
            }
            return res.status(201).json({message: 'deleted successfully'});
        }
        catch(error) {
            res.status(500).json({message: 'Error while deleting the user', error : error.stack});
        }
    }
}

module.exports = userController;
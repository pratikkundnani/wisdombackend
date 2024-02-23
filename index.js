const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes');
const cors = require('cors');

const app = express();

// Enable CORS for all requests
app.use(cors());

// Middleware
app.use(bodyParser.json());

require('dotenv').config()
// console.log(process.env) 

// Connect to MongoDB
mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(error => console.error('MongoDB connection error:', error));

// Routes
app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.use('/api/blogs', routes.blogRouter);
app.use('/api/user', routes.userRouter);
app.use('/api/comment', routes.commentRouter);


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

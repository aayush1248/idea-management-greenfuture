const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const IdeaConfirm = require('./server/schema'); // Adjust the path if needed
const Idea = require('./server/schema');// Import the Idea model
 //const admin = require('firebase-admin');
//const { Firestore } = require('@google-cloud/firestore');
const Notification = require('./server/schema')

//const firestore = new Firestore();


const cors = require('cors');  // Optional, for handling CORS

const app = express();
app.use(bodyParser.json())
app.use(cors())

mongoose.connect("mongodb://127.0.0.1:27017/reactProjectDB",
    { useNewUrlParser: true, useUnifiedTopology: true }
    
)
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Failed to connect to MongoDB', err));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'employee' },
  voted: { type: Boolean, required: true }
});

UserSchema.methods.comparePassword = async function (password) {
    try {
      return await bcrypt.compare(password, this.password); // Compare the entered password with the hashed password
    } catch (error) {
      throw new Error('Error comparing passwords');
    }
  };



const User = mongoose.model('User', UserSchema);


//const serviceAccount = require('./firebase.json'); // Replace with your service account file







app.post('/ideas', async (req, res) => {
  const { idea, email, ideaConfirmStatus } = req.body;

  // Input validation
  if (!idea || !email) {
    return res.status(400).json({ message: 'Idea and submittedBy are required.' });
  }
 
  const existingIdea = await Idea.findOne({ email });
  if (existingIdea) {
    console.log('Email already in use:', email);
    return res.status(400).json({ message: 'Email is already in use.' });
  }

  try {
    const newIdea = new Idea({ idea, email, ideaConfirmStatus });
    await newIdea.save();
    res.status(201).json({
      message: 'Idea submitted successfully!',
      idea: newIdea,
    });
  } catch (error) {
    console.error('Error submitting idea:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});




app.post('/notifications', async (req, res) => {
  console.log('Request received:', req.body);

  const { email, message } = req.body;
  if (!email || !message) {
    console.log('Validation error: Missing email or message');
    return res.status(400).json({ error: 'Email and message are required' });
  }

  try {
    const notification = new Notification({ email, message });
    const savedNotification = await notification.save();
    console.log('Notification saved:', savedNotification);
    res.status(201).json({ message: 'Notification created', notification: savedNotification });
  } catch (error) {
    console.error('Error saving notification:', error);
    res.status(500).json({ error: 'Failed to create notification' });
  }
});


app.get('/notifications/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const notifications = await Notification.find({ email });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});


  app.get('/ideas', async (req, res) => {
    try {
      const ideas = await Idea.find().sort({ createdAt: -1 }); // Fetch ideas, sorted by most recent
      res.status(200).json(ideas);
    } catch (error) {
      console.error('Error fetching ideas:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

   
  app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log('Incoming request:', req.body); // Log the incoming request

    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.error('User not found');
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.error('Password mismatch');
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: user._id, role: user.role }, 'your_jwt_secret_key', { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token, role: user.role });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


const protect = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret_key');
    req.user = decoded; // Attach user data to request
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

app.get('/dashboard', protect, (req, res) => {
    res.status(200).json({ message: 'Welcome to the dashboard!', user: req.user });
  });
  
app.post('/register', async (req, res) => {
    const { name, email, password, role, voted } = req.body;
  
    // Input validation
    if (!name || !email || !password) {
      console.log('Validation failed. Missing fields.');
      return res.status(400).json({ message: 'All fields are required.' });
    }
  
    try {
      // Check if the email already exists in the database
      const hashedPassword = await bcrypt.hash(password, 10);

      const existingUser = await User.
      findOne({ email });
      if (existingUser) {
        console.log('Email already in use:', email);
        return res.status(400).json({ message: 'Email is already in use.' });
      }
      // Create new user
      const user = new User({ name, email, password: hashedPassword, role, voted });
      await user.save();
      console.log('User registered successfully:', user);
      res.status(201).json({ message: 'User registered successfully!' });
      console.log(res.status)
    } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
  
app.get('/confirmidea', async (req, res) => {
    try {
      const ideas = await IdeaConfirm.find();
      res.status(200).json(ideas);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching ideas', error });
    }
  });

  app.post('/confirmidea', async (req, res) => {
    const { idea, email } = req.body;
  
    if (!idea || !email) {
      return res.status(400).json({ message: 'Idea and Submitted By are required' });
    }
  
    console.log('Incoming request data:', req.body);
  
    const message = {
      notification: {
        title: 'Idea Approved',
        body: `Your idea titled "${idea.ideaTitle}" has been approved.`,
      },
      token: email,
    };
    try {
      const newIdea = new IdeaConfirm({ idea, email });
      await newIdea.save();
      res.status(201).json(newIdea);
    } catch (error) {
      console.error('Error saving idea:', error); // Log detailed error
      res.status(500).json({ message: 'Error adding idea', error });
    }
  });

  app.patch('/register', async (req, res) => {
    const { id } = req.params;  // Get the _id of the idea
    const { voted } = req.body;  // Get the ideaConfirmStatus from the request body
  
    // Validate the input
    if (typeof voted !== 'boolean') {
      return res.status(400).json({ message: 'Invalid vote. It should be a boolean.' });
    }
  
    try {
      // Find and update the idea with the new ideaConfirmStatus
      const updatedVote = await User.findByIdAndUpdate(
        id,
        { voted },  // Update ideaConfirmStatus to the new value
        { new: true }           // Return the updated document
      );
  
      if (!updatedVote) {
        return res.status(404).json({ message: 'Idea not found.' });
      }

      await updatedVote.save();
      res.status(200).json({ message: 'Idea status updated', idea: updatedIdea });
    } catch (error) {
      console.error('Error updating idea:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }); 
  
  app.patch('/ideas/:id', async (req, res) => {
    const { id } = req.params;  // Get the _id of the idea
    const { ideaConfirmStatus } = req.body;  // Get the ideaConfirmStatus from the request body
  
    // Validate the input
    if (typeof ideaConfirmStatus !== 'boolean') {
      return res.status(400).json({ message: 'Invalid ideaConfirmStatus. It should be a boolean.' });
    }
  
    try {
      // Find and update the idea with the new ideaConfirmStatus
      const updatedIdea = await Idea.findByIdAndUpdate(
        id,
        { ideaConfirmStatus },  // Update ideaConfirmStatus to the new value
        { new: true }           // Return the updated document
      );
  
      if (!updatedIdea) {
        return res.status(404).json({ message: 'Idea not found.' });
      }

      await updatedIdea.save();
      res.status(200).json({ message: 'Idea status updated', idea: updatedIdea });
    } catch (error) {
      console.error('Error updating idea:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
  
  app.patch('/confirmidea/:id', async (req, res) => {
    const { id } = req.params;
    const { voteIncrement } = req.body; // Allows flexibility for additional fields in the future
  
    console.log('vote increment', voteIncrement);
    if (!voteIncrement || typeof voteIncrement !== 'number') {
      return res.status(400).json({ message: 'Invalid vote increment value' });
    }
  
    try {
      // Find the idea by ID and update the vote count
      const updatedIdea = await IdeaConfirm.findByIdAndUpdate(
        id,
        { $inc: { vote: voteIncrement } }, // Increment the vote field
        { new: true } // Return the updated document
      );
  
      if (!updatedIdea) {
        return res.status(404).json({ message: 'Idea not found' });
      }
  
      res.status(200).json(updatedIdea); // Send the updated idea back
    } catch (error) {
      console.error('Error updating idea:', error);
      res.status(500).json({ message: 'Error updating idea', error });
    }
  });
  

  app.delete('/ideas/:id', async (req, res) => {
    const { id } = req.params;
  
    if (!id) {
      return res.status(400).json({ message: 'Idea ID is required.' });
    }
  

    try {
      const idea = await Idea.findByIdAndDelete(id);
  
      if (!idea) {
        return res.status(404).json({ message: 'Idea not found' });
      }
       // idea.confirmed = true;  // Example of confirming an idea
    await idea.save();
  
      res.status(200).json({ message: 'Idea deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting idea', error });
    }
  });
  


app.listen(3001, () =>{
    console.log('server is running')
})



const express = require('express');
const cors = require('cors');
const app = express();

// Initialize with empty users array
// Note: In serverless environments, we can't rely on file persistence
// You'll need to use a database service instead
let users = [];

app.use(express.json());
app.use(cors());

// API Routes
app.get('/api/users', async (req, res) => {
  res.json(users);
});

app.post('/api/users', (req, res) => {
  const { name, age } = req.body;
  const newid = users.length > 0 ? users[users.length - 1].id + 1 : 1;
  const newuser = { id: newid, name, age };
  users.push(newuser);
  res.status(200).json({ message: 'user register success', data: newuser });
});

app.put('/api/users/:id', (req, res) => {
  const uid = req.params.id;
  const { name, age } = req.body;
  const userIndex = users.findIndex(user => user.id == uid);
  
  if (!name || !age) {
    res.status(400).json({ message: 'name and age are required' });
    return;
  }
  
  if (userIndex == -1) {
    res.status(404).json({ message: 'user not found' });
  } else {
    users[userIndex].name = name;
    users[userIndex].age = age;
    res.status(200).json({ message: 'user updated successfully', data: users[userIndex] });
  }
});

app.delete('/api/users/:id', (req, res) => {
  const uid = req.params.id;
  const userIndex = users.findIndex(user => user.id == uid);
  
  if (userIndex == -1) {
    res.status(404).json({ message: 'user not found' });
  } else {
    const deletedUser = users[userIndex];
    users.splice(userIndex, 1);
    res.status(200).json({ message: 'user deleted successfully', data: deletedUser });
  }
});

// Export serverless handler
module.exports = app;
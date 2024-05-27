const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(bodyParser.json());

const USERS_FILE = './users.json';

function readUsersFromFile() {
  const data = fs.readFileSync(USERS_FILE, 'utf8');
  return JSON.parse(data);
}

function writeUsersToFile(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

app.get('/users', (req, res) => {
  const users = readUsersFromFile();
  res.json(users);
});

app.get('/users/:id', (req, res) => {
  const users = readUsersFromFile();
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (user) {
    res.json(user);
  } else {
    res.status(404).send('User not found');
  }
});

app.post('/users', (req, res) => {
  const users = readUsersFromFile();
  const newUser = req.body;
  newUser.id = users.length ? users[users.length - 1].id + 1 : 1;
  users.push(newUser);
  writeUsersToFile(users);
  res.status(201).json(newUser);
});

app.put('/users/:id', (req, res) => {
  const users = readUsersFromFile();
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index !== -1) {
    users[index] = { ...users[index], ...req.body };
    writeUsersToFile(users);
    res.json(users[index]);
  } else {
    res.status(404).send('User not found');
  }
});

app.delete('/users/:id', (req, res) => {
  const users = readUsersFromFile();
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index !== -1) {
    const deletedUser = users.splice(index, 1);
    writeUsersToFile(users);
    res.json(deletedUser);
  } else {
    res.status(404).send('User not found');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

const express = require('express');
const app = express();

const verifyPassword = (req, res, next) => {
  const password = req.query.password;
  if (password === 'hello') {
    next();
  } else {
    throw new Error('Password Required!!');
  }
};

app.get('/', (req, res) => {
  res.send('Home page');
});
app.get('/secret', verifyPassword, (req, res) => {
  res.send('This is secret page');
});

app.listen(3000, () => {
  console.log('listening to port 3000');
});

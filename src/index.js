require('dotenv').config();
const express = require('express');

const port = process.env.PORT;
const app = require('./app.js');
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})
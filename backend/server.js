const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
const bookRouter = require('./routes/books')

app.use(cors());
app.use(express.json());

app.use('/api', bookRouter)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

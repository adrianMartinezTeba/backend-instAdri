const express = require("express");
const app = express();
const cors = require("cors");
const path = require('path');
require("dotenv").config(); // Para poder usar dotenv
const PORT = process.env.PORT || 3001;

const { dbConnection } = require("./config/config");

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
dbConnection();

app.use("/users", require("./routes/users"));
app.use("/posts", require("./routes/posts"));
app.use("/messages", require("./routes/messages"));

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(PORT, () => console.log(`Server started at port ${PORT}`));

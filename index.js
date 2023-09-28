const express = require("express");
const cors = require("cors");
const userRoutes = require("./Routes/userRoutes");
const bookRoutes = require("./Routes/bookRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use(express.static("public"));

app.use("/api/user", userRoutes);
app.use("/api/book", bookRoutes);

app.get("/", (req, res) => {
  res.send("hello");
});

app.listen(PORT, () => {
  console.log(`server is running at port ${PORT}`);
});

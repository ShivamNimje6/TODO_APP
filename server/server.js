// const express = require("express");
// const connectMongoDB = require("./config/db");

// const todo = require("./models/todo");
// require("dotenv").config();

// const app = express();

// app.use(express.json());

// //connect db
// connectMongoDB();

// const PORT = process.env.PORT || 8002;

// app.get("/api/todo", async (req, res) => {
//   try {
//     const allTodos = await todo.find();
//     return res.status(200).send(allTodos);
//   } catch (error) {
//     console.log(`Error: ${error.message}`);
//     return res.status(400).send({ message: "Error fetching todos" });
//   }
// });

// app.post("/api/todo", async (req, res) => {
//   try {
//     if (!req.body.name) {
//       return res.status(400).send({ message: "Name is required" });
//     }
//     const newTodo = await todo.create(req.body);
//     return res.status(201).send(newTodo); // removed braces from { newTodo }
//   } catch (error) {
//     console.log(`Error: ${error.message}`);
//     return res.status(400).send({ message: "Error creating a new todo" });
//   }
// });

// app.patch("/api/todo/:id", async (req, res) => {
//   try {
//     const updatedTodo = await todo.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });
//     return res.status(200).send(updatedTodo); // removed braces from { updatedTodo }
//   } catch (error) {
//     console.log(`Error: ${error.message}`);
//     return res.status(400).send({ message: "Error updating todo" });
//   }
// });

// app.delete("/api/todo/:id", async (req, res) => {
//   try {
//     const deletedTodo = await todo.findByIdAndDelete(req.params.id);
//     return res.status(200).send(deletedTodo); // removed braces from { deletedTodo }
//   } catch (error) {
//     console.log(`Error: ${error.message}`);
//     return res.status(400).send({ message: "Error deleting todo" });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

const express = require("express");
const connectMongoDB = require("./config/db");
const cors = require("cors");
const todoRoutes = require("./routes/todo");
require("dotenv").config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 8002;

//Establish DB connection
connectMongoDB();

//Cors
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

//Routes
app.use("/api/todo", todoRoutes);

app.listen(PORT, () => {
  console.log(`Todo app server is listening on port ${PORT}`);
});

// const express = require("express");
// const connectMongoDB = require("./config/db");

// const todo = require("./models/todo");
// require("dotenv").config();

// const app = express();

// app.use(express.json());

// //connect db
// connectMongoDB();

// const PORT = process.env.PORT || 8002;

//
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

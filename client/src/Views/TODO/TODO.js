import { useEffect, useState } from "react";
import Styles from "./TODO.module.css";
import axios from "axios";

export function TODO(props) {
  const [newTodo, setNewTodo] = useState(""); // State for new todo input
  const [todoData, setTodoData] = useState([]); // State to hold todo list
  const [loading, setLoading] = useState(true); // State to track loading state
  const [editMode, setEditMode] = useState(null); // State to track edit mode
  const [editedTodoTitle, setEditedTodoTitle] = useState(""); // State to hold edited todo title

  useEffect(() => {
    fetchTodo();
  }, []);

  // Fetch todos from API
  const fetchTodo = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/todo");
      setTodoData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  // Add a new todo
  const addTodo = () => {
    const options = {
      method: "POST",
      url: "http://localhost:8000/api/todo",
      headers: {
        accept: "application/json",
      },
      data: {
        title: newTodo,
      },
    };
    axios
      .request(options)
      .then(function (response) {
        console.log("New todo added:", response.data);
        setTodoData((prevData) => [...prevData, response.data]);
        setNewTodo("");
      })
      .catch((err) => {
        console.error("Error adding todo:", err);
      });
  };

  // Delete a todo
  const deleteTodo = (id) => {
    const options = {
      method: "DELETE",
      url: `http://localhost:8000/api/todo/${id}`,
      headers: {
        accept: "application/json",
      },
    };
    axios
      .request(options)
      .then(function () {
        console.log("Todo deleted:", id);
        setTodoData((prevData) => prevData.filter((todo) => todo._id !== id));
      })
      .catch((err) => {
        console.error("Error deleting todo:", err);
      });
  };

  // Update todo status (mark as done/undone)
  const updateTodoStatus = (id, done) => {
    const options = {
      method: "PATCH",
      url: `http://localhost:8000/api/todo/${id}`,
      headers: {
        accept: "application/json",
      },
      data: {
        done: !done,
      },
    };
    axios
      .request(options)
      .then(function (response) {
        console.log("Todo status updated:", response.data);
        setTodoData((prevData) =>
          prevData.map((todo) => (todo._id === id ? response.data : todo))
        );
      })
      .catch((err) => {
        console.error("Error updating todo status:", err);
      });
  };

  // Toggle edit mode for a todo
  const toggleEditMode = (id, currentTitle) => {
    setEditMode(id); // Set edit mode for the current todo
    setEditedTodoTitle(currentTitle); // Set initial value of edited todo title
  };

  // Save edited todo
  const saveEditedTodo = async (id) => {
    try {
      const options = {
        method: "PATCH",
        url: `http://localhost:8000/api/todo/${id}`,
        headers: {
          accept: "application/json",
        },
        data: {
          title: editedTodoTitle,
        },
      };
      const response = await axios.request(options);
      console.log("Todo updated:", response.data);
      setTodoData((prevData) =>
        prevData.map((todo) => (todo._id === id ? response.data : todo))
      );
      setEditMode(null); // Exit edit mode after saving
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  return (
    <div className={Styles.ancestorContainer}>
      <div className={Styles.headerContainer}>
        <h1>Tasks</h1>
        <span>
          <input
            className={Styles.todoInput}
            type="text"
            name="New Todo"
            value={newTodo}
            onChange={(event) => {
              setNewTodo(event.target.value);
            }}
          />
          <button
            id="addButton"
            name="add"
            className={Styles.addButton}
            onClick={addTodo}
          >
            + New Todo
          </button>
        </span>
      </div>
      <div id="todoContainer" className={Styles.todoContainer}>
        {loading ? (
          <p style={{ color: "white" }}>Loading...</p>
        ) : todoData.length > 0 ? (
          todoData.map((entry) => (
            <div key={entry._id} className={Styles.todo}>
              {editMode === entry._id ? (
                // Render input field for editing
                <span className={Styles.editContainer}>
                  <input
                    type="text"
                    className={Styles.editInput} // Add a specific class for styling the input field
                    value={editedTodoTitle}
                    onChange={(e) => setEditedTodoTitle(e.target.value)}
                  />
                  <button onClick={() => saveEditedTodo(entry._id)}>
                    Save
                  </button>
                </span>
              ) : (
                // Render todo item
                <span className={Styles.infoContainer}>
                  <input
                    type="checkbox"
                    checked={entry.done}
                    onChange={() => updateTodoStatus(entry._id, entry.done)}
                  />
                  {entry.title}
                  <button
                    onClick={() => toggleEditMode(entry._id, entry.title)}
                  >
                    Edit
                  </button>
                </span>
              )}
              <span
                style={{ cursor: "pointer" }}
                onClick={() => {
                  deleteTodo(entry._id);
                }}
              >
                Delete
              </span>
            </div>
          ))
        ) : (
          <p className={Styles.noTodoMessage}>
            No tasks available. Please add a new task.
          </p>
        )}
      </div>
    </div>
  );
}

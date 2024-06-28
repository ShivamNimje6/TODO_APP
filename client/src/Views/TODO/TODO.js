import { useEffect, useState } from "react";
import Styles from "./TODO.module.css";
import axios from "axios";

export function TODO(props) {
  const [newTodo, setNewTodo] = useState("");
  const [newDescription, setNewDescription] = useState(""); // State for new description input
  const [todoData, setTodoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(null);
  const [editField, setEditField] = useState(null); // Track which field is being edited
  const [editedTodoTitle, setEditedTodoTitle] = useState("");
  const [editedTodoDescription, setEditedTodoDescription] = useState(""); // State to hold edited todo description

  useEffect(() => {
    fetchTodo();
  }, []);

  const fetchTodo = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/todo");
      setTodoData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const addTodo = () => {
    const options = {
      method: "POST",
      url: "http://localhost:8000/api/todo",
      headers: {
        accept: "application/json",
      },
      data: {
        title: newTodo,
        description: newDescription, // Include description in the new todo
      },
    };
    axios
      .request(options)
      .then(function (response) {
        console.log("New todo added:", response.data);
        setTodoData((prevData) => [...prevData, response.data]);
        setNewTodo("");
        setNewDescription(""); // Clear description input after adding
      })
      .catch((err) => {
        console.error("Error adding todo:", err);
      });
  };

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

  const toggleEditMode = (id, field, currentValue) => {
    setEditMode(id);
    setEditField(field);
    if (field === "title") {
      setEditedTodoTitle(currentValue);
    } else if (field === "description") {
      setEditedTodoDescription(currentValue);
    }
  };

  const saveEditedTodo = async (id) => {
    try {
      const options = {
        method: "PATCH",
        url: `http://localhost:8000/api/todo/${id}`,
        headers: {
          accept: "application/json",
        },
        data: {
          title: editField === "title" ? editedTodoTitle : undefined,
          description:
            editField === "description" ? editedTodoDescription : undefined,
        },
      };
      const response = await axios.request(options);
      console.log("Todo updated:", response.data);
      setTodoData((prevData) =>
        prevData.map((todo) => (todo._id === id ? response.data : todo))
      );
      setEditMode(null);
      setEditField(null);
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
            placeholder="Title"
          />
          <input
            className={Styles.todoInput}
            type="text"
            name="New Description"
            value={newDescription}
            onChange={(event) => {
              setNewDescription(event.target.value);
            }}
            placeholder="Description"
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
              {editMode === entry._id && editField === "title" ? (
                <span className={Styles.editContainer}>
                  <input
                    type="text"
                    className={Styles.editInput}
                    value={editedTodoTitle}
                    onChange={(e) => setEditedTodoTitle(e.target.value)}
                    placeholder="Title"
                  />
                  <button onClick={() => saveEditedTodo(entry._id)}>
                    Save
                  </button>
                </span>
              ) : editMode === entry._id && editField === "description" ? (
                <span className={Styles.editContainer}>
                  <input
                    type="text"
                    className={Styles.editInput}
                    value={editedTodoDescription}
                    onChange={(e) => setEditedTodoDescription(e.target.value)}
                    placeholder="Description"
                  />
                  <button onClick={() => saveEditedTodo(entry._id)}>
                    Save
                  </button>
                </span>
              ) : (
                <span className={Styles.infoContainer}>
                  <input
                    type="checkbox"
                    checked={entry.done}
                    onChange={() => updateTodoStatus(entry._id, entry.done)}
                  />
                  <div>
                    <span className={Styles.title}>{entry.title}</span>
                    <span className={Styles.description}>
                      {entry.description}
                    </span>
                  </div>
                  <div className={Styles.buttonsContainer}>
                    <button
                      onClick={() =>
                        toggleEditMode(entry._id, "title", entry.title)
                      }
                    >
                      Edit Title
                    </button>
                    <button
                      onClick={() =>
                        toggleEditMode(
                          entry._id,
                          "description",
                          entry.description
                        )
                      }
                    >
                      Edit Description
                    </button>
                    <button
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        deleteTodo(entry._id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </span>
              )}
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

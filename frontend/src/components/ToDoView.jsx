import React, { useState, useEffect } from "react";
import AddTodoComponent from "./AddTodoComponent";

function ToDoView() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch("http://localhost:5000/todos");
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const handleAddTodo = async (newTodo) => {
    setTodos([...todos, newTodo]);
  };

  const handleStatusChange = async (todoId, newStatus) => {
    try {
      await fetch(`http://localhost:5000/todos/${todoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const updatedTodos = todos.map((todo) =>
        todo._id === todoId ? { ...todo, status: newStatus } : todo
      );
      setTodos(updatedTodos);
      console.log(`Todo with ID ${todoId} status changed to ${newStatus}`);
    } catch (error) {
      console.error(`Error changing todo status:`, error);
    }
  };

  const handleDeleteTodo = async (todoId) => {
    try {
      await fetch(`http://localhost:5000/todos/${todoId}`, {
        method: "DELETE",
      });
      const updatedTodos = todos.filter((todo) => todo._id !== todoId);
      setTodos(updatedTodos);
      console.log(`Todo with ID ${todoId} deleted successfully`);
    } catch (error) {
      console.error(`Error deleting todo with ID ${todoId}:`, error);
    }
  };

  const renderStatusStyle = (status) => {
    return {
      flexBasis: "33%",
      backgroundColor: status === "done" ? "green" : "red",
      textAlign: "right",
      padding: "5px",
      borderTopRightRadius: "5px",
      borderBottomRightRadius: "5px",
      textAlign: "center",
      cursor: "pointer",
    };
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {todos
          .filter((todo) => todo.status === "not done")
          .map((todo) => (
            <div
              key={todo._id}
              style={{
                borderRadius: "5px",
                width: "50%",
                border: "1px solid black",
                margin: "10px",
                display: "flex",
              }}
            >
              <div style={{ flex: "1", padding: "5px" }}>{todo.text}</div>
              <div
                style={renderStatusStyle(todo.status)}
                onClick={() =>
                  handleStatusChange(
                    todo._id,
                    todo.status === "done" ? "not done" : "done"
                  )
                }
              >
                {todo.status}
              </div>
              <span
                role="img"
                aria-label="delete"
                style={{ cursor: "pointer" }}
                onClick={() => handleDeleteTodo(todo._id)}
              >
                🗑️
              </span>
            </div>
          ))}
      </div>
      <AddTodoComponent onAddTodo={handleAddTodo} />
    </>
  );
}

export default ToDoView;


import React, { useState, useEffect } from "react";
import AddTodoComponent from "./AddTodoComponent";

function ToDoView() {
  const [todos, setTodos] = useState([]);
  const [showAllTodos, setShowAllTodos] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const toggleShowAll = () => {
    setShowAllTodos(!showAllTodos);
  };

  const fetchTodos = async () => {
    try {
      const response = await fetch("http://backend.local/todos"); 
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
      await fetch(`http://backend.local/todos/${todoId}`, {
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
      await fetch(`http://backend.local/todos/${todoId}`, {
        method: "DELETE",
      });
      const updatedTodos = todos.filter((todo) => todo._id !== todoId);
      setTodos(updatedTodos);
      console.log(`Todo with ID ${todoId} deleted successfully`);
    } catch (error) {
      console.error(`Error deleting todo with ID ${todoId}:`, error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "50%",
          padding: "10px",
          borderRadius: "5px",
          backgroundColor: "white",
          overflowY: "auto",
          height: "60vh",
          border: "1px solid black",
        }}
      >
        {todos
          .filter((todo) => showAllTodos || todo.status === "not done")
          .map((todo) => (
            <div
              key={todo._id}
              style={{
                border: "1px solid black",
                margin: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "5px",
                borderRadius: "5px",
              }}
            >
              <div style={{ flex: "1" }}>{todo.text}</div>
              <div
                style={{
                  flexBasis: "25%",
                  textAlign: "right",
                  padding: "5px",
                  paddingLeft: "10px",
                  textAlign: "right",
                  cursor: "pointer",
                  backgroundColor: "lightgrey",
                  borderRadius: "5px",
                  padding: "5px",
                  cursor: "pointer",
                }}
                onMouseOver={(e) => (e.target.textContent = "Complete ?")}
                onMouseOut={(e) =>
                  (e.target.textContent = todo.status === "done" ? "✅" : "❌")
                }
                onClick={() =>
                  handleStatusChange(
                    todo._id,
                    todo.status === "done" ? "not done" : "done"
                  )
                }
              >
                {todo.status === "done" ? "✅" : "❌"}
              </div>
              <span
                role="img"
                aria-label="delete"
                style={{
                  cursor: "pointer",
                  padding: "5px",
                  marginLeft: "10px",
                  borderRadius: "5px",
                }}
                title="Delete ?"
                onClick={() => handleDeleteTodo(todo._id)}
              >
                🗑️
              </span>
            </div>
          ))}
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <button
          onClick={toggleShowAll}
          style={{
            borderStyle: "outset",
            backgroundColor: "#f7ed2a",
            width: "125px",
            borderRadius: "5px",
            marginRight: "10px",
            border: "2px solid black",
            padding: "5px",
            marginTop: "15px",
          }}
        >
          {showAllTodos ? "Show not done" : "Show all"}
        </button>
        <AddTodoComponent onAddTodo={handleAddTodo} />
      </div>
    </div>
  );
}

export default ToDoView;

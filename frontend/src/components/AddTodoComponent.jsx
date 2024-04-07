import React, { useState } from "react";

function AddTodoComponent({ onAddTodo }) {
  const [text, setText] = useState("");
  const [status, setStatus] = useState("not done");

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    if (text != "") {
      let result = await fetch("http://localhost:5000/addTodo", {
        method: "post",
        body: JSON.stringify({ text, status }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      result = await result.json();
      console.warn(result);
      if (result) {
        console.log("Data saved successfully");
        setText("");
        setStatus("not done");
        if (typeof onAddTodo === "function") {
          onAddTodo(result);
        }
      }
    }
  };

  return (
    <form style={{ display: "flex", justifyContent: "center" }}>
      <input
        type="text"
        placeholder="Todo text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ borderRadius: "5px", marginRight: "10px" }}
      />
      <button
        type="submit"
        onClick={handleOnSubmit}
        style={{ borderRadius: "5px" }}
      >
        Submit
      </button>
    </form>
  );
}

export default AddTodoComponent;

import React, { useEffect, useState } from "react";
import BASE_URL from "../config.js";

function TestConnection() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    fetch(BASE_URL + "")
      .then((res) => {
        if (!res.ok) throw new Error("Network response not ok");
        return res.json();
      })
      .then((data) => setMessage(data.message))
      .catch((error) => setMessage("Error: " + error.message));
  }, []);

  return <div>{message}</div>;
}

export default TestConnection;

import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import ThreeJSInstancingExample from "./Three";


function StartPage() {
  const history = useHistory();

  const [errorMessage, setErrorMessage] = useState("");

  async function loginUser(event) {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        // Handle successful response
        console.log(data);
      } else {
        // Handle error response
        setErrorMessage("Please check your username and password");
      }
    } catch (err) {
      console.error("Error", err);
      setErrorMessage("An error occurred");
    }
  }

  return (
    <div className="auth-container">
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <ThreeJSInstancingExample/>
    </div>
  );
}

export default StartPage;

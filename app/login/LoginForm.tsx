"use client";

import { useState } from "react";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 呼叫 Next.js API Route
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message); // 顯示成功訊息
      } else {
        setMessage(data.error); // 顯示錯誤訊息
      }
    } catch {
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        width: "300px",
        border: "1px solid #ccc",
        padding: "20px",
        borderRadius: "8px",
      }}
    >
      <h3>Login</h3>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        style={{ padding: "10px", fontSize: "16px" }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={{ padding: "10px", fontSize: "16px" }}
      />
      <button type="submit" style={{ padding: "10px", fontSize: "16px" }}>
        Login
      </button>
      {message && <p style={{ color: "red" }}>{message}</p>}
    </form>
  );
}

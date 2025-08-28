import { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLoginButton = () => {
    setError("");
    console.log(email,password);
    
    if (email === "admin@admin.com" && password === "admin") {
      navigate("/dashboard");
    } else {
      setError("Invalid Credentials");
    }
  };
  return (
    <div className="register-page">
      <div className="register-container">
        <div>
          <h1>Sign In</h1>
          <p>Welcome Back!</p>
        </div>

        <div className="register-form">
          <>
            <div className="single-input-div">
              <label htmlFor="inputEmail">Email</label>
              <input
                required
                id="inputEmail"
                type="email"
                className="form-control"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>
            <div className="single-input-div">
              <label htmlFor="inputPassword">Password</label>
              <input
                required
                id="inputPassword"
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </>
          <button
            disabled={email === "" || password === ""}
            className="w-100"
            onClick={handleLoginButton}
          >
            Sign In
          </button>
        </div>
        <div>
          <p>
            Do not have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

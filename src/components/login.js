import React, { useState, useEffect } from "react";
import {
    signInWithEmailAndPassword,
    onAuthStateChanged
} from "firebase/auth";
import { auth } from "../firebase.js";
import { useNavigate } from "react-router-dom";

import './login.css';

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                navigate("/homepage");
            }
        });
    }, []);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSignIn = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                navigate("/homepage");
            })
            .catch((err) => alert(err.message));
    };

    return (
        <div className="Auth-form-container">
            <h1 className="App-form-text">Welcome!</h1>
            <div className="Auth-form">
                <div className="Auth-form-content">
                    <div className="form-group mt-3">
                        <label className="Auth-label">Email address</label>
                        <input
                            type="email"
                            className="form-control mt-1"
                            placeholder="Enter email"
                            onChange={handleEmailChange}
                            value={email}
                        />
                    </div>
                    <div className="form-group mt-3">
                        <label className="Auth-label">Password</label>
                        <input
                            type="password"
                            className="form-control mt-1"
                            placeholder="Enter password"
                            onChange={handlePasswordChange}
                            value={password}
                        />
                    </div>
                    <div className="d-grid gap-2 mt-3">
                        <button type="submit" className="w-100 mt-3 gradient-button" onClick={handleSignIn}>
                            Submit
                        </button>
                    </div>
                    <p className="forgot-password text-right mt-2">                        
                    </p>
                </div>
            </div>
        </div>
    )
}



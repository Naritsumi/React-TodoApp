import React, { useState, useEffect } from "react";
import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
    createUserWithEmailAndPassword
} from "firebase/auth";
import { auth } from "../firebase.js";
import { useNavigate } from "react-router-dom";

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
        <div className="login">
            <h1>Todo List</h1>
            <div className="login-container">
                <input type="email"
                    onChange={handleEmailChange}
                    value={email}
                />
                <input type="password"
                    onChange={handlePasswordChange}
                    value={password}
                />
                <button onClick={handleSignIn}>Sign in</button>
            </div>
        </div>
    )
}


import React, {useState} from 'react';
import Header from '../components/Header';
import {Link} from 'react-router-dom';
import configureStore from '../store/configureStore';
import {fetchTeams} from "../actions/teams";
import axios from 'axios';
import {mongourl} from "../config/config";
import Footer from '../components/Footer';

const Login = (props) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const loginForm = async(event) => {
        event.preventDefault(); 
        if(email.length==0 || password.length ==0) {
            setError("Please fill all the details");
            return;
        }
        const data = {"email": email, "password": password};  
        try {
            const response = await axios.post(`${mongourl}/users/login`, data);
            console.log(response);
            if(response && response.data) {
                if(response.data.autherror) {
                    setError(response.data.autherror);
                    return;
                }

                if(response.data.user) {
                    const date = new Date();
                    const _id = response.data.user._id;
                    date.setTime(date.getTime() + (100*24*60*60*1000));
                    document.cookie = `_id=${response.data.user._id};expires=${date}`;
                }
                if(response.data.token) {
                    const date = new Date();
                    date.setTime(date.getTime() + (100*24*60*60*1000));
                    document.cookie = `token=${response.data.token};expires=${date}`;
                    const store = configureStore();
                    store.dispatch(fetchTeams);
                    props.history.push("");
                }
            }
            console.log(response);
        } catch(ex) {
            console.log(ex);
        } 
    }

    const handleEmail = (e) => {
        setEmail(e.target.value);
    }

    const handlePassword = (e) => {
        setPassword(e.target.value);
    }

    return (
        <React.Fragment >
            <Header/>
            

            <form className="login-form">
            <h2>Login</h2>
                <input className="form-input" type="text" placeholder="Email" onChange={handleEmail}/>
                <input className="form-input" type="password" placeholder="password" onChange={handlePassword}/>
                <button className="form-submit" type="submit" onClick={loginForm}>Proceed</button>
            </form>
            <p className="error-message">{error}</p>
            <Link to={`../signup`} className="link">Register</Link>
            
        
        </React.Fragment>
    )
}

export default Login;
import React, {Fragment} from 'react';
import Header from "./Header";
import Footer from "./Footer";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';


const More = (props) => {
    const logout = () =>{
        document.cookie = `token=;Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
        document.cookie = `_id=;Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
        props.history.push("");
    }
    return (<Fragment>
    <Header/>

        <button className="joinButton-logout" onClick={logout}><ExitToAppIcon fontSize="large"/>Logout</button>
    <Footer/>
    </Fragment>)
};

export default More;
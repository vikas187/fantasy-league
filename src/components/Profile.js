import  React, {Fragment, useState, useEffect} from 'react';
import {Link} from "react-router-dom";
import Footer from './Footer';
import Header from './Header';
import sample from '../img/cropped.jpg';
import axios from "axios";
import {mongourl} from "../config/config";
import {axiosAuth} from '../utils/utils';

const Profile = (props) => {
    const [error, changeError] = useState("");
    const [details, changeDetails] = useState({email: "", firstname: "", lastname: ""});
    const [successMessage, changeMessage] = useState("");
    const [image, setImage] = useState(null);
    const [currImage, setCurrImage] = useState(null);

    //conmponentDidMount
    useEffect(()=>{

        (async()=>{ //remember to always call async/await as an IIFE inside Useffect else it wont work.
            const response = await axiosAuth(`${mongourl}/users/me`);
            console.log(response);
            if(response.error) {
                console.log(response.error);
            } else {
                changeDetails({...response.data});
                const imageResponse = await axiosAuth(`${mongourl}/users/me/avatar`);
                console.log("imageresponse:" + JSON.stringify(imageResponse));
                if(imageResponse && imageResponse.data && imageResponse.data.error) {
                    console.log(imageResponse.data.error);
                    setCurrImage("../img/cropped.jpg");
                } else if(imageResponse && imageResponse.data) {
                    setCurrImage("data:image/jpeg;base64," + imageResponse.data); 
                }
            }
        })();
        
    }, []);

    const updateDetails = async(event) => {
        event.preventDefault();
        try {
            if(!document.cookie) {
                window.location.href = "../login";
            } 
            const index = document.cookie.indexOf("token=");
            if(index!=-1) {
                const token = document.cookie.substring(index+6);
                console.log(token);
                var config = {
                    method: 'patch',
                    url: `${mongourl}/users/me`,
                    headers: { 
                      'Authorization': `Bearer ${token}`
                    },
                    data : {"firstname": event.target.firstname.value, "lastname": event.target.lastname.value}
                  };
                const response = await axios(config);
                if(response.status===200) {
                    console.log(response);
                    var formData = new FormData();
                    formData.append("upload", image);
                    debugger;
                    if(response.data.authError) {
                        window.location.href = "../login";
                    }
                    if(image) {
                        config = {
                            method: 'post',
                            url: `${mongourl}/users/me/avatar`,
                            headers: { 
                              'Authorization': `Bearer ${token}`,
                              "Content-Type": "multipart/form-data"
                            },
                            data: formData
                          };
                        const imageResponse = await axios(config);
                    }
 
                    changeMessage("Profile has been updated successfully");
                }
            }
        } catch(ex) {
            console.log(ex.message);
        }
        
    }

    const uploadPhoto = (event)=> {
        setImage(event.target.files[0]);
        setCurrImage(URL.createObjectURL(event.target.files[0]));
    }

    const triggerImageUpload = (event)=> {
        document.getElementById("image").click();
    }
    return <Fragment>
        <Header/>
        
            <form className="profile-form" onSubmit={updateDetails} encType="multipart/form-data">
                <img  src={currImage} width="200" height="200" className="profile-image" onClick={triggerImageUpload}/>
                <input type="file" accept="image/*" id="image" name="photo" onChange={uploadPhoto} className="imageFile"/>
                <input className="form-input" name="firstname" type="text" placeholder="Firstname" defaultValue={details.firstname}/>
                <input className="form-input" name="lastname" type="text" placeholder="lastname" defaultValue={details.lastname}/>
                <input className="form-input" name="email" type="text" disabled defaultValue={details.email}></input>
                <button className="form-submit" type="submit" >Save</button>
                <p className="error-message">{error}</p>
                <p className="success-message">{successMessage}</p>
            </form>
            
        <Footer/>
    </Fragment>
}



export default Profile;
import React, {Fragment} from 'react';
import Header from './Header';
import Footer from './Footer';
import { connect } from 'react-redux';
import Match from './Matches';
import _ from 'lodash';
import axios from 'axios';
import {mongourl} from "../config/config";
import {axiosAuth} from "../utils/utils";




class MyMatches extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            myMatches: [],
        }
    }
    async componentDidMount() {
        const response = await axiosAuth(`${mongourl}/matches/`);
        if(response.error) {
            return;
        }
        const myMatches = response.data.filter((match)=> {
            const index = document.cookie.indexOf("_id=");
            const end_index = document.cookie.indexOf("token=");
            const _id = document.cookie.substring(index+4, end_index-2);
            if(_.find(this.props.teams, {"match_id": match._id, "user_id": _id})) {
                return match;
            }
        });
        this.setState({myMatches});
        
    }
    render() {
        return (
            <Fragment>
            <Header/>
            <div className="matches">
                <h2>My Matches</h2>
                <div className="matches-list">
                    {this.state.myMatches.map((match)=>{
                        return <Match key={match._id} {...match}/>
                    })}
                </div>
            </div>
            <Footer/>
            </Fragment>
            );
    }

};

const mapStateToProps = (state) =>(
    {
        teams: state.teams
    }
)

export default connect(mapStateToProps)(MyMatches);
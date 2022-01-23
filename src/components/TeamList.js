import React, {Fragment, useState} from 'react';
import Header from "./Header";
import { connect } from 'react-redux';
import TeamItem from './TeamItem';
import {startEditTeam} from '../actions/teams';
import {startRemoveContest} from '../actions/teams';
import {Link} from 'react-router-dom';

const TeamList = (props) => {
    const [checked_team, setTeam] = useState(null);

    const changeCheckbox = (event) => {
        if(event.target.checked) {
            setTeam(event.target.value);
        }
    }

    const joinTeam = () => {
        if(props.match.params.team_id) {
            if(props.match.params.team_id!==checked_team) {
                props.dispatch(startRemoveContest(props.match.params.team_id, props.match.params.contest_id));
            } 
        }
        props.dispatch(startEditTeam(checked_team, props.match.params.contest_id));
        if(props.match.params.team_id) {
            props.history.push(`../../../../contests/${props.match.params.match_id}`);
        } else {
            props.history.push(`../../../contests/${props.match.params.match_id}`);
        }
    }
    const teams = props.teams.filter((team)=>{
        return team.match_id === props.match.params.match_id;
    });
    return (
        <Fragment>
        <Header/>
        <div className="teams">
        <Link to={`/select-players/${props.match.params.match_id}/${props.match.params.contest_id}`} className="createTeam" >Create Team</Link>
        {teams.map((team, index)=>{
            return <div key={index}>
            {props.match.params.team_id && props.match.params.team_id === team._id && checked_team===null ? 
                <label for={team._id} class="radio">
                <input id={team._id} class="team-checkbox" value={team._id} type="radio" name="team" defaultChecked onClick={(event)=>{changeCheckbox(event)}}/>
                <div class="radio__radio"></div>
                </label>:
                <label for={team._id} class="radio">
                <input id={team._id} class="team-checkbox" value={team._id} type="radio" name="team" onClick={(event)=>{changeCheckbox(event)}}/>
                <div class="radio__radio"></div>
                </label>
            }
           
            <TeamItem index={index+1} {...team}/></div>
        })}
        {checked_team?
            <button onClick={()=>joinTeam()} class="joinButton">Join</button>:
            <button class="joinButton" disabled onClick={()=>joinTeam()}>Join</button>
        }
        
        </div>
        </Fragment>
    )
}

const mapStateToProps = (state) => ({
    teams: state.teams
});

export default connect(mapStateToProps)(TeamList);
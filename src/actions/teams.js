//import {v4 as uuidv4} from 'uuid';
import axios from "axios";
import {mongourl} from "../config/config"

export const addTeam = (_id, players, match_id, contests, user_id) => {
    return {
        type: 'ADD_TEAM',
        
        team: {
            _id,
            players,
            match_id,
            contests,
            user_id
        }
        
        
    }  
}

export const editTeam = (team_id, contest_id) => (
    {
        type: 'EDIT_TEAM',
        team_id,
        team: {
            contest_id
        }
    }
)

export const editPlayers = (team_id, players) => {
    return {
        type: 'EDIT_PLAYERS',
        team_id,
        updates: {
            players
        }
    }
}

export const removeContest = (team_id, contest_id) => {
    return {
        type: 'REMOVE_CONTEST',
        team_id,
        contest_id
    }
}

export async function fetchTeams(dispatch) {
    const index = document.cookie.indexOf("_id=");
    const end_index = document.cookie.indexOf("token=");
    let _id;
    if(index!=-1) {
        _id = document.cookie.substring(index+4, end_index-2);
    } 
    console.log("id:" + _id);
    const response = await axios.get(`${mongourl}/teams/user/${_id}`);
    if(response.status==200) {
        dispatch({ type: 'GET_TEAMS', payload: response.data })
    } 
}

export const startAddTeam = (players, match_id, contests, user_id) => {
    return async(dispatch) => {
        const response = await axios.post(`${mongourl}/teams`, {
            data: {
                players,
                match_id,
                contests,
                user_id
            }
        });
        if(response.status===201) {
            dispatch(addTeam(
                response.data,
                players,
                match_id, 
                contests,
                user_id
            ))
        }

    }
}

export const startEditTeam = (team_id, contest_id) => {
    return async(dispatch) => {
        const response = await axios.patch(`${mongourl}/teams/${team_id}`, {
            contest_id
        });
        if(response.status===201) {
            dispatch(editTeam(
                team_id, 
                contest_id
            ))
        }

    }
}

export const startRemoveContest = (team_id, contest_id) => {
    return async(dispatch) => {
        const response = await axios.patch(`${mongourl}/teams-remove/${team_id}`, {
            contest_id
        });
        if(response.status===201) {
            dispatch(removeContest(
                team_id, 
                contest_id
            ))
        }

    }
}

export const startEditPlayers = (team_id, players) => {
    return async(dispatch) => {
        const response = await axios.patch(`${mongourl}/teams-players/${team_id}`, {
            players
        });
        if(response.status===201) {
            dispatch(editPlayers(
                team_id, 
                players
            ))
        }

    }
}
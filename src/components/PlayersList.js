import React, {Fragment} from 'react';
import PlayerItem from './PlayerItem';
import axios from 'axios';
import {mongourl} from "../config/config";
import {axiosAuth} from '../utils/utils';
import {startAddTeam, startEditPlayers} from '../actions/teams';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import HomeIcon from '@material-ui/icons/Home';
import {connect} from 'react-redux';
import _ from 'lodash';

class PlayerList extends React.Component {
    

    constructor(props) {
        super(props);
        let players;
        if(props.match.params.team_id) {
            players = _.find(props.teams, {"_id": props.match.params.team_id, "match_id": props.match.params.id});
        }
        if(!document.cookie) {
            window.location.href = "../login";
        }
        const index = document.cookie.indexOf("_id=");
        const end_index = document.cookie.indexOf("token=");
        let _id;
        if(index!=-1) {
            _id = document.cookie.substring(index+4, end_index-2);
        } 
        this.state = {
            allPlayers: [],
            filteredPlayers: [],
            team1: '',
            team2: '',
            sports: "cricket",
            tab: 'Wicket Keeper',
            user_id: _id,
            selectedPlayers: players? players.players: [],
            match_id: props.match.params.id,
            contest_id: props.match.params.contest_id,
            team_id: props.match.params.team_id
        }
    }

    async componentDidMount() {
        const match = await axiosAuth(`${mongourl}/matches/` + this.state.match_id);
        if(match.error) {
            return;
        }
        if(match.status===200) {
            const sports = match.data[0].sports;
            const team1 = match.data[0].team1;
            const team2 = match.data[0].team2;
            const response = await axiosAuth(`${mongourl}/players/${team1}/${team2}`);
            console.log(response);
            if(response.status===200) {
                const allPlayers = response.data;
                const filteredPlayers = allPlayers.filter((player)=>{
                    if(sports=="Football") {
                        this.setState({tab: "CF", sports: "football"});
                        return player.role === "CF";  
                    } else {
                        return player.role === "Wicket Keeper";
                    }
                })
                this.setState({allPlayers, team1, team2, filteredPlayers});
            }
        }   
    }
    

    addPlayer = (props) => {
        const selectedPlayers = this.state.selectedPlayers;
        selectedPlayers.push(props);
        this.setState(()=>{
            return {
                selectedPlayers
            }
        })
    }

    removePlayer = (id) => {
        const selectedPlayers = this.state.selectedPlayers.filter((player)=>{
            return player._id!==id;
        })
        this.setState(()=>{
            return {
                selectedPlayers
            }
        })
    }

    setTab = (tab) => {
        const filteredPlayers = this.state.allPlayers.filter((player)=>{
            return player.role === tab;
        })
        this.setState({filteredPlayers, tab});
    }

    addTeam = () => {
        const contests = this.state.contest_id ? [this.state.contest_id] : [];
        if(this.state.team_id) {
            this.props.dispatch(startEditPlayers(this.state.team_id, this.state.selectedPlayers));
            this.props.history.push(`../../../contests/${this.state.match_id}`);
            return;
        }
        this.props.dispatch(startAddTeam(this.state.selectedPlayers, this.state.match_id, contests, this.state.user_id));
        if(this.state.contest_id) {
            this.props.history.push(`../../contests/${this.state.match_id}`);
        } else {
            this.props.history.push(`../contests/${this.state.match_id}`);
        }
        
    }

    navigateBack = () => {
        if(this.state.team_id) {
            this.props.history.push(`../../../contests/${this.state.match_id}`);
            return;
        }
        if(this.state.contest_id) {
            this.props.history.push(`../../contests/${this.state.match_id}`);
            return;
        } else {
            this.props.history.push(`../contests/${this.state.match_id}`);
        }
    }

    navigateHome = () => {
        if(this.state.team_id) {
            this.props.history.push(`../../../`);
            return;
        }
        if(this.state.contest_id) {
            this.props.history.push(`../../`);
            return;
        } else {
            this.props.history.push(`../`);
        }
    }

    // removePlayer = ()
    render() {
        if(this.state.sports == "football") {
            return (
                <Fragment>
                <div className="players-headers-combined">
                <div className="players-header">
                <div>
                    <span className="players-header__icons" onClick={this.navigateBack}><ArrowBackIosIcon fontSize="large"/></span>
                    <span className="players-header__icons" onClick={this.navigateHome}><HomeIcon fontSize="large"/></span>
                </div>
                    <div className="players-header-details">
                        <div>
                        <h2 className="players-team-title">{this.state.team1}</h2> vs <h2 className="players-team-title">{this.state.team2}</h2>
                        </div>
                        <div><h2 className="players-team-title">{this.state.selectedPlayers.length}/11</h2> Players</div>
                    </div>
                </div>
                    <div className="players-list-header">
                    {this.state.tab==='CF'? <div className="players-list-tabs active"  onClick={()=>this.setTab('CF')}>CF</div>:
                    <div className="players-list-tabs"  onClick={()=>this.setTab('CF')}>CF</div>}
                    {this.state.tab==='Winger'? <div className="players-list-tabs active" onClick={()=>this.setTab('Winger')}>Winger</div>:
                    <div className="players-list-tabs" onClick={()=>this.setTab('Winger')}>Winger</div>}
                    {this.state.tab==='Mid-Fielder'? <div className="players-list-tabs active" onClick={()=>this.setTab('Mid-Fielder')}>MF</div>:
                    <div className="players-list-tabs" onClick={()=>this.setTab('Mid-Fielder')}>Mid-Fielder</div>}
                    {this.state.tab==='Defender'? <div className="players-list-tabs active" onClick={()=>this.setTab('Defender')}>Defender</div>:
                    <div className="players-list-tabs" onClick={()=>this.setTab('Defender')}>Defender</div>}
                    </div>
                </div>
                <div className="players-div">
                    <div className="players-list">
                        {this.state.filteredPlayers.map((player)=>{
                            const exist = this.state.selectedPlayers.findIndex((element)=>{
                                return element._id===player._id;
                            })
                            
                            return <PlayerItem key={player._id} {...player} exist={exist} length={this.state.selectedPlayers.length} addPlayer={this.addPlayer} removePlayer={this.removePlayer}/>
                        })}
                    </div>
                    <div className="players-selected">
                    <h2>Selected Players</h2>
                    {this.state.selectedPlayers.map((player)=>{
                        return <p key={player._id}>{player.name}</p>
                    })}
                    </div>
                    <div className="players-footer">
                    <button className="players-save-button" disabled={this.state.selectedPlayers.length!==11?'disabled':''} onClick={()=>{this.addTeam(this.state.selectedPlayers)}}>Save</button>
                    </div>
                </div>
                </Fragment>
                
            )
        }
        return (
            <Fragment>
            <div className="players-headers-combined">
            <div className="players-header">
            <div>
                <span className="players-header__icons" onClick={this.navigateBack}><ArrowBackIosIcon fontSize="large"/></span>
                <span className="players-header__icons" onClick={this.navigateHome}><HomeIcon fontSize="large"/></span>
            </div>
                <div className="players-header-details">
                    <div>
                    <h2 className="players-team-title">{this.state.team1}</h2> vs <h2 className="players-team-title">{this.state.team2}</h2>
                    </div>
                    <div><h2 className="players-team-title">{this.state.selectedPlayers.length}/11</h2> Players</div>
                </div>
            </div>
                <div className="players-list-header">
                {this.state.tab==='Wicket Keeper'? <div className="players-list-tabs active"  onClick={()=>this.setTab('Wicket Keeper')}>WK</div>:
                <div className="players-list-tabs"  onClick={()=>this.setTab('Wicket Keeper')}>WK</div>}
                {this.state.tab==='Batsmen'? <div className="players-list-tabs active" onClick={()=>this.setTab('Batsmen')}>BAT</div>:
                <div className="players-list-tabs" onClick={()=>this.setTab('Batsmen')}>BAT</div>}
                {this.state.tab==='All-rounder'? <div className="players-list-tabs active" onClick={()=>this.setTab('All-rounder')}>AR</div>:
                <div className="players-list-tabs" onClick={()=>this.setTab('All-rounder')}>AR</div>}
                {this.state.tab==='Bowler'? <div className="players-list-tabs active" onClick={()=>this.setTab('Bowler')}>BOWL</div>:
                <div className="players-list-tabs" onClick={()=>this.setTab('Bowler')}>BOWL</div>}
                </div>
            </div>
            <div className="players-div">
                <div className="players-list">
                    {this.state.filteredPlayers.map((player)=>{
                        const exist = this.state.selectedPlayers.findIndex((element)=>{
                            return element._id===player._id;
                        })
                        
                        return <PlayerItem key={player._id} {...player} exist={exist} length={this.state.selectedPlayers.length} addPlayer={this.addPlayer} removePlayer={this.removePlayer}/>
                    })}
                </div>
                <div className="players-selected">
                <h2>Selected Players</h2>
                {this.state.selectedPlayers.map((player)=>{
                    return <p key={player._id}>{player.name}</p>
                })}
                </div>
                <div className="players-footer">
                <button className="players-save-button" disabled={this.state.selectedPlayers.length!==11?'disabled':''} onClick={()=>{this.addTeam(this.state.selectedPlayers)}}>Save</button>
                </div>
            </div>
            </Fragment>
            
        )
    }
    
}

const mapStateToProps = (state) => ({
    teams: state.teams
})



export default connect(mapStateToProps)(PlayerList);
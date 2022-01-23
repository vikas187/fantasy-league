import React from 'react';
import {Link} from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit'

export default (props) => {
    return (
        <div className="team-icon">
            <h2>{"Team " + props.index}</h2>
            <hr />
                <div className="team-links">
                <Link to={`/select-players/${props.match_id}/${props.contest_id}/${props._id}`} className="footer-link"><EditIcon fontSize="large"/></Link>
                </div>
        </div>
    )
}
import { useNavigate } from "react-router-dom";
import { useContext } from "react";  // Import useContext
import './EventCard.css';
import EditEventBtn from '../EditEventBtn/EditEventBtn'
import ViewEventBtn from '../ViewEventBtn/ViewEventBtn'
import { UserRoleContext } from "../../../../context/UserRoleContext";
import { Link } from "react-router-dom";

export default function EventCard(props) {

    const userRole = useContext(UserRoleContext);
    const navigate = useNavigate();  // Initialize useNavigate

    // admin view
    if (userRole === "admin") {
        return (
            <div className="event-card">
                <h1>{props.title}</h1>
                <div className="align-center">
                    <EditEventBtn 
                        event_id={props.event_id} 
                        comp_id={props.comp_id} 
                        setEvents={props.setEvents} 
                        title={props.title} 
                        descrip={props.descrip} 
                        req_1={props.req_1} 
                        req_2={props.req_2} 
                        req_3={props.req_3} 
                        req_4={props.req_4} 
                        req_5={props.req_5} 
                    />
                    <a href="viewrequesters">
                        <button className="view-requesters-btn">
                            View Requesters
                        </button>
                    </a>
                    <button className="view-requesters-btn" onClick={props.onDelete}>
                        Delete
                    </button>
                </div>
            </div>
        )
    // general participant view
    } else if (userRole === "participant") {

        if (props.status === "pending"){

            return (
                <div className="event-card">
                    <h1>{props.title}</h1>
                    <div className="align-center">
                        <ViewEventBtn 
                            title={props.title} 
                            descrip={props.descrip} 
                            req_1={props.req_1} 
                            req_2={props.req_2} 
                            req_3={props.req_3} 
                            req_4={props.req_4} 
                            req_5={props.req_5} 
                        />
                        <button className="view-requesters-btn">
                            Request Event
                        </button>
                    </div>
                </div>
            )

        } else if (props.status === "approved"){
            return (
                <div className="event-card">
                    <h1>{props.title}</h1>
                    <div className="align-center">
                        <ViewEventBtn 
                            title={props.title} 
                            descrip={props.descrip} 
                            req_1={props.req_1} 
                            req_2={props.req_2} 
                            req_3={props.req_3} 
                            req_4={props.req_4} 
                            req_5={props.req_5} 
                        />

                        <Link to={`/todolist?user_id=${props.user_id}&event_id=${props.event_id}`}>
                            <button style={{ backgroundColor: "#00529B" }} className="view-requesters-btn">
                                View Todo List
                            </button>
                        </Link>

                    </div>
                </div>
            )
        }
    }

    return null;
}

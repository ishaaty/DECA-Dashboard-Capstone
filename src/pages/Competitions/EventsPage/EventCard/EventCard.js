import { useNavigate } from "react-router-dom";
import { useContext } from "react";  
import './EventCard.css';
import EditEventBtn from '../EditEventBtn/EditEventBtn'
import ViewEventBtn from '../ViewEventBtn/ViewEventBtn'
import { UserRoleContext } from "../../../../context/UserRoleContext";
import { Link } from "react-router-dom";
import axios from 'axios'; 

export default function EventCard(props) {

    const userRole = useContext(UserRoleContext);
    const navigate = useNavigate();  
    console.log("User role:", userRole);
    console.log("Event status:", props.status);

    const handleCancelRequest = async () => {
        try {
            await axios.delete(`http://localhost:8081/todolist/delete-user-event/${props.event_id}/${props.user_id}`);
            // Handle success (e.g., show a success message or update the UI)
            props.setEvents(prevEvents => prevEvents.filter(event => event.event_id !== props.event_id));
        } catch (error) {
            console.error('Error canceling the request:', error);
        }
    };

    const handleRequestEvent = async () => {
        try {
            console.log("event_id ", props.event_id);
            console.log("user_id ", props.user_id);

            // Use GET to fetch the user-event data from the route
            const response = await axios.get(`http://localhost:8081/todolist/user-event/${props.event_id}/${props.user_id}`);

            // Log or handle the fetched data
            console.log('Fetched user event data:', response.data);

            // You can now update the UI or handle the fetched data
            props.setEvents(prevEvents => prevEvents.map(event => 
                event.event_id === props.event_id 
                ? { ...event, status: response.data.request_status }  // For example, update status
                : event
            ));

        } catch (error) {
            console.error('Error fetching user event data:', error);
        }
    };

    const handleViewTodoList = () => {
        console.log("Navigating with:", { user_id: props.user_id, event_id: props.event_id, user: props.user, title: props.title });
        // Pass user_id, event_id, and user object to the 'todolist' page
        navigate('/todolist', { state: { user_id: props.user_id, event_id: props.event_id, user: props.user, title: props.title } });
    };


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
                    {/* <button
                        style={{ backgroundColor: "#00529B" }}
                        className="view-requesters-btn"
                    >
                        View Todo List
                    </button> */}

                    <Link to={`/viewrequesters/${props.event_id}/${props.title}`}>
                        <button className="view-requesters-btn">
                            View Requesters
                        </button>
                    </Link>

                    <button className="view-requesters-btn" onClick={props.onDelete}>
                        Delete
                    </button>
                </div>
            </div>
        );
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
                        <button style={{ backgroundColor: "#F5585E" }} className="view-requesters-btn" onClick={handleCancelRequest}>
                            Cancel Request
                        </button>
                    </div>
                </div>
            );

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
                        
                        <button
                            style={{ backgroundColor: "#00529B" }}
                            className="view-requesters-btn"
                            onClick={handleViewTodoList} // Use the button's onClick handler
                        >
                            View Todo List
                        </button>
                    </div>
                </div>
            );
        } else if (props.status === "default"){
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
                        <button style={{ backgroundColor: "#00984D" }} className="view-requesters-btn" onClick={handleRequestEvent}>
                            Request Event
                        </button>
                    </div>
                </div>
            );
        }
    }

    return null;
}

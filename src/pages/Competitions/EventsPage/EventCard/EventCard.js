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
            await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/todolist/delete-user-event/${props.event_id}/${props.user_id}`);
            // Handle success (e.g., show a success message or update the UI)
            props.setEvents(prevEvents => prevEvents.filter(event => event.event_id !== props.event_id));
            alert("Request canceled successfully.");
        } catch (error) {
            alert("Failed to cancel the request. Please try again.");
            console.error('Error canceling the request:', error);
        }
    };

    const handleRequestEvent = async () => {
        try {
            console.log("event_id ", props.event_id);
            console.log("user_id ", props.user_id);

            // Use GET to fetch the user-event data from the route
            let response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/todolist/user-event/${props.event_id}/${props.user_id}`);
            alert("Request sent successfully.");

            // You can now update the UI or handle the fetched data
            props.setEvents(prevEvents => prevEvents.map(event => 
                event.event_id === props.event_id 
                ? { ...event, status: response.data.request_status }  // For example, update status
                : event
            ));

        } catch (error) {
            alert("Request failed. Please try again.");
            console.error('Error fetching user event data:', error);
        }
    };

    const handleViewTodoList = () => {
        console.log("Navigating with:", { user_id: props.user_id, event_id: props.event_id, user: props.user, title: props.title });
        // Pass user_id, event_id, and user object to the 'todolist' page
        navigate('/todolist', { state: { user_id: props.user_id, event_id: props.event_id, user: props.user, title: props.title } });
    };

    const handleViewRequesters = () => {
        navigate('/viewrequesters', { state: { event_id: props.event_id, title: props.title } });
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

                    <button className="event-card-btn" id="view-requesters" onClick={handleViewRequesters}>
                        View Requesters
                    </button>

                    <button className="event-card-btn" id="delete-event" onClick={props.onDelete}>
                        Delete Event
                    </button>
                </div>
            </div>
        );

    // board member view
    } else if (userRole === "board member") {

        if (props.status === "pending"){

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

                        <button className="event-card-btn" id="view-requesters" onClick={handleViewRequesters}>
                            View Requesters
                        </button>

                        <button className="event-card-btn" id="cancel-request" onClick={handleCancelRequest}>
                            Cancel Request
                        </button>

                        <button className="event-card-btn" id="delete-event" onClick={props.onDelete}>
                            Delete Event
                        </button>

                    </div>
                </div>
            );

        } else if (props.status === "approved"){
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

                        <button className="event-card-btn" id="view-requesters" onClick={handleViewRequesters}>
                            View Requesters
                        </button>
                        
                        <button
                            className="event-card-btn" id="view-todo-list"
                            onClick={handleViewTodoList} // Use the button's onClick handler
                        >
                            View Todo List
                        </button>

                        <button className="event-card-btn" id="delete-event" onClick={props.onDelete}>
                            Delete Event
                        </button>

                    </div>
                </div>
            );
        } else if (props.status === "default"){
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

                        <button className="event-card-btn" id="view-requesters" onClick={handleViewRequesters}>
                            View Requesters
                        </button>

                        <button className="event-card-btn" id="request-event" onClick={handleRequestEvent}>
                            Request Event
                        </button>

                        <button className="event-card-btn" id="delete-event" onClick={props.onDelete}>
                            Delete Event
                        </button>

                    </div>
                </div>
            );
        }

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
                        <button className="event-card-btn" id="cancel-request" onClick={handleCancelRequest}>
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
                            className="event-card-btn" id="view-todo-list"
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
                        <button className="event-card-btn" id="request-event" onClick={handleRequestEvent}>
                            Request Event
                        </button>
                    </div>
                </div>
            );
        }
    }

    return null;
}

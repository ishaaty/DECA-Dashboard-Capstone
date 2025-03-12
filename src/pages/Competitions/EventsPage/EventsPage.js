import './EventsPage.css';
import Header from '../../../components/Header/Header';
import Menu from '../../../components/Menu/Menu';
import CreateEventBtn from './CreateEventBtn/CreateEventBtn';
import EventCard from './EventCard/EventCard';

import { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { UserRoleContext } from '../../../context/UserRoleContext';
import axios from 'axios';
import { PresignedPost } from 'aws-sdk/clients/s3';

export default function EventsPage() {

    // hard-coded user_id for now
    let user_id = 456;

    const [events, setEvents] = useState([]);
    const [myEvents, setMyEvents] = useState([]);

    const location = useLocation();
    const userRole = useContext(UserRoleContext);
    const searchParams = new URLSearchParams(location.search);
    const comp_id = searchParams.get('comp_id'); // Get comp_id from URL
    let title = "";

    if (comp_id == 1){
        title = "Regionals";
    } else if (comp_id == 2){
        title = "States";
    } else if (comp_id == 3) {
        title = "Nationals"
    }

    console.log(comp_id);

    useEffect(() => {
        const fetchAllEvents = async () => {
            if (!comp_id) return;
            try {
                const response = await axios.get(`http://localhost:8081/events/display/${comp_id}`);
                setEvents(response.data);
            } catch (error) {
                console.error("Error fetching all events:", error);
            }
        };
    
        fetchAllEvents();
    }, [comp_id]);
    

    useEffect(() => {
        const fetchMyEvents = async () => {
            if (!comp_id || !user_id) return;
            try {
                const response = await axios.get(`http://localhost:8081/events/myevents`, {
                    params: { user_id, comp_id }
                });
                setMyEvents(response.data);
            } catch (error) {
                console.error("Error fetching my events:", error);
            }
        };
    
        fetchMyEvents();
    }, [comp_id, user_id]);
    


    
    const handleDeleteEvent = async (id) => {
        try {
          // send the id of the resource to delete to the backend
          await axios.delete(`http://localhost:8081/events/delete/${id}`);
          setEvents(events.filter((event) => event.event_id !== id)); // Update local state
        } catch (error) {
          console.error('Error deleting event:', error);
          alert('Failed to delete event.');
        }
    };


    if (userRole === "admin"){
        return (
            <>
                <Header />
                <Menu />
                <div className="add-event-container">
                <div id="main">
                <a href="competitions">
                    <button id="ahh">
                    <img id="eventimage" src="blue.png" alt=""></img>
                    </button>
                </a>
                </div>
                    
                
                    <h1 style={{color: "#00529B"}}>{title}</h1>
                    

                    <div className="btns-h-align">
                        <a href="roommates">
                            <button id="submit-btn" style={{fontSize: "18px"}}>View Roommates</button>
                        </a>
                        <CreateEventBtn events={events} setEvents={setEvents} comp_id={comp_id} />
                    </div>

                    <div>
                        <h1 style={{ color: "#F5585E", zIndex: "999" }}>All Events:</h1>
                        <div className="events-container">
                            {events?.map((event, index) => (
                                <EventCard
                                    key={event.event_id}
                                    event_id={event.event_id} // This ensures event_id is available in props
                                    comp_id={comp_id}
                                    title={event.event_name}
                                    descrip={event.event_descrip}
                                    req_1={event.req_1}
                                    req_2={event.req_2}
                                    req_3={event.req_3}
                                    req_4={event.req_4}
                                    req_5={event.req_5}
                                    userRole={userRole}
                                    setEvents={setEvents}
                                    onDelete={() => handleDeleteEvent(event.event_id)}
                                />
                            ))}

                        </div>
                    </div>
                </div>
            </>
        )

    } else {

        return (
            <>
                <Header />
                <Menu />
                <div style={{ color: "#00529B", alignItems: "center" }} className="add-event-container">
               
                <div id="main">
                <a href="competitions">
                    <button id="ahh">
                    <img id="eventimage" src="blue.png"alt=""></img>
                    </button>
                </a>
                </div>

                    <h1 style={{ color: "#00529B" }}>{title}</h1>


                    {/* <a href="roommates">
                        <button style={{ backgroundColor: "#00529B", color:"white", fontSize: "18px" }}>
                            View Roommates
                        </button>
                    </a> */}

                    <div>
                        <h1 style={{ color: "#F5585E", alignItems: "center" }}>All Events:</h1>
                        <div className="events-container">
                            {events?.map((event, index) => (
                                <EventCard
                                    key={event.event_id}
                                    status={"pending"}
                                    title={event.event_name}
                                    descrip={event.event_descrip}
                                    req_1={event.req_1}
                                    req_2={event.req_2}
                                    req_3={event.req_3}
                                    req_4={event.req_4}
                                    req_5={event.req_5}
                                    userRole={userRole}
                                    onDelete={() => handleDeleteEvent(event.event_id)}
                                />
                            ))}
                        </div>
                    </div>

                    
                    <div >
                        <h1 style={{ color: "#F5585E", alignItems: "center", marginTop: "30px" }}>My Events:</h1>
                        <div className="events-container">
                            {myEvents?.map((event, index) => (
                                <EventCard
                                    key={event.event_id}
                                    status={"approved"}
                                    event_id={event.event_id}
                                    user_id={user_id}
                                    title={event.event_name}
                                    descrip={event.event_descrip}
                                    req_1={event.req_1}
                                    req_2={event.req_2}
                                    req_3={event.req_3}
                                    req_4={event.req_4}
                                    req_5={event.req_5}
                                    userRole={userRole}
                                    onDelete={() => handleDeleteEvent(event.event_id)}
                                />
                            ))}

                        </div>
                    </div>
                </div>

            </>
        )

    }
}
import './EventsPage.css';
import Header from '../../../components/Header/Header';
import Menu from '../../../components/Menu/Menu';
import CreateEventBtn from './CreateEventBtn/CreateEventBtn';
import EventCard from './EventCard/EventCard';

import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

export default function EventsPage(props) {

    const location = useLocation();
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

    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            if (!comp_id) {
                console.error('comp_id is undefined');
                return;
            }
            try {
                const response = await axios.get(`http://localhost:8081/events/display/${comp_id}`);
                setEvents(response.data);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };
        
        fetchEvents();
    }, [comp_id]); 
    
    
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


    if (props.userRole === "admin"){
        return (
            <>
                <Header />
                <Menu />
                <div className="add-event-container">
                <div id="main">
                <a href="competitions">
                    <button id="ahh">
                    <img src="blue.png" alt=""></img>
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
                            {events.map((event, index) => (
                                <EventCard
                                    key={event.event_id}
                                    event_id={event.event_id} // This ensures event_id is available in props
                                    comp_id={comp_id}
                                    acquired={null}
                                    title={event.event_name}
                                    descrip={event.event_descrip}
                                    location={event.location}
                                    date={event.date}
                                    time={event.time}
                                    req_1={event.req_1}
                                    req_2={event.req_2}
                                    req_3={event.req_3}
                                    req_4={event.req_4}
                                    req_5={event.req_5}
                                    userRole={props.userRole}
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
                    <img src="blue.png"alt=""></img>
                    </button>
                </a>
                </div>

                    <h1 style={{ color: "#00529B" }}>{title}</h1>


                    <a href="roommates">
                        <button style={{ backgroundColor: "#00529B", color:"white", fontSize: "18px" }}>
                            View Roommates
                        </button>
                    </a>
                    <div>
                        <h1 style={{ color: "#F5585E", alignItems: "center" }}>All Events:</h1>
                        <div className="events-container">
                            {/* <EventCard acquired={false} title={"Binder"} descrip={"This is a binders event"} date={"2025-01-31"} /> */}
                            {events.map((event, index) => (
                                <EventCard
                                    key={event.event_id}
                                    acquired={false}
                                    title={event.event_name}
                                    descrip={event.event_descrip}
                                    location={event.location}
                                    date={event.date}
                                    time={event.time}
                                    req_1={event.req_1}
                                    req_2={event.req_2}
                                    req_3={event.req_3}
                                    req_4={event.req_4}
                                    req_5={event.req_5}
                                    userRole={props.userRole}
                                    onDelete={() => handleDeleteEvent(event.event_id)}
                                />
                            ))}
                        </div>
                    </div>
                    <div >
                        <h1 style={{ color: "#F5585E", alignItems: "center", marginTop: "30px" }}>My Events:</h1>
                        <div className="events-container">
                            {events.map((event, index) => (
                                <EventCard
                                    key={event.event_id}
                                    acquired={true}
                                    title={event.event_name}
                                    descrip={event.event_descrip}
                                    location={event.location}
                                    date={event.date}
                                    time={event.time}
                                    req_1={event.req_1}
                                    req_2={event.req_2}
                                    req_3={event.req_3}
                                    req_4={event.req_4}
                                    req_5={event.req_5}
                                    userRole={props.userRole}
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
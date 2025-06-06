import './EventsPage.css';
import Header from '../../../components/Header/Header';
import Menu from '../../../components/Menu/Menu';
import CreateEventBtn from './CreateEventBtn/CreateEventBtn';
import EventCard from './EventCard/EventCard';

import { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { UserRoleContext } from '../../../context/UserRoleContext';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';


export default function EventsPage() {
    const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [user_id, setUserId] = useState(null);
    const [events, setEvents] = useState([]);
    const [myEvents, setMyEvents] = useState([]);
    const [pendingEvents, setPendingEvents] = useState([]);
    const [defaultEvents, setDefaultEvents] = useState([]);
    const [deniedEvents, setDeniedEvents] = useState([]);
    const location = useLocation();
    const userRole = useContext(UserRoleContext);
    const searchParams = new URLSearchParams(location.search);
    
    // Extract comp_id from state
    const comp_id = location.state?.comp_id || null;
    let title = "";

    if (comp_id == 1) {
        title = "Regionals";
    } else if (comp_id == 2) {
        title = "States";
    } else if (comp_id == 3) {
        title = "Nationals";
    }

    useEffect(() => {
        // Fetch the user ID based on email
        const fetchUserId = async () => {
            if (user?.email) {  // Check if user and user.email are available
                try {
                    let token = await getAccessTokenSilently({
                        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
                    });

                    let response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/user/get-user-id`, {
                        params: { email: user.email },
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (response.data?.user_id) {
                        setUserId(response.data.user_id);  // Set the user_id dynamically
                        console.log(user_id)
                    } else {
                        console.error('User ID not found');
                    }
                } catch (error) {
                    console.error('Error fetching user ID:', error);
                }
            } else {
                console.error('User email is not available');
            }
        };
    
        fetchUserId();
    }, [user]);  // Dependency array ensures the effect runs when "user" changes
    

    useEffect(() => {
        const fetchEventsData = async () => {
            if (!comp_id || !user_id) return;  // Ensure user_id is available before fetching events
            console.log("Getting events w comp_id ", comp_id, " and user_id ", user_id)
    
            try {
                let token = await getAccessTokenSilently({
                    audience: process.env.REACT_APP_AUTH0_AUDIENCE,
                });

                let allEventsResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/events/display/${comp_id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const allEvents = allEventsResponse.data;
    


                let approvedEventsResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/events/myevents`, {
                        params: { user_id, comp_id },
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    });
                const approvedEvents = approvedEventsResponse.data;
    


                let pendingEventsResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/events/pending-events`, {
                        params: { user_id, comp_id },
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    });
                const pendingEvents = pendingEventsResponse.data;
    


                let deniedEventsResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/events/denied-events`, {
                        params: { user_id, comp_id },
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    });
                const deniedEvents = deniedEventsResponse.data; // List of denied event IDs


    
                // Filter events based on their categories
                const approvedEventIds = approvedEvents.map(event => event.event_id);
                const pendingEventIds = pendingEvents.map(event => event.event_id);
                const deniedEventIds = deniedEvents.map(event => event.event_id);
    
                // Default events: Events that are not in approved, pending, or denied lists
                const defaultEventsList = allEvents.filter(event =>
                    !approvedEventIds.includes(event.event_id) &&
                    !pendingEventIds.includes(event.event_id) &&
                    !deniedEventIds.includes(event.event_id) // Exclude denied events
                );
    
                // Update state
                setEvents(allEvents); // For displaying all events, if needed
                setMyEvents(approvedEvents); // Approved events
                setPendingEvents(pendingEvents); // Pending events
                setDefaultEvents(defaultEventsList); // Default events (without denied ones)
                setDeniedEvents(deniedEvents);
    
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };
    
        fetchEventsData();
    }, [comp_id, user_id]);
    

    const handleDeleteEvent = async (id) => {
        try {
            // send the id of the resource to delete to the backend
            let token = await getAccessTokenSilently({
                audience: process.env.REACT_APP_AUTH0_AUDIENCE,
            });

            await axios.delete(
                `${process.env.REACT_APP_API_BASE_URL}/events/delete/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            
            setEvents(events.filter((event) => event.event_id !== id)); // Update local state
        } catch (error) {
            console.error('Error deleting event:', error);
            alert('Failed to delete event.');
        }
    };

    if (userRole === "admin") {
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

                    <h1 id="eventheader">{title}</h1>
                    <CreateEventBtn events={events} setEvents={setEvents} comp_id={comp_id} />

                    <div>
                        <h1 id="allevents">All Events:</h1>
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
        );
    } else if (userRole === "board member") {
        
        return (
            <>
                <Header />
                <Menu />
                <div style={{ color: "#00529B", alignItems: "center" }} className="add-event-container">
                    <div id="main">
                        <a href="competitions">
                            <button id="ahh">
                                <img id="eventimage" src="blue.png" alt=""></img>
                            </button>
                        </a>
                    </div>

                    <h1 id="eventheader">{title}</h1>
                    <CreateEventBtn events={events} setEvents={setEvents} comp_id={comp_id} />

                    <div>
                        <h1 id="allevents">All Events:</h1>
                        <div className="events-container">
                            {pendingEvents?.map((event, index) => (
                                <EventCard
                                    key={event.event_id}
                                    status={"pending"}
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
                                    setEvents={setEvents}
                                    onDelete={() => handleDeleteEvent(event.event_id)}
                                />
                            ))}

                            {defaultEvents?.map((event, index) => (
                                <EventCard
                                    key={event.event_id}
                                    status={"default"}
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
                                    setEvents={setEvents}
                                    onDelete={() => handleDeleteEvent(event.event_id)}
                                />
                            ))}
                        </div>
                    </div>

                    <div >
                        <h1 id="allevents">My Events:</h1>
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
                                    setEvents={setEvents}
                                    onDelete={() => handleDeleteEvent(event.event_id)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </>
        );


    } else {
        return (
            <>
                <Header />
                <Menu />
                <div style={{ color: "#00529B", alignItems: "center" }} className="add-event-container">
                    <div id="main">
                        <a href="competitions">
                            <button id="ahh">
                                <img id="eventimage" src="blue.png" alt=""></img>
                            </button>
                        </a>
                    </div>

                    <h1 id="eventheader">{title}</h1>

                    <div>
                        <h1 id="allevents">All Events:</h1>
                        <div className="events-container">
                            {pendingEvents?.map((event, index) => (
                                <EventCard
                                    key={event.event_id}
                                    status={"pending"}
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
                                    setEvents={setEvents}
                                    onDelete={() => handleDeleteEvent(event.event_id)}
                                />
                            ))}

                            {defaultEvents?.map((event, index) => (
                                <EventCard
                                    key={event.event_id}
                                    status={"default"}
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
                                    setEvents={setEvents}
                                    onDelete={() => handleDeleteEvent(event.event_id)}
                                />
                            ))}
                        </div>
                    </div>

                    <div >
                        <h1 id="allevents">My Events:</h1>
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
                                    setEvents={setEvents}
                                    onDelete={() => handleDeleteEvent(event.event_id)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

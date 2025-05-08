import './TodoListPage.css';
import Header from '../../../components/Header/Header';
import Menu from '../../../components/Menu/Menu';
import UploadPDFBtn from './UploadPDFBtn/UploadPDFBtn';
import AddCommentBtn from './AddCommentBtn/AddCommentBtn';
import TodoItem from './TodoItem/TodoItem';

import { UserRoleContext } from '../../../context/UserRoleContext';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useLocation } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';


export default function TodoListPage(props) {

    const { user: viewing_user, isAuthenticated } = useAuth0();
    const [viewing_user_id, setViewingUserId] = useState(null);
    const [todoData, setTodoData] = useState(null);
    const [eventData, setEventData] = useState(null);
    const [statuses, setStatuses] = useState({});
    const [currentComment, setCurrentComment] = useState('');
    const [isThisMyList, setIsThisMyList] = useState(false);

    const userRole = useContext(UserRoleContext);
    const {getAccessTokenSilently} = useAuth0();
    
    const location = useLocation();
    const { user_id, event_id, user, title } = location.state || {};  // Retrieve state from navigation

    console.log("Received data:", user_id, event_id, user, title); 

    console.log("user_id:", user_id, "event_id:", event_id);

    useEffect(() => {
        const fetchTodoData = async () => {
            try {
                let token = await getAccessTokenSilently({
                    audience: process.env.REACT_APP_AUTH0_AUDIENCE,
                });

                let response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/todolist/user-event/${event_id}/${user_id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                setTodoData(response.data);
                console.log('Todo List Data:', response.data);
            } catch (error) {
                console.error('Error fetching todo data:', error);
            }
        };

        const fetchEventData = async () => {
            try {
                let token = await getAccessTokenSilently({
                    audience: process.env.REACT_APP_AUTH0_AUDIENCE,
                });

                let response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/events/event/${event_id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                setEventData(response.data);
                console.log('Event Data:', response.data);
            } catch (error) {
                console.error('Error fetching event data:', error);
            }
        };

        const fetchViewingUserId = async () => {
            if (viewing_user?.email) {  // Check if user and user.email are available
                try {
                    let token = await getAccessTokenSilently({
                        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
                    });

                    let response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/user/get-user-id`, {
                        params: { email: viewing_user.email }, 
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }, 
                    });

                    if (response.data?.user_id) {
                        setViewingUserId(response.data.user_id);
                        setIsThisMyList(response.data.user_id === user_id);
                        console.log(isThisMyList);
                    } else {
                        console.error('Viewing User ID not found');
                    }
                } catch (error) {
                    console.error('Error fetching viewing user ID:', error);
                }
            } else {
                console.error('Viewing user email is not available');
            }
        };


        // Fetch both todo and event data if event_id and user_id are available
        if (event_id && user_id) {
            fetchTodoData();
            fetchEventData();
        }

    fetchViewingUserId();
    }, [event_id, user_id, viewing_user_id]);

    const handleCommentSave = (newComment) => {
        setTodoData((prevTodoData) => ({
            ...prevTodoData,
            comment: newComment, // Update the comment in todoData
        }));
    };
    

    const handleStatusChange = (index, status) => {
        setStatuses((prevStatuses) => ({
            ...prevStatuses,
            [index]: status,  // Update the status of the item at the given index
        }));
    };
    

    const saveStatuses = async (event_id, user_id, statuses) => {
        console.log("eventId:", event_id, "userId:", user_id, "statuses:", statuses);
    
        if (!event_id || !user_id) {
            console.error("Error: eventId or userId is missing!");
            alert("Error: Missing event ID or user ID.");
            return;
        }
    
        try {
            let token = await getAccessTokenSilently({
                audience: process.env.REACT_APP_AUTH0_AUDIENCE,
            });

            let response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/todolist/save-statuses/${event_id}/${user_id}`, statuses, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },

            });
            
            alert("Statuses saved successfully!");
            console.log("Response:", response.data);
        } catch (error) {
            console.error("Error saving statuses:", error);
            alert("Failed to save statuses.");
        }
    };
    

    const requirements = eventData
    ? Object.keys(eventData)
        .filter(key => key.startsWith('req_'))  // Filter keys starting with "req_"
        .map(key => eventData[key])  // Extract corresponding values (the actual requirement names)
        .filter(req => req !== null && req !== '')  // Exclude null or empty string values
    : [];

    if (userRole === "admin" || !isThisMyList) {
        return (
            <>
                <Header />
                <Menu />
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop: "50px", gap: "20px" }}>
                    <h1 id="todolistheader">{title}: {user?.first_name} {user?.last_name}</h1>
                    <div className="todolistcont">
                    <div style={{ backgroundColor: "#E3E8F1", borderRadius: "20px", padding: "30px", display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
                        <h1 style={{ textAlign: "center" }}>To Do List</h1>
                        <div style={{ flex: 1 }}>
                            {todoData && eventData ? (
                                [1, 2, 3, 4, 5].map((index) => {
                                    const eventReq = eventData[`req_${index}`];
                                    const mat = todoData[`mat_${index}`];
                                    const status = todoData[`status_${index}`] || "incomplete"; // Default to "incomplete" if no status exists
    
                                    // Only render the requirement if it is not null
                                    if (eventReq !== null && eventReq !== "" && eventReq !== undefined) {
                                        return (
                                            <TodoItem
                                                key={index}
                                                index={index} // Pass index for identification
                                                userRole={"admin"}
                                                itemName={eventReq}
                                                itemMaterial={mat || "No material available"}
                                                itemStatus={status}
                                                handleStatusChange={handleStatusChange} // Pass the handler
                                            />
                                        );
                                    }
                                    return null; // Skip rendering if req is null
                                })
                            ) : (
                                <p>Loading...</p>
                            )}
                        </div>
                        <button
                            className="saveStatuses"
                            onClick={() => saveStatuses(event_id, user_id, statuses)}
                        >
                            Save Statuses
                        </button>
                    </div>
                    <div>
                    <div style={{ backgroundColor: "#E3E8F1", borderRadius: "20px", padding: "30px" }}>
                        <h1>Comment(s)</h1>
                        <p className="comment">{todoData?.comment || "No comment available"}</p>
                    </div>
    
                    <AddCommentBtn
                        event_id={event_id}
                        user_id={user_id}
                        currentComment={todoData?.comment || "No comment available"}
                        onCommentSave={handleCommentSave} // Pass the handler to the child component
                    />
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
            <div id="todolistcont" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop: "50px", gap: "20px" }}>
                <h1 id="todolistheader">{title}</h1>
                <div className="todolistcont">
                <div style={{ backgroundColor: "#E3E8F1", borderRadius: "20px", padding: "30px", display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
                    <h1 style={{ textAlign: "center" }}>Todo List</h1>
                    <div style={{ flex: 1 }}>
                        {todoData && eventData ? (
                            [1, 2, 3, 4, 5].map((index) => {
                                const eventReq = eventData[`req_${index}`];
                                const mat = todoData[`mat_${index}`];
                                const status = todoData[`status_${index}`] || "incomplete"; // Default to "incomplete" if no status exists

                                // Only render the requirement if it is not null
                                if (eventReq !== null && eventReq !== "" && eventReq !== undefined) {
                                    return (
                                        <TodoItem
                                            key={index}
                                            index={index} // Pass index for identification
                                            userRole={"participant"}
                                            itemName={eventReq}
                                            itemMaterial={mat || "No material available"}
                                            itemStatus={status}
                                            handleStatusChange={handleStatusChange} // Pass the handler
                                        />
                                    );
                                }
                                return null; // Skip rendering if req is null
                            })
                        ) : (
                            <p>Loading...</p>
                        )}
                    </div>
                </div>
                <div>
                <div style={{ backgroundColor: "#E3E8F1", borderRadius: "20px", padding: "30px" }}>
                    <h1>Comment(s)</h1>
                    <p className="comment">{todoData?.comment || "No comment available"}</p>
                </div>

                <UploadPDFBtn requirements={requirements} eventId={event_id} userId={user_id} />
                </div>
                </div>
            </div>
        </>
    );

    }
}

import './TodoListPage.css';
import Header from '../../../components/Header/Header';
import Menu from '../../../components/Menu/Menu';
import UploadPDFBtn from './UploadPDFBtn/UploadPDFBtn';
import AddCommentBtn from './AddCommentBtn/AddCommentBtn';
import TodoItem from './TodoItem/TodoItem';

import { UserRoleContext } from '../../../context/UserRoleContext';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';

export default function TodoListPage(props) {
    const [todoData, setTodoData] = useState(null);
    const [eventData, setEventData] = useState(null);
    const [statuses, setStatuses] = useState({});
    const [currentComment, setCurrentComment] = useState('');

    // Hardcoded event_id and user_id
    let event_id = 123;
    let user_id = 456;

    useEffect(() => {
        const fetchTodoData = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/todolist/user-event/${event_id}/${user_id}`);
                setTodoData(response.data);
                console.log('Todo List Data:', response.data);
            } catch (error) {
                console.error('Error fetching todo data:', error);
            }
        };

        const fetchEventData = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/events/event/${event_id}`);
                setEventData(response.data);
                console.log('Event Data:', response.data);
            } catch (error) {
                console.error('Error fetching event data:', error);
            }
        };

        // Fetch both todo and event data if event_id and user_id are available
        if (event_id && user_id) {
            fetchTodoData();
            fetchEventData();
        }
    }, [event_id, user_id]);

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
            const response = await axios.post(`http://localhost:8081/todolist/save-statuses/${event_id}/${user_id}`, statuses);
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

    if (props.userRole === "admin") {
        return (
            <>
                <Header />
                <Menu />
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop: "50px", gap: "20px" }}>
                    <h1 className="header-text">Julia Thompson: Binder Event</h1>
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
                            style={{ alignSelf: "center" }}
                            onClick={() => saveStatuses(event_id, user_id, statuses)}
                        >
                            Save Statuses
                        </button>
                    </div>
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
            </>
        );

    } else {
        return (
            <>
            <Header />
            <Menu />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop: "50px", gap: "20px" }}>
                <h1 className="header-text">Julia Thompson: Binder Event</h1>
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
                <div style={{ backgroundColor: "#E3E8F1", borderRadius: "20px", padding: "30px" }}>
                    <h1>Comment(s)</h1>
                    <p className="comment">{todoData?.comment || "No comment available"}</p>
                </div>

                <UploadPDFBtn requirements={requirements} eventId={event_id} userId={user_id} />

            </div>
        </>
    );

    }
}

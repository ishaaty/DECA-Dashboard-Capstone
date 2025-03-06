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

    // Hardcoded event_id and user_id
    let event_id = 63;
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

    // Ensure data is available before attempting to map over it
    if ("admin" === "admin") {
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
                                // Ensure both todoData and eventData are available
                                [1, 2, 3, 4, 5].map((index) => {
                                    const eventReq = eventData[`req_${index}`];
                                    const mat = todoData[`mat_${index}`];
                                    const status = todoData[`status_${index}`];

                                    // Only render the requirement if it is not null
                                    if (eventReq !== null && eventReq !== "" && eventReq !== undefined) {
                                        return (
                                            <TodoItem
                                                key={index}
                                                userRole={"admin"}
                                                itemName={eventReq}
                                                itemMaterial={mat || "No material available"}  // Fallback for null materials
                                                itemStatus={status || "Status not available"}  // Fallback for null status
                                            />
                                        );
                                    }
                                    return null; // Skip rendering if req is null
                                })
                            ) : (
                                <p>Loading...</p>
                            )}
                        </div>
                        <button className="saveStatuses" style={{ alignSelf: "center" }}>
                            Save Statuses
                        </button>
                    </div>
                    <div style={{ backgroundColor: "#E3E8F1", borderRadius: "20px", padding: "30px" }}>
                        <h1>Comment(s)</h1>
                        {/* Dynamically render the comment if it exists */}
                        <p className="comment">{todoData?.comment || "No comment available"}</p>
                    </div>

                    <AddCommentBtn />
                </div>
            </>
        );
    } else {
        return (
            <>
                <Header />
                <Menu />
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop: "50px", gap: "20px" }}>
                    <h1 className="header-text">Binder Event</h1>
                    <a href="events">
                        <button style={{ backgroundColor: "#00529B", color: "white" }}>
                            Back
                        </button>
                    </a>
                    <div style={{ backgroundColor: "#E3E8F1", borderRadius: "20px", padding: "30px" }}>
                        <h1>To Do List</h1>
                        {todoData && eventData ? (
                            // Ensure both todoData and eventData are available
                            [1, 2, 3, 4, 5].map((index) => {
                                const eventReq = eventData[`req_${index}`];
                                const mat = todoData[`mat_${index}`];
                                const status = todoData[`status_${index}`];

                                // Only render the requirement if it is not null
                                if (eventReq !== null && eventReq !== "" && eventReq !== undefined) {
                                    return (
                                        <TodoItem
                                            key={index}
                                            userRole={"participant"}
                                            itemName={eventReq}
                                            itemMaterial={mat || "No material available"}  // Fallback for null materials
                                            itemStatus={status || "Status not available"}  // Fallback for null status
                                        />
                                    );
                                }
                                return null; // Skip rendering if req is null
                            })
                        ) : (
                            <p>Loading...</p>
                        )}
                    </div>
                    <div style={{ backgroundColor: "#E3E8F1", borderRadius: "20px", padding: "30px" }}>
                        <h1>Comment(s)</h1>
                        <p className="comment">{todoData?.comment || "No comment available"}</p>
                    </div>
                    <UploadPDFBtn />
                </div>
            </>
        );
    }
}

import './TodoListPage.css';
import Header from '../../../components/Header/Header'
import Menu from '../../../components/Menu/Menu'
import UploadPDFBtn from './UploadPDFBtn/UploadPDFBtn'
import AddCommentBtn from './AddCommentBtn/AddCommentBtn'
import TodoItem from './TodoItem/TodoItem';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function TodoListPage(props) {

    const [todoItem, setTodoItem] = useState(null);

    // // hard-coded values --> will change
    // let event_id = 0;
    // let user_id = 0;

    // useEffect(() => {
    //     const fetchTodoItem = async () => {
    //         if (!event_id || !user_id) {
    //             console.error('event_id or user_id is undefined');
    //             return;
    //         }
    //         try {
    //             const response = await axios.get(`http://localhost:8081/display`, {
    //                 params: { event_id, user_id } // Pass parameters
    //             });
    //             setTodoItem(response.data); // Update state with the fetched item
    //         } catch (error) {
    //             console.error('Error fetching todo list item:', error);
    //         }
    //     };

    //     fetchTodoItem();
    // }, [event_id, user_id]); // Runs when event_id or user_id changes


    if (props.userRole === "admin"){
        return (
            <>
                <Header />
                <Menu />

                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop: "50px", gap: "20px" }}>
    
                    <h1 className="header-text">Julia Thompson: Binder Event</h1>
                    
                    <button style={{ backgroundColor: "#E3E8F1", borderRadius: "20px", padding: "30px"}}>
                        <h1>To Do List</h1>
                        <TodoItem userRole={props.userRole} name={"NJ Deca Form"} status={"incomplete"} />
                        <TodoItem userRole={props.userRole} name={"Script"} status={"incomplete"} />
                        <button className="saveStatuses">Save Statuses</button>
                    </button>
                    <button style={{ backgroundColor: "#E3E8F1", borderRadius: "20px", padding: "30px"}}>
                        <h1>Comment(s)</h1>
                        <p className="comment">Mr. G: Add more detail to script</p>
                    </button>
                    <AddCommentBtn />
    
                </div>
                    
            </>
        )
    } else {
        return (
            <>
                <Header />
                <Menu />
    
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop: "50px", gap: "20px" }}>

                    <h1 className="header-text">Binder Event</h1>
                    <a href="events">
                    <button style={{ backgroundColor: "#00529B", color:"white" }}>
                        Back
                    </button>
                    </a>
    
                    <button style={{ backgroundColor: "#E3E8F1", borderRadius: "20px", padding: "30px"}}>
                        <h1>To Do List</h1>
                        <TodoItem userRole={props.userRole} name={"NJ Deca Form"} status={"incomplete"} />
                        <TodoItem userRole={props.userRole} name={"Script"} status={"incomplete"} />
                    </button>

                    <button style={{ backgroundColor: "#E3E8F1", borderRadius: "20px", padding: "30px"}}>
                        <h1>Comment(s)</h1>
                        <p className="comment">Mr. G: Add more detail to script</p>
                    </button>

                    <UploadPDFBtn />

                </div>   
            </>
        )
    }
}
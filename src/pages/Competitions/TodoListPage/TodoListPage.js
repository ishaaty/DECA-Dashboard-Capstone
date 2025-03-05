import './TodoListPage.css';
import Header from '../../../components/Header/Header'
import Menu from '../../../components/Menu/Menu'
import UploadPDFBtn from './UploadPDFBtn/UploadPDFBtn'
import AddCommentBtn from './AddCommentBtn/AddCommentBtn'
import TodoItem from './TodoItem/TodoItem';

import { UserRoleContext } from '../../../context/UserRoleContext';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';


export default function TodoListPage() {

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
                        <TodoItem userRole={"admin"} itemName={"NJ DECA"} />
                        <TodoItem userRole={"admin"} itemName={"Script"} />
                        </div>
                        <button className="saveStatuses" style={{ alignSelf: "center" }}>
                            Save Statuses
                        </button>
                    </div>
                    <div style={{ backgroundColor: "#E3E8F1", borderRadius: "20px", padding: "30px" }}>
                        <h1>Comment(s)</h1>
                        <p className="comment">Mr. G: Add more detail to script</p>
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
                        <TodoItem userRole={"participant"} itemName={"NJ DECA Form"} />
                        <TodoItem userRole={"participant"} itemName={"Script"} />
                    </div>
                    <div style={{ backgroundColor: "#E3E8F1", borderRadius: "20px", padding: "30px" }}>
                        <h1>Comment(s)</h1>
                        <p className="comment">Mr. G: Add more detail to script</p>
                    </div>
                    <UploadPDFBtn />
                </div>
            </>
        );
    }
}

import { useNavigate } from "react-router-dom";
import { useContext } from "react";  // Import useContext
import './AnnounceCard.css';
import EditAnnounceBtn from '../EditAnnounceBtn/EditAnnounceBtn'
import { UserRoleContext } from "../../../context/UserRoleContext";

export default function AnnounceCard(props) {

    const userRole = useContext(UserRoleContext);
    console.log("User role:", userRole);
    console.log("Event status:", props.status);

    // admin view
    if (userRole === "admin" || userRole === "board member") {
        return (
            <div className="announcement-card">
                <h3>{props.title}</h3>
                <p>{props.description}</p>
                <div className="align-center">
                <EditAnnounceBtn 
                            ann_id={props.ann_id} 
                            setAnnouncements={props.setAnnouncements} 
                            title={props.title} 
                            description={props.description} 
                        />
                        <button className="delete-btn" onClick={props.onDelete}>
                            Delete
                        </button>
                </div>
            </div>
        )
    // general participant view
    } else if (userRole === "participant") {
        return (
            <div className = "announcement-card">
                <h3>{props.title}</h3>
                <p>{props.description}</p>
            </div>
        )
    }

    return null;
}
import { useNavigate } from "react-router-dom";
import { useContext } from "react";  // Import useContext
import './FundraiserCard.css';
import EditFundraiserBtn from '../EditFundraiserBtn/EditFundraiserBtn'
import { UserRoleContext } from "../../../context/UserRoleContext";

export default function FundraiserCard(props) {

    const userRole = useContext(UserRoleContext);
    console.log("User role:", userRole);
    console.log("Event status:", props.status);

    // admin view
    if (userRole === "admin" || userRole =="board member") {
        return (
            <div className="fundraiser-card">
                <h3>{props.fund_name}</h3>
                <p>{props.fund_description}</p>
                <p>{props.fund_location}</p>
                <p>{props.fund_date}</p>
                <div className="align-center">
                <EditFundraiserBtn 
                            fundraiser_id={props.fundraiser_id} 
                            setFundraisers={props.setFundraisers} 
                            fund_name={props.fund_name} 
                            fund_description={props.fund_description} 
                            fund_date={props.fund_date}
                            fund_location={props.fund_location}
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
            <div className = "fundraiser-card">
                <h3>{props.fund_name}</h3>
                <p>{props.fund_description}</p>
                <p>{props.fund_date}</p>
                <p>{props.fund_location}</p>
            </div>
        )
    }

    return null;
}
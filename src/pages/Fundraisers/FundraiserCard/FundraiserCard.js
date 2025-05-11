import { useNavigate } from "react-router-dom";
import { useContext } from "react";  // Import useContext
import './FundraiserCard.css';
import EditFundraiserBtn from '../EditFundraiserBtn/EditFundraiserBtn'
import { UserRoleContext } from "../../../context/UserRoleContext";
import axios from 'axios'; 
const { useAuth0 } = require('@auth0/auth0-react');

export default function FundraiserCard(props) {

    const userRole = useContext(UserRoleContext);
    const navigate = useNavigate(); 
    console.log("User role:", userRole);
    console.log("Event status:", props.status);
    const {getAccessTokenSilently} = useAuth0();

    const handleCancelRequest = async () => {
        try { 
            const token = await getAccessTokenSilently({
                audience: process.env.REACT_APP_AUTH0_AUDIENCE,
            });

            await axios.delete(
                `${process.env.REACT_APP_API_BASE_URL}/fundraisers/delete-user-fundraiser/${props.event_id}/${props.user_id}`, 
                {
                    headers: {
                        Authorization: `Bearer ${token}`, 
                    },
                }
            ); 

            // Handle success (e.g., show a sucess message or update the UI)
            props.setFundraisers(prevFundraisers=>prevFundraisers.filter(fundraiser=>fundraiser.fundraiser_id != props.fundraiser_id)); 
            alert("Request canceled successfully."); 
        } catch (error) { 
            alert("Failed to cancel the request. Please try again.");
            console.error('Error canceling the request: ', error); 
        }
    }; 
    
    const handleRequestEvent = async () => {
        try { 
            console.log("fundraiser_id", props.fundraiser_id);
            console.log("user_id ", props.user_id); 

            let token = await getAccessTokenSilently({
                audience: process.env.REACT_APP_AUTH0_AUDIENCE,
            }); 

            // Use GET to fetch the user-fundraiser data from the route
            let response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/fundraisers/user-fundraiser/${props.fundraiser_id}/${props.user_id}`, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                }
            }); 
            alert("Request sent successfully."); 

            // You can now update the UI or handle the fetched data
            props.setFundraisers(prevFundraisers => prevFundraisers.map(fundraiser =>
                fundraiser.fundraiser_id === props.fundraiser_id
                ? { ...fundraiser, status:response.data.request_status} 
                : fundraiser
                ));
        } catch (error) { 
            alert("Request failed. Please try again."); 
            console.error('Error fetching user event data: ', error); 
        }
    }; 

    const handleViewRequesters = () => {
        navigate('/viewrequesters', { state: { fundraiser_id: props.fundraiser_id, fund_name: props.fund_name}}); 
    };

    
    // admin view
    if (userRole === "admin") {
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
                        <button className="delete-btn" id="view-requesters" onClick = {handleViewRequesters}>
                            View Requesters
                        </button>
                        <button className="delete-btn" onClick={props.onDelete}>
                            Delete
                        </button>
                </div>
            </div>
        ); 

    // board member view
    } else if (userRole === "board member") { 
        
        if (props.status === "pending") { 

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
                        <button className="delete-btn" id="view-requesters" onClick = {handleViewRequesters}>
                            View Requesters
                        </button>
                        <button className = "delete-btn" id="cancel-request" onClick={handleCancelRequest}>
                            Cancel Request
                        </button>
                        <button className="delete-btn" onClick={props.onDelete}>
                            Delete
                        </button>
                </div>
            </div>
            );
        } else if (props.status === "approved") { 
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
                        <button className="delete-btn" id="view-requesters" onClick = {handleViewRequesters}>
                            View Requesters
                        </button>
                        <button className="delete-btn" onClick={props.onDelete}>
                            Delete
                        </button>
                </div>
            </div>
            );
        } else if (props.status === "default") { 
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
                        <button className="delete-btn" id="view-requesters" onClick = {handleViewRequesters}>
                            View Requesters
                        </button>
                        <button className = "delete-btn" id = "request-event" onClick = {handleRequestEvent}>
                            Request Event
                        </button>
                        <button className="delete-btn" onClick={props.onDelete}>
                            Delete
                        </button>
                </div>
            </div>
            ); 
        }

        // general participant view
    } else if (userRole === "participant") { 
        
        if (props.status === "pending") { 

            return ( 
                <div className="fundraiser-card">
                <h3>{props.fund_name}</h3>
                <p>{props.fund_description}</p>
                <p>{props.fund_location}</p>
                <p>{props.fund_date}</p>
                <div className="align-center">
                        <button className="delete-btn" id="cancel-request" onClick = {handleCancelRequest}>
                            Cancel Request
                        </button>
                </div>
            </div>
            );
        } else if (props.status === "approved") { 
            return ( 
                <div className="fundraiser-card">
                <h3>{props.fund_name}</h3>
                <p>{props.fund_description}</p>
                <p>{props.fund_location}</p>
                <p>{props.fund_date}</p>
                <div className="align-center">
                </div>
            </div>
            );
        } else if (props.status==="default") { 
            return ( 
                <div className="fundraiser-card">
                <h3>{props.fund_name}</h3>
                <p>{props.fund_description}</p>
                <p>{props.fund_location}</p>
                <p>{props.fund_date}</p>
                <div className="align-center">
                        <button className="delete-btn" id="request-event" onClick = {handleRequestEvent}>
                            Request Fundraiser
                        </button>
                </div>
            </div>
            );
        }
    } else {
        return (
          <div className="fundraiser-card">
            <h3>{props.fund_name}</h3>
            <p>{props.fund_description}</p>
            <p>{props.fund_location}</p>
            <p>{props.fund_date}</p>
            <button className="delete-btn" id="request-event" onClick = {handleRequestEvent}>
                            Request Fundraiser
                        </button>
          </div>
        );
      }

    return null; 
}
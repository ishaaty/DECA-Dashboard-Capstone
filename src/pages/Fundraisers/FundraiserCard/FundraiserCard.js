import { useNavigate } from "react-router-dom";
import { useContext } from "react";  // Import useContext
import './FundraiserCard.css';
import EditFundraiserBtn from '../EditFundraiserBtn/EditFundraiserBtn'
import { UserRoleContext } from "../../../context/UserRoleContext";

export default function FundraiserCard(props) {

    const userRole = useContext(UserRoleContext);
    console.log("User role:", userRole);
    console.log("Event status:", props.status);

    const handleCancelRequest = async () => { 
        try { 
            try { 
                // Try using productio backend URL first
                await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/todolist/delete-user-fundraiser/${props.fundraiser_id}/${props.user_id}`);
            } catch (error) {
                console.warn('Error deleting from production backend, falling back to localhost...');
                // If production backend fails, fallback to localhost:8081
                await axios.delete(`http://localhost:8081/todolist/delete-user-fundraiser/${props.fundraiser_id}/${props.user_id}`);
            }
            // Hnalde success (show success msg)
            props.setFundraisers(prevFundraisers => prevFundraisers.filter(fundraiser => fundraiser.fundraiser_id));
        } catch (error) {
            console.error('Erorr canceling the request: ', error)
        }
    }; 

    const handleRequestEvent = async () => {
        try { 
            console.log("fundraiser_id ", props.fundraiser_id);
            console.log("user_id ", props.user_id); 

            // Use GET to fetch the user-fundraiser data from the route
            let response; 
            try { 
                // Try using the production backend
                response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/todolist/user-fundraiser/${props.fundraiser_id}/${props.user_id}`);
            } catch (error) {
                console.warn('Error fetching from production backend, falling back to locahost...');
                // If the production URL fails, fallback to localhost
                response = await axios.get(`http://localhost:8081/todolist/user-fundraiser/${props.fundraiser_id}/${props.user_id}`);
            }

            // Log or handle the fetched data
            console.log('Fetched user event data:', response.data); 

            // update UI to handle fetched data
            props.setFundraisers(prevFundraisers => prevFundraisers.map(fundraiser => 
                fundraiser.fundraiser_id === props.user_id 
                ? { ...fundraiser, status: response.data.request_status }  // For example, update status
                : fundraiser
            ));
        } catch (error) { 
            console.error('Error fetching user event data;', error); 
        }
    }; 

    const handleViewTodoList = () => { 
        console.log("Navigating with: ", {user_id: props.user_id, fundraiser_id: props.fundraiser_id, user: props.user, title: props.fund_name}); 
        navigate('/todolist', { state: { user_id: props.user_id, fundraiser_id: props.fundraiser_id, user: props.user, title: props.fund_name } });

    };

    const handleViewRequesters = () => {
        navigate('/viewrequesters', { state: { fundraiser_id: props.fundraiser_id, title: props.title } });
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
                        <button className="delete-btn" id="view-requesters" onClick={handleViewRequesters}>
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
            if (props.status ==="pending") {
                return ( 
                    <div className = "fundraiser-card">
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
                        <button className="delete-btn" id="view-requesters" onClick={handleViewRequesters}>
                        View Requesters
                    </button>
                    <button
                            className="delete-btn" id="view-todo-list"
                            onClick={handleViewTodoList} // Use the button's onClick handler
                        >
                            View Todo List
                        </button>
                        <button className="delete-btn" onClick={props.onDelete}>
                            Delete
                        </button>
                </div>
            </div>
        );
        } else if (props.status === "default") { 
            return (
                <div className = "fundraiser-card}">
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
                        <button className="delete-btn" id="view-requesters" onClick={handleViewRequesters}>
                        View Requesters
                    </button>
                        <button className="delete-btn" id="request-event" onClick = {handleRequestEvent}>
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

        if (props.status ==="pending") {
            return ( 
                <div className = "fundraiser-card">
                <h3>{props.fund_name}</h3>
                <p>{props.fund_description}</p>
                <p>{props.fund_date}</p>
                <p>{props.fund_location}</p>

                <button className="delete-btn" id="cancel-request" onClick={handleCancelRequest}>
                            Cancel Request
                        </button>
            </div>
            

            );
        } else if (props.status === "approved") { 
            return ( 
                <div className = "fundraiser-card">
                    <h3>{props.fund_name}</h3>
                    <p>{props.fund_description}</p>
                    <p>{props.fund_date}</p>
                    <p>{props.fund_location}</p>

                    <button className="delete-btn" id="view-todo-list"
                    onClick={handleViewTodoList}
                    >
                        View Todo List
                    </button>
                </div>
            
            ); 
        } else if (props.status==="default") { 
            return ( 
                <div className="fundraiser-card">
                    <h3>{props.title}</h3>
                    <p>{props.fund_description}</p>
                    <p>{props.fund_date}</p>
                    <p>{props.fund_location}</p>

                    <button className="delete-btn" id="request-event" onClick={handleRequestEvent}>
                        Request Event
                    </button>
                </div>
            )
        }
    }

    return null;
}
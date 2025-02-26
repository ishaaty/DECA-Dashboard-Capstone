import './EventCard.css';
import EditEventBtn from '../EditEventBtn/EditEventBtn'
import ViewEventBtn from '../ViewEventBtn/ViewEventBtn'

export default function EventCard(props){

    // admin view
    if (props.acquired === null) {
        return (
            <div className="event-card">
                <h1>{props.title}</h1>
                <div className="align-center">
                    <EditEventBtn event_id={props.event_id} comp_id={props.comp_id} setEvents={props.setEvents} title={props.title} descrip={props.descrip} req_1={props.req_1} req_2={props.req_2} req_3={props.req_3} req_4={props.req_4} req_5={props.req_5} />
                    <a href="viewrequesters">
                        <button className="view-requesters-btn">
                            View Requesters
                        </button>
                    </a>
                    <button className="view-requesters-btn" onClick={props.onDelete}>
                        Delete
                    </button>
                </div>
            </div>
        )
    // general participant view
    } else if (props.acquired === false){
        return (
            <div className="event-card">
                <h1>{props.title}</h1>
                <div className="align-center">
                    <ViewEventBtn title={props.title} descrip={props.descrip} req_1={props.req_1} req_2={props.req_2} req_3={props.req_3} req_4={props.req_4} req_5={props.req_5} />
                    <button className="view-requesters-btn">
                        Request Event
                    </button>
                </div>
            </div>
        )
    
    // acquired event participant view
    } else if (props.acquired === true){
        return (
            <div className="event-card">
                <h1>{props.title}</h1>
                <div className="align-center">
                    <ViewEventBtn title={props.title} descrip={props.descrip} req_1={props.req_1} req_2={props.req_2} req_3={props.req_3} req_4={props.req_4} req_5={props.req_5} />
                    <a href="todolist">
                        <button className="view-requesters-btn">
                            View Todo List
                        </button>
                    </a>
                </div>
            </div>
        )
    }
    return null;
}
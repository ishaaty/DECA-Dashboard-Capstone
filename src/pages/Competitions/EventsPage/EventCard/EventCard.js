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
                    <EditEventBtn title={props.title} descrip={props.descrip} location={props.location} date={props.date} time={props.time} />
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
                    <ViewEventBtn title={props.title} descrip={props.descrip} date={props.date} />
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
                    <ViewEventBtn title={props.title} descrip={props.descrip} date={props.date} />
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
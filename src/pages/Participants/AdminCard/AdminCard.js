import './AdminCard.css';

export default function AdminCard(props) {
    if (props.role === "admin") {
        return (
            <div class="accontainer">
            <h4 id="name">{`${props.firstName} ${props.lastName}`}</h4>
            <p class="data">{props.email}</p>
            </div>
        )
    } else {
        return (
            <>
                <div class="accontainer">
                <a className="partanchor"href={`/participantdetails?userFirst=${props.firstName}&userLast=${props.lastName}`}>
                    <h4 className="partname">{`${props.firstName} ${props.lastName}`}</h4>
                </a>
                    <p class="data">{props.email}</p>
                </div>
    
            </>
        )
    }
}
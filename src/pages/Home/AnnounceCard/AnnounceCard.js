import './AnnounceCard.css';
import EditAnnounceBtn from '../EditAnnounceBtn/EditAnnounceBtn';

export default function AnnounceCard(props) {

    // admin view
    if (props.acquired == null) {
        return (
            <div className = "announcement-card">
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
    }

    // general participant view 
    if (props.acquired == false) {
        return (
            <div className = "announcement-card">
                <h3>{props.title}</h3>
                <p>{props.description}</p>
            </div>
        )
    }
}

import './AnnounceCard.css';
import EditAnnounceBtn from '../EditAnnounceBtn/EditAnnounceBtn';

export default function AnnounceCard(props) {
    return (
        <div className="announcement-card">
            <h3>{props.title}</h3> {/* Using props.title instead of title directly */}
            <p>{props.description}</p>

            <div className="align-center">
                {(props.acquired === null || props.acquired === undefined) ? (
                    <>
                        <EditAnnounceBtn 
                            ann_id={props.ann_id} 
                            setAnnouncements={props.setAnnouncements} 
                            title={props.title} 
                            description={props.description} 
                        />
                        <button className="delete-btn" onClick={props.onDelete}>
                            Delete
                        </button>
                    </>
                ) : (
                    <>
                        <EditAnnounceBtn 
                            ann_id={props.ann_id} 
                            setAnnouncements={props.setAnnouncements} 
                            title={props.title} 
                            description={props.description} 
                        />
                        <button className="delete-btn" onClick={props.onDelete}>
                            Delete
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

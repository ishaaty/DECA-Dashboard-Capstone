import './PersonalCard.css';

export default function PersonalCard(props) {
    if (props.role === "admin" || props.role === "board member") {
        return (
            <div className="personalinfocontainer">
                <h3 id="personaldetailsheader">Personal Details</h3>
                <p>Gender: {props.gender}</p>
                <p>Demographic Information: {props.demographic}</p>
                <p>Date of Birth: {props.dob}</p>
                <p>Cell: {props.cell}</p>
                <p>Home: {props.home}</p>
            </div>
        )
    }
}
import './CompTypeCard.css';

export default function CompTypeCard(props) {
    return (
        <button className="compCard" style={{ backgroundColor: props.color}}>
            <h1>{props.name}</h1>
        </button>
    )
}
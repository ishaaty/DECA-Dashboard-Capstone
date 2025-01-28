import './AdminCard.css';

export default function AdminCard(props) {
    return (
        <>
            <div class="accontainer">
                <h4 id="name">{props.name}</h4>
                <p class="data">{props.email}</p>
            </div>

        </>
    )
}
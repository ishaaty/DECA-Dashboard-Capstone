import './TodoItem.css';

export default function TodoItem(props) {
    
    const statusDict = {
        "incomplete": { emoji: "❌", text: "Incomplete" },
        "under-review": { emoji: "🔃", text: "Under Review" },
        "completed": { emoji: "✅", text: "Completed" },
        "fixes-needed": { emoji: "⚠️", text: "Fixes Needed" }
    };

    const handleStatusChange = (event) => {
        props.handleStatusChange(props.index, event.target.value);
    };

    const handleViewClick = () => {
        if (!props.itemMaterial || props.itemMaterial.trim() === "" || props.itemMaterial === "No material available") {
            alert("No material here");
            return;
        }
        window.open(props.itemMaterial, '_blank');
    };

    const checkMaterialStatus = () => {
        if (!props.itemMaterial || props.itemMaterial.trim() === "" || props.itemMaterial === "No material available") {
            return "no material here";
        }
    };

    const displayButton = () => {
        if (checkMaterialStatus() === "no material here") {
            return (
                <button id="nodownloadBtn" value="disabled">
                    View
                </button>
            )
        } else {
            return (
                <button id="downloadBtn" onClick={handleViewClick}>
                    View
                </button>
            )
        }
    }

    return (
        <div className="todo-item">
            <div className="todo-item-content">
                <h2>{props.itemName}:</h2>
                {props.userRole === "admin" ? (
                    <select 
                        value={props.itemStatus}
                        onChange={handleStatusChange}
                        id="statusDropdown" 
                        name="statusDropdown"
                    >
                        <option value="incomplete">❌ Incomplete</option>
                        <option value="under-review">🔃 Under Review</option>
                        <option value="completed">✅ Completed</option>
                        <option value="fixes-needed">⚠️ Fixes Needed</option>
                    </select>
                ) : (
                    <p>{statusDict[props.itemStatus]?.emoji} {statusDict[props.itemStatus]?.text}</p>
                )}
            </div>
            {displayButton()}
        </div>
    );
}

import './TodoItem.css';

export default function TodoItem(props) {
    
    const statusDict = {
        "incomplete": { emoji: "❌", text: "Incomplete" },
        "under-review": { emoji: "🔃", text: "Under Review" },
        "completed": { emoji: "✅", text: "Completed" },
        "fixes-needed": { emoji: "⚠️", text: "Fixes Needed" }
    };

    const handleStatusChange = (event) => {
        props.handleStatusChange(props.index, event.target.value); // Notify parent about the status change
    };

    const handleViewClick = () => {
        if (!props.itemMaterial || props.itemMaterial.trim() === "" || props.itemMaterial === "No material available") {
            alert("No material here"); // Show alert
            return; // Stop further execution
        }
        window.open(props.itemMaterial, '_blank');
    };

    // Check userRole and render accordingly
    return (
        <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "20px", justifyContent: "flex-end" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
                <h2 style={{ marginRight: "10px" }}>{props.itemName}:</h2>
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
            <button id="downloadBtn" onClick={handleViewClick}>
                View
            </button>
        </div>
    );
}

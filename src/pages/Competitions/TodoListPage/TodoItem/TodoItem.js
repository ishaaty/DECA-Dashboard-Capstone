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

    // Check userRole and render accordingly
    if (props.userRole === "admin") {
        return (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "20px", justifyContent: "flex-end" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <h2 style={{ marginRight: "10px" }}>{props.itemName}:</h2>
                    <select 
                        value={props.itemStatus}  // Make sure the dropdown value reflects the current status
                        onChange={handleStatusChange}  // Call handler on change
                        id="statusDropdown" 
                        name="statusDropdown"
                    >
                        <option value="incomplete">❌ Incomplete</option>
                        <option value="under-review">🔃 Under Review</option>
                        <option value="completed">✅ Completed</option>
                        <option value="fixes-needed">⚠️ Fixes Needed</option>
                    </select>
                </div>
                <button id="downloadBtn">View</button>
            </div>
        );
    } else {
        return (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "20px", justifyContent: "flex-end" }}>
                <h2 style={{ marginRight: "10px" }}>{props.itemName}:</h2>
                <p>{statusDict[props.itemStatus]?.emoji} {statusDict[props.itemStatus]?.text}</p>
                <button id="downloadBtn" onClick={() => window.open(props.itemMaterial, '_blank')}>
                    View
                </button>
            </div>
        );
    }
}

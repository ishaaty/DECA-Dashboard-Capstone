import './TodoItem.css';

export default function TodoItem(props) {

    if (props.userRole === "admin") {
        return (
            <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "10px", 
                margin: "20px", 
                justifyContent: "flex-end" // Align to the left for more space
            }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <h2 style={{ marginRight: "10px" }}>{props.itemName}:</h2>
                    <select 
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
        )
    } else {
        return (
            <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "10px", 
                margin: "20px", 
                justifyContent: "flex-end" // Align to the left for more space
            }}>
                <h2 style={{ marginRight: "10px" }}>{props.itemName}:</h2>
                <p style={{ fontSize: "18px", margin: 0 }}>❌ Incomplete</p>
                <button id="downloadBtn">View</button>
            </div>
        )
    }
}

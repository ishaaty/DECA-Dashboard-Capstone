import './TodoItem.css';

export default function TodoItem(props){

    if (props.userRole === "admin"){
        return (
            <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "10px", 
                margin: "20px", 
                justifyContent: "flex-end"
            }}>
                <h2 style={{ margin: 0 }}>{props.name}:</h2>
                <select id="status" name="status">
                    <option value="incomplete">❌ Incomplete</option>
                    <option value="under-review">🔃 Under Review</option>
                    <option value="completed">✅ Completed</option>
                    <option value="fixes-needed">⚠️ Fixes Needed</option>
                </select>
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
                justifyContent: "flex-end"
            }}>
                <h2 style={{ margin: 0 }}>{props.name}:</h2>
                <p value="incomplete" style={{fontSize: "18px"}}>❌ Incomplete</p>
                <button id="downloadBtn">View</button>
            </div>
        )
    }

}
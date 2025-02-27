import './TodoItem.css';

export default function TodoItem(){

    return (
        <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "20px" }}>
            <select id="status" name="status">
                <option value="incomplete">❌ Incomplete</option>
                <option value="under-review">🔃 Under Review</option>
                <option value="completed">✅ Completed</option>
                <option value="fixes-needed">⚠️ Fixes Needed</option>
            </select>
            <h2 style={{ margin: 0 }}>NAME OF ITEM</h2>
            <button id="downloadBtn">Download</button>
        </div>
    )

}
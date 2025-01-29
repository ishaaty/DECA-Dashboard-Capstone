import './TodoListPage.css';
import Header from '../../../components/Header/Header'
import Menu from '../../../components/Menu/Menu'
import UploadPDFBtn from './UploadPDFBtn/UploadPDFBtn'

export default function TodoListPage(props) {

    const userRole = "admin";

    if (userRole === "admin"){
        return (
            <>
    
                <Header />
                <Menu />
    
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", gap: "20px" }}>
    
                    <h1 className="header-text">Julia Thompson: Binder Event</h1>
    
                    <button style={{ backgroundColor: "#E3E8F1", borderRadius: "20px", padding: "30px", width: "400px" }}>
                        <h1>To Do List</h1>
                        <h2 style={{ color: "#FF0303" }}> X NJ DECA Form</h2>
                        <h2 style={{ color: "#00984D" }}>✓ Script</h2>
                    </button>
    
                    <button style={{ backgroundColor: "#E3E8F1", borderRadius: "20px", padding: "30px", width: "400px" }}>
                        <h1>Add Comment</h1>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "20px" }}>
                            <button style={{ backgroundColor: "white", borderRadius: "20px", padding: "30px", width: "200px"}}></button>
                            <button style={{ backgroundColor: "#00529B", color: "white", padding: "10px", borderRadius: "20px" }}>Submit</button>
                        </div>
                        
                    </button>
    
                </div>
    
                    
            </>
        )
    } else {
        return (
            <>
                <Header />
                <Menu />
    
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop: "50px", gap: "20px" }}>
    
                    <h1 className="header-text">Binder Event</h1>
    
                    <button style={{ backgroundColor: "#E3E8F1", borderRadius: "20px", padding: "30px", width: "400px" }}>
                        <h1>To Do List</h1>
                        <h2 style={{ color: "#FF0303" }}> X NJ DECA Form</h2>
                        <h2 style={{ color: "#00984D" }}>✓ Script</h2>
                        <h2 style={{ color: "grey" }}># Sources</h2>
                    </button>

                    <button style={{ backgroundColor: "#E3E8F1", borderRadius: "20px", padding: "30px", width: "400px" }}>
                        <h1>Comment(s)</h1>
                        <p className="comment">Mr. G: Add more detail to script</p>
                    </button>

                    <UploadPDFBtn />

                </div>   
            </>
        )
    }
}
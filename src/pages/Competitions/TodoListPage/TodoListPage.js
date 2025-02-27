import './TodoListPage.css';
import Header from '../../../components/Header/Header'
import Menu from '../../../components/Menu/Menu'
import UploadPDFBtn from './UploadPDFBtn/UploadPDFBtn'
import AddCommentBtn from './AddCommentBtn/AddCommentBtn'
import TodoItem from './TodoItem/TodoItem';

export default function TodoListPage(props) {

    if (props.userRole === "admin"){
        return (
            <>
                <Header />
                <Menu />

    
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop: "50px", gap: "20px" }}>
    
                    <h1 className="header-text">Julia Thompson: Binder Event</h1>
                    

                    <button style={{ backgroundColor: "#E3E8F1", borderRadius: "20px", padding: "30px"}}>
                        <h1>To Do List</h1>

                        <TodoItem />
                        <TodoItem />

                    </button>

                    <AddCommentBtn />
    
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
                    <a href="events">
                    <button style={{ backgroundColor: "#00529B", color:"white" }}>
                        Back
                    </button>
                    </a>
    
                    <button style={{ backgroundColor: "#E3E8F1", borderRadius: "20px", padding: "30px"}}>
                        <h1>To Do List</h1>
                        <TodoItem />
                        <TodoItem />
                    </button>

                    <button style={{ backgroundColor: "#E3E8F1", borderRadius: "20px", padding: "30px"}}>
                        <h1>Comment(s)</h1>
                        <p className="comment">Mr. G: Add more detail to script</p>
                    </button>

                    <UploadPDFBtn />

                </div>   
            </>
        )
    }
}
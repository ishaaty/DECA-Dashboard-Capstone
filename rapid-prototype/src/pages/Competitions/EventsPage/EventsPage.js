import './EventsPage.css';
import Header from '../../../components/Header/Header'
import Menu from '../../../components/Menu/Menu'
import CreateEventBtn from './CreateEventBtn/CreateEventBtn'
import EventCard from './EventCard/EventCard'

export default function EventsPage(props) {

    if (props.userRole === "admin"){
        return (
            <>
                <Header />
                <Menu />
                <div className="add-event-container">
                    
               
                    <h1 style={{color: "#00529B"}}>Regionals</h1>
                    

                    <div className="btns-h-align">
                        <a href="roommates">
                            <button id="submit-btn" style={{fontSize: "18px"}}>View Roommates</button>
                        </a>
                        <CreateEventBtn />
                    </div>

                    <div>
                        <h1 style={{ color: "#F5585E" }}>All Events:</h1>
                        <div className="events-container">
                            <EventCard acquired={null} title={"Binder"} descrip={"This is a binders event"} date={"2025-01-31"} />
                            <EventCard acquired={null} title={"Roleplay"} descrip={"Roleplaya"} date={"2024-02-29"} />
                            <EventCard acquired={null} title={"Skit"} descrip={"This is a skit, same thing as a play"} date={"2025-02-14"} />
                        </div>
                    </div>
                </div>
            </>
        )

    } else {

        return (
            <>
                <Header />
                <Menu />
                <div style={{ color: "#00529B", alignItems: "center" }} className="add-event-container">
               
                <div id="main">
                <a href="competitions">
                <button>
                    Back
                </button>
                </a>
                </div>
                    <h1 style={{ color: "#00529B" }}>Regionals</h1>


                    <a href="roommates">
                        <button style={{ backgroundColor: "#00529B", color:"white", fontSize: "18px" }}>
                            View Roommates
                        </button>
                    </a>
                    <div>
                        <h1 style={{ color: "#F5585E", alignItems: "center" }}>All Events:</h1>
                        <div className="events-container">
                            {/* <EventCard acquired={false} title={"Binder"} descrip={"This is a binders event"} date={"2025-01-31"} /> */}
                            <EventCard acquired={false} title={"Roleplay"} descrip={"Roleplaya"} date={"2024-02-29"} />
                            <EventCard acquired={false} title={"Skit"} descrip={"This is a skit, same thing as a play"} date={"2025-02-14"} />
                        </div>
                    </div>
                    <div>
                        <h1 style={{ color: "#F5585E", alignItems: "center" }}>My Events:</h1>
                        <EventCard acquired={true} title={"Binder"} descrip={"This is a binders event"} date={"2025-01-31"} />
                    </div>
                </div>

            </>
        )

    }
}
import './Participants.css';
import Header from '../../components/Header/Header'
import Menu from '../../components/Menu/Menu'
import AdminCard from './/AdminCard/AdminCard'
import ExportCard from './/ExportCard/ExportCard'

export default function Participants(props) {

    const renderAdminContent = () => {
        // admin and board members can access this
        if (props.userRole !== 'participant') {
            return (
                <ExportCard />
            );
        }
        return null; // Return nothing if not admin
    };

    return (
        <>
            <Header />
            <Menu />

            {/* <div className="main-content"> */}
            <div>
                <h1 id="partheader">Participants</h1>
                <div class="partcontainer">
                    <div>
                    <div>
                        <h3 id="advisors">Advisors</h3>
                        <AdminCard name="Mr. Gutierrez" email="josgut@bergen.org"/>
                    </div>
                    <div>
                        <h3 id="board">Board Members</h3>
                        <AdminCard name="Jeannelle Tellado" email="jeatel25@bergen.org"/>
                    </div>
                    <div>
                        <h3 id="member">Members</h3>
                        <div class="partlist">
                            <a class="partanchor" href="participantdetails">
                                <h4 class="partname">Isha Tyagi</h4>
                            </a>
                            <h4 class="partname">Julia Thompson</h4>
                            <h4 class="partname">Ashley Johnson</h4>
                        </div>
                    </div>

                    </div>
                    <div id="exportcontainer">
                        {renderAdminContent()}
                    </div>

                </div>
            </div>

            {/* </div> */}

        </>

    );
}

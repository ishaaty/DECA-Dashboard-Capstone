import './ViewRequesters.css';
import Header from '../../../components/Header/Header'
import Menu from '../../../components/Menu/Menu'
import ParticipantCard from '../../../components/ParticipantCard/ParticipantCard';
import ApprovalButtons from '../../../components/ApprovalButtons/ApprovalButtons';

export default function FundraiserApproval() {

    // let userRole = "admin" || false;

    return (
        <>
            <Header />
            <Menu />
            <h1 className="comp" style={{marginBottom: "20px"}}>Event Approval</h1>
            <div style={{ display: "flex", gap: "0px" }}>
                <div className="fundapprovals">
                    <h1>Requesters</h1>
                    <ParticipantCard name="Isha Tyagi" email="ishtya25@bergen.org" grade="2025" />
                    <ApprovalButtons />
                    <ParticipantCard name="Julia Thompson" email="jultho25@bergen.org" grade="2025" />
                    <ApprovalButtons />
                </div>
                
                <div className="fundapprovals">
                    <h1>Approved</h1>
                    <a href="todolist"><ParticipantCard name="Ashley Johnson" email="ashjoh25@bergen.org" grade="2025" /></a>
                </div>
            </div>

        </>
    )
}
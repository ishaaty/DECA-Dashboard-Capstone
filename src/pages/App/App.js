import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

// pre sign-in & general pages
// import Welcome from "../Welcome/Welcome"
import About from "../About/About"
import Contact from "../Contact/Contact"
import User from "../User/User"
import SignIn from "../SignIn/SignIn"
import NoPage from "../NoPage/NoPage"

// post sign-in pages
import Home from "../Home/Home"
import Competitions from "../Competitions/Competitions"
import Fundraisers from "../Fundraisers/Fundraisers"
import Participants from "../Participants/Participants"
import ParticipantDetails from "../Participants/ParticipantDetails"
import UnapprovedParticipants from "../Participants/UnapprovedParticipants"
import Resources from "../Resources/Resources"
import FundraiserApproval from "../Fundraisers/FundraiserApproval/FundraiserApproval"
import EventsPage from '../Competitions/EventsPage/EventsPage';
import ViewRequesters from '../Competitions/ViewRequesters/ViewRequesters';
import Roommates from '../Roommates/Roommates';
import TodoListPage from '../Competitions/TodoListPage/TodoListPage';

export default function App() {

  const userType = "participant";
  const userFirst = "Isha";
  const userLast = "Tyagi";
  const userEmail = "ishtya25@bergen.org";
  const userClass = "2025";

  return (
    <div>
      <BrowserRouter>
        <Routes>

          {/* pages that DO NOT change by userRole */}
          <Route index element ={<SignIn/>}/>
          <Route path="/about" element={<About/>}/>
          <Route path="/user" element={<User/>}/>
          <Route path="/contact" element={<Contact/>}/>
          <Route path="/signin" element={<SignIn/>}/>

          {/* pages that DO change by userRole */}
          <Route path="/home" element={<Home userRole={userType} />}/>

          <Route path="/competitions" element={<Competitions userRole={userType} />}/>
          <Route path="/events" element={<EventsPage userRole={userType}/>}/>
          <Route path="/viewrequesters" element={<ViewRequesters/>}/>
          <Route path="/roommates" element={<Roommates/>}/>
          <Route path="/todolist" element={<TodoListPage userRole={userType}/>}/>

          <Route path="/fundraisers" element={<Fundraisers userRole={userType} />}/>
          {/* fundraiserapproval only accessible to admins */}
          <Route path="/fundraiserapproval" element={<FundraiserApproval/>}/>

          <Route path="/participants" element={<Participants userRole={userType}/>}/>
          <Route path="/participantdetails" element={<ParticipantDetails userRole={userType} userFirst={userFirst} userLast={userLast} userEmail={userEmail} userClass={userClass}/>}/>
          <Route path="/unapprovedparticipants" element={<UnapprovedParticipants userRole={userType}/>}/>

          <Route path="/resources" element={<Resources userRole={userType} />}/>

          <Route path="*" element={<NoPage/>}/>

        </Routes>
      </BrowserRouter>
    </div>
  )
}
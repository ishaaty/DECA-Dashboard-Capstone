import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { useAuth0 } from '@auth0/auth0-react';
import React from 'react';

import { UserRoleProvider } from '../../context/UserRoleContext';
import ProtectedRoute from '../../context/ProtectedRoute';

// pre sign-in & general pages
import About from "../About/About"
import Contact from "../Contact/Contact"
import User from "../User/User"
import SignIn from "../SignIn/SignIn"
import Callback from '../Callback/Callback';
import NoPage from "../NoPage/NoPage"

// post sign-in pages
import Home from "../Home/Home"
import PendingApproval from "../PendingApproval/PendingApproval"
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
  const { isAuthenticated } = useAuth0();

  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* Pages that do not change by userRole */}
          <Route index element={<SignIn />} />
          <Route path="/about" element={<About />} />
          <Route path="/user" element={<User />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/pending-approval" element={<PendingApproval />} />
          
          {/* Pages that change by userRole */}
          <Route 
            path="/*" 
            element={
              <ProtectedRoute>
                <UserRoleProvider>
                  {isAuthenticated ? <ProtectedRoutes /> : <div>Loading...</div>}
                </UserRoleProvider>
              </ProtectedRoute>
            } 
          />

          {/* Default Route */}
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

const ProtectedRoutes = () => {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/competitions" element={<Competitions />} />
      <Route path="/events" element={<EventsPage />} />
      <Route path="/viewrequesters" element={<ViewRequesters />} />
      <Route path="/roommates" element={<Roommates />} />
      <Route path="/todolist" element={<TodoListPage />} />
      <Route path="/fundraisers" element={<Fundraisers />} />
      <Route path="/fundraiserapproval" element={<FundraiserApproval />} />
      <Route path="/participants" element={<Participants />} />
      <Route path="/participantdetails" element={<ParticipantDetails />} />
      <Route path="/unapprovedparticipants" element={<UnapprovedParticipants />} />
      <Route path="/resources" element={<Resources />} />
    </Routes>
  );
}

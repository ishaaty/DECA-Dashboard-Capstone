import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { useAuth0 } from '@auth0/auth0-react';
import React, { useState, useEffect } from 'react';
import fetchWithAuth from '../../services/axiosConfig';  // Import the fetchWithAuth function

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
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  //const [userRole, setUserRole] = useState(null);  // This will hold the role from the backend
  let userRole = "admin";

  // useEffect(() => {
  //   const fetchRole = async () => {
  //     if (isAuthenticated && user) {  // Ensure user is authenticated before calling
  //       try {
  //         const token = await getAccessTokenSilently();  // Get the token
  //         const roleData = await fetchWithAuth(token, `http://localhost:8081/user/role?email=${user.email}`);  // Fetch the role
  //         setUserRole(roleData.role);  // Set the user role from the backend
  //       } catch (err) {
  //         console.error('Error fetching role:', err);
  //       }
  //     }
  //   };

  //   fetchRole();
  // }, [isAuthenticated, user, getAccessTokenSilently]);  // Only run when isAuthenticated or user changes

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
          
          {/* Pages that change by userRole */}
          <Route path="/home" element={isAuthenticated ? <Home userRole={userRole} /> : <div>Loading...</div>} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/pending-approval" element={<PendingApproval />} />
          <Route path="/competitions" element={<Competitions userRole={userRole} />} />
          <Route path="/events" element={<EventsPage userRole={userRole} />} />
          <Route path="/viewrequesters" element={<ViewRequesters />} />
          <Route path="/roommates" element={<Roommates />} />
          <Route path="/todolist" element={<TodoListPage userRole={userRole} />} />
          <Route path="/fundraisers" element={<Fundraisers userRole={userRole} />} />
          <Route path="/fundraiserapproval" element={<FundraiserApproval />} />
          <Route path="/participants" element={<Participants userRole={userRole} />} />
          <Route path="/participantdetails" element={<ParticipantDetails userRole={userRole} />} />
          <Route path="/unapprovedparticipants" element={<UnapprovedParticipants userRole={userRole} />} />
          <Route path="/resources" element={<Resources userRole={userRole} />} />

          {/* Default Route */}
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

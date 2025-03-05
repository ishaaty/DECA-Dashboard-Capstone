import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import React, { useContext } from 'react';


// Restricts page access
import RoleBasedRoute from '../../context/RoleBasedRoute';
import ProtectedRoute from '../../context/ProtectedRoute';

// Gives pages access to user role
import { UserRoleProvider, UserRoleContext } from '../../context/UserRoleContext';


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
import Unauthorized from "../Unauthorized/Unauthorized"; 



export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* Public pages */}
          <Route index element={<SignIn />} />
          <Route path="/about" element={<About />} />
          <Route path="/user" element={<User />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/pending-approval" element={<PendingApproval />} />

          {/* Provides pages with user role and restricts access to participants/board/admins */}
          <Route 
            path="/*" 
            element={
              <UserRoleProvider>
                <ProtectedRoute>
                  <RoleRestrictedRoutes />
                </ProtectedRoute>
              </UserRoleProvider>
            } 
          />

          {/* Unauthorized route */}
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Default Route */}
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}



// Ensures only approved roles can access post-login pages
const RoleRestrictedRoutes = () => {
  const userRole = useContext(UserRoleContext);

  if (!["participant", "board member", "admin"].includes(userRole)) {
    return <Navigate to="/pending-approval" replace />;
  }

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
      <Route path="/resources" element={<Resources />} />

      {/* Restrict UnapprovedParticipants page to Admins only */}
      <Route 
        path="/unapprovedparticipants" 
        element={
          <RoleBasedRoute allowedRoles={['admin']}>
            <UnapprovedParticipants />
          </RoleBasedRoute>
        } 
      />
    </Routes>
  );
};

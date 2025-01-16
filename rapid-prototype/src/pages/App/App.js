import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

// pre sign-in & general pages
import Welcome from "../Welcome/Welcome"
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
import Resources from "../Resources/Resources"
import FundraiserApproval from "../Fundraisers/FundraiserApproval/FundraiserApproval"
import ViewAddEvents from '../ViewAddEvents/ViewAddEvents';
import ViewRequesters from '../ViewRequesters/ViewRequesters';
import Roommates from '../Roommates/Roommates';
import StudentProfile from '../StudentProfile/StudentProfile';

export default function App() {

  const userType = "admin";

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
          <Route path="/home" element={<Home/>}/>

          <Route path="/competitions" element={<Competitions/>}/>
          <Route path="/viewaddevents" element={<ViewAddEvents/>}/>
          <Route path="/viewrequesters" element={<ViewRequesters/>}/>
          <Route path="/roommates" element={<Roommates/>}/>
          <Route path="/studentprofile" element={<StudentProfile/>}/>

          <Route path="/fundraisers" element={<Fundraisers userRole={userType} />}/>
          <Route path="/fundraiserapproval" element={<FundraiserApproval/>}/>

          <Route path="/participants" element={<Participants userRole={userType}/>}/>

          <Route path="/resources" element={<Resources userRole={userType} />}/>


          <Route path="*" element={<NoPage/>}/>

        </Routes>
      </BrowserRouter>
    </div>
  )
}
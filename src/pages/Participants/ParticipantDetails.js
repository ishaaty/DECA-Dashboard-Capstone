import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ParticipantDetails.css';
import Header from '../../components/Header/Header';
import Menu from '../../components/Menu/Menu';

export default function ParticipantDetails({ userFirst, userLast }) {
  const [participant, setParticipant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  useEffect(() => {
    const fetchParticipantDetails = async () => {
      try {
        const response = await axios.get('http://localhost:8081/participantdetails/displaydetails', {
          params: { userFirst, userLast },
        });
        setParticipant(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching participant details:', err);
        setError('Failed to fetch participant details.');
        setLoading(false);
      }
    };
  
    fetchParticipantDetails();
  }, [userFirst, userLast]);
  


  // Display the events that were retrieved from the database
  const renderEvents = () => {
    if (!participant || !participant.events || participant.events.length === 0) {
      return <p>No events registered.</p>;
    }
  
    return participant.events.map((event, index) => (
      <p key={index} className="event-name">{event.eventName}</p>
    ));
  };
  
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;



  return (
    <>
      <Header />
      <Menu />

      <h1 id="partheader">Participant Details</h1>
      <div className="partdetailcontainer">
        <h3 id="detailname">Name: {participant.userFirst} {participant.userLast}</h3>
        <h3 id="detailemail">Email: {participant.userEmail}</h3>
        <h3 id="detailclass">Class: {participant.userClass}</h3>
        <div className="partevents">
          <h3 id="parteventhead">Events</h3>
          {renderEvents()}
        </div>
      </div>
    </>
  );
}

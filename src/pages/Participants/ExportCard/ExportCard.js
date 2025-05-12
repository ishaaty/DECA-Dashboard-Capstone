import './ExportCard.css'
import axios from 'axios';
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export default function ExportCard() {
    const { getAccessTokenSilently } = useAuth0();
    
    const handleExport = async () => {
        try {
          let token = await getAccessTokenSilently({
            audience: process.env.REACT_APP_AUTH0_AUDIENCE,
          });

          let response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/participantdetails/export`, {
            responseType: 'blob', // Ensures we get the file correctly
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          // Create a download link for the file
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'participants.xlsx');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } catch (error) {
          console.error('Error exporting data:', error);
        }
    };
    return (
        <>
            <div className="export">
              <h3 id="adminaccess">Administrative Access:</h3>
                <div className="exportbuttons">
                    <button onClick={handleExport} id="jpeg"> Export Data</button>
                    <button id="viewunapproved" onClick={() => window.location.href = '/unapprovedparticipants'}>View New Users</button>
                </div>
            </div>
        </>
    )
}
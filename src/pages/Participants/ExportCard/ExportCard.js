import './ExportCard.css'
import axios from 'axios';
import React from 'react';

export default function ExportCard() {
    const handleExport = async () => {
        try {
          const response = await axios.get('http://localhost:8081/participantdetails/export', {
            responseType: 'blob', // This ensures we get the file correctly
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
            <div class="export">
                <div class="exportbuttons">
                    <button onClick={handleExport} id="jpeg"> Export Data</button>
                </div>
                <a id="viewunapproved" href="/unapprovedparticipants">
                <h4>View Unapproved Users</h4>
            </a>
            </div>
        </>
    )
}
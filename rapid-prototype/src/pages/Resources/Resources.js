import './Resources.css';
import Header from '../../components/Header/Header';
import Menu from '../../components/Menu/Menu';
import Resources from '../../components/Resources/Resources';

import { useState, useEffect } from 'react';
import axios from 'axios';

const ResourcesPage = () => {
  const userRole = 'admin'; // Set to 'admin' or any other role for testing
  const [resources, setResources] = useState([]);

  // Fetch resources from axios
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axios.get('http://localhost:8081/resources/display');
        setResources(response.data);
      } catch (error) {
        console.error('Error fetching resources:', error);
      }
    };

    fetchResources();
  }, []);

  return (
    <div className="resources-page">
      <Header />
      <Menu />
      <h1>Resources</h1>
      <Resources resources={resources} setResources={setResources} userRole={userRole} />
    </div>
  );
};

export default ResourcesPage;

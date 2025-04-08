import './Resources.css';
import Header from '../../components/Header/Header';
import Menu from '../../components/Menu/Menu';
import ResourceCards from './ResourceCard/ResourceCard';

import { useState, useEffect, useContext } from 'react';
import { UserRoleContext } from '../../context/UserRoleContext';
import axios from 'axios';

const ResourcesPage = () => {
  const [resources, setResources] = useState([]);
  const userRole = useContext(UserRoleContext);
  console.log(userRole);

  // Fetch resources from axios
  useEffect(() => {
    const fetchResources = async () => {
      try {
        let response;
        try {
          // Try using the production backend URL first
          response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/resources/display`);
        } catch (error) {
          console.warn('Error fetching from production backend, falling back to localhost...');
          // If the production backend fails, fallback to localhost:8081
          response = await axios.get('http://localhost:8081/resources/display');
        }
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
      <h1 className="resources-header">Resources</h1>
      <ResourceCards resources={resources} setResources={setResources} userRole={userRole} />
    </div>
  );
};

export default ResourcesPage;

import './Resources.css';
import Header from '../../components/Header/Header';
import Menu from '../../components/Menu/Menu';
import ResourceCards from './ResourceCard/ResourceCard';

import { useState, useEffect } from 'react';
import axios from 'axios';

const ResourcesPage = (props) => {
  // const userRole = 'admin'; // Set to 'admin' or any other role for testing
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
      <h1 className="comp">Resources</h1>
      <ResourceCards resources={resources} setResources={setResources} userRole={props.userRole} />
    </div>
  );
};

export default ResourcesPage;

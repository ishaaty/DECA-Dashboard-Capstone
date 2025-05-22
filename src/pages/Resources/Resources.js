import './Resources.css';
import Header from '../../components/Header/Header';
import Menu from '../../components/Menu/Menu';
import ResourceCards from './ResourceCard/ResourceCard';

import { useState, useEffect, useContext } from 'react';
import { UserRoleContext } from '../../context/UserRoleContext';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

const ResourcesPage = () => {
  const [resources, setResources] = useState([]);
  const userRole = useContext(UserRoleContext);
  console.log(userRole);

  const { getAccessTokenSilently } = useAuth0();

  // Fetch resources from axios
  useEffect(() => {
    const fetchResources = async () => {
      try {
        let token = await getAccessTokenSilently({
          audience: process.env.REACT_APP_AUTH0_AUDIENCE,
        });

        let response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/resources/display`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
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
      <h1 id="resources-header">Resources</h1>
      <ResourceCards resources={resources} setResources={setResources} userRole={userRole} />
    </div>
  );
};

export default ResourcesPage;

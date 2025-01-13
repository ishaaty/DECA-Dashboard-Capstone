import './Resources.css';
import Header from '../../components/Header/Header';
import Menu from '../../components/Menu/Menu';
import Resources from '../../components/Resources/Resources';
import { useState } from 'react';

const ResourcesPage = (props) => {
  
  const [resources, setResources] = useState([
    { text: 'Deca+', link: 'https://www.decaplus.org/' },
    { text: 'Naviance', link: 'https://example.com/link3' },
    { text: 'PDF Forms', link: 'https://example.com/link5' },
    { text: 'Community Pass', link: 'https://example.com/link7' },
  ]);

  return (
    <div className="resources-page">
      <Header />
      <Menu />
      <h1>Resources</h1>
      <Resources resources={resources} setResources={setResources} userRole={props.userRole} />
    </div>
  );
};

export default ResourcesPage;

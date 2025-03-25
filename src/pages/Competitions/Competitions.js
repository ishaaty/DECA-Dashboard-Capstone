import { useNavigate } from 'react-router-dom';
import './Competitions.css';
import Header from '../../components/Header/Header';
import Menu from '../../components/Menu/Menu';
import CompTypeCard from './CompTypeCard/CompTypeCard';

export default function Competitions() {
    const navigate = useNavigate();

    const handleNavigation = (comp_id) => {
        navigate('/events', { state: { comp_id } });
    };

    return (
        <div>
            <Header />
            <Menu />
            <h1 className="comp">View Competitions</h1>

            <div className="competition-grid">
                <div onClick={() => handleNavigation(1)} style={{ cursor: 'pointer' }}>
                    <CompTypeCard name="Regionals" color="#F5585E" />
                </div>
                <div onClick={() => handleNavigation(2)} style={{ cursor: 'pointer' }}>
                    <CompTypeCard name="States" color="#FFC511" />
                </div>
                <div onClick={() => handleNavigation(3)} style={{ cursor: 'pointer' }}>
                    <CompTypeCard name="Nationals" color="#00529B" />
                </div>
            </div>
        </div>
    );
}

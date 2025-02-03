import './Competitions.css';
import Header from '../../components/Header/Header'
import Menu from '../../components/Menu/Menu'
import CompTypeCard from './CompTypeCard/CompTypeCard'

export default function Competitions() {
    return (
        <div>
            <Header />
            <Menu />
            <h1 className="comp">View Competitions</h1>

            <div className="competition-grid">

                <a href="events" ><CompTypeCard name="Regionals" color="#F5585E" /></a>
                <a href="events" ><CompTypeCard name="States" color="#FFC511" /></a>
                <a href="events" ><CompTypeCard name="Nationals" color="#00529B" /></a>
                
            </div>
        </div>
    )
}
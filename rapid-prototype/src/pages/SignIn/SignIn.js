import './SignIn.css';
import Header from '../../components/Header/Header'

export default function SignIn() {
    return (
        <>
            <Header />
            <div style={{ marginTop: "100px", marginBottom: "75px" }}>
                <img src="decaLogo.png" alt="DECA Logo Not Working" />
            </div>


            <div class="button-container">
                <a href="home" id="signupbtn"><strong>Admin</strong></a>
                <a href="home" id="loginbtn"><strong>Participant</strong></a>
            </div>
        </>
    )
}
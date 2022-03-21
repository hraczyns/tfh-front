import './user.css';
import {Link} from "react-router-dom";

const SignupAfter = () => {
    return <main className={"signup-post-actions-wrapper"}>
        <header>
            Your account is being created. You will receive email with link valid for 24h. Click it to confirm your
            reservation
        </header>
        <div>
            <Link to={"/"}>Go home</Link>
        </div>
    </main>
}

export default SignupAfter;
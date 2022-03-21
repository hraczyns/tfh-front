import {useEffect, useRef, useState} from "react";
import {useHistory} from "react-router-dom";
import './reservation.css';
import ValidatedInput from "../../utils/ValidatedInput";

const ReservationFinder = () => {
    const ref = useRef();
    const params = new URLSearchParams(window.location.search);

    const identifierFromParams = params.get("identifier");
    const [identifier, setIdentifier] = useState(identifierFromParams || "");

    const emailFromParams = params.get("email");
    const [email, setEmail] = useState(emailFromParams || "");

    const history = useHistory();

    useEffect(() => ref.current.click(), [ref]);

    const find = () => {
        if (!email || !identifier) {
            return;
        }
        history.replace("/reservations/search");
        history.push("/reservations", {
            identifier: identifier,
            email: email
        });
    };


    return <main className={"reservation-finder-wrapper"}>
        <section className={"reservation-finder"}>
            <span
                className={"reservation-finder-span"}>Type the reservation identifier and one of emails on ticket</span>
            <div className={"reservation-finder-input-group-wrapper"}>
                <div className={"reservation-finder-input-wrapper"}>
                    <label className={"reservation-finder-label"} id="identifier">Identifier</label>
                    <ValidatedInput name="identifier"
                                    className={"reservation-finder-input"}
                                    placeholder={"Type the reservation identifier"}
                                    value={identifier}
                                    onChange={({target: {value}}) => setIdentifier(value)}
                                    onlyBorderOnError={true}/>
                </div>
                <div className={"reservation-finder-input-wrapper"}>
                    <label className={"reservation-finder-label"} id="identifier">Email</label>
                    <ValidatedInput className={"reservation-finder-input"} placeholder={"Type your email"} value={email}
                                    onChange={({target: {value}}) => setEmail(value)} onlyBorderOnError={true}/>
                </div>
            </div>
            <button ref={ref} className={"reservation-finder-btn"} disabled={!identifier || !email} onClick={find}>Find
                your
                reservation
            </button>
        </section>
    </main>
};

export default ReservationFinder;
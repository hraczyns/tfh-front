import './afterpayment.css'
import {useEffect, useRef, useState} from "react";
import paymentService from "../../rest/functionalities/PaymentService";
import {Link} from "react-router-dom";
import {addLinkToRef} from "../../utils/ResponseToFileConverter";
import TicketSection from "../../ticket/TicketSection";

const PaymentSuccess = ({paymentId}) => {
    const [identifier, setIdentifier] = useState("");
    const [firstMail, setFirstMail] = useState("");
    const [isDone, setDone] = useState(false);
    const aRef = useRef();
    useEffect(() => {
        (async () => {
            try {
                const response = await paymentService.getReservationIdentifierAndFirstMailByPaymentId(paymentId);
                setIdentifier(response?.identifier || "");
                setFirstMail(response?.firstMail || "");
            } catch (e) {
            }
        })();

        const lookingForReservationFunction = setInterval(() => {
            (async () => {
                try {
                    const response = await paymentService.getContentIfPaymentSuccessful(paymentId)
                    const filename = response?.headers.get('Content-Disposition')?.split('filename=')[1];
                    if (!filename) {
                        return;
                    } else {
                        clearInterval(lookingForReservationFunction);
                        setDone(true);
                    }
                    addLinkToRef(response, filename, aRef);
                } catch (e) {
                }
            })();
        }, 1000);
        setTimeout(() => {
            clearInterval(lookingForReservationFunction);
        }, 6000);
        return () => clearInterval(lookingForReservationFunction);
    }, [paymentId]);

    return <main className="payment-success">
        <header className={"payment-success__header"}>Your payment has been processed <span>successfully</span>
        </header>
        <section className={"payment-success__reservation-identifier"}>
            Your reservation identifier is <span>{identifier}</span>
        </section>
        <section className={"payment-success__reservation-more-details"}>
            <Link to={`/reservations/search?identifier=${identifier}&email=${firstMail}`}>More details</Link>
        </section>
        <TicketSection ref={aRef} isDone={isDone}/>
    </main>
}

export default PaymentSuccess;
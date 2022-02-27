import './style.css'
import {useEffect, useRef, useState} from "react";
import paymentService from "../../rest/functionalities/PaymentService";

const PaymentSuccess = ({paymentId}) => {
    const [isDone, setDone] = useState(false);
    const aRef = useRef();
    useEffect(() => {
        const lookingForReservationFunction = setInterval(() => {
            (async () => {
                const response = await paymentService.getContentIfPaymentSuccessful(paymentId)
                const filename = response?.headers.get('Content-Disposition')?.split('filename=')[1];
                if (!filename) {
                    return;
                } else {
                    clearInterval(lookingForReservationFunction);
                    setDone(true);
                }
                response.blob()
                    .then(blob => {
                        let url = window.URL.createObjectURL(blob);
                        let a = document.createElement('a');
                        a.href = url;
                        a.download = filename;
                        aRef.current = a;
                    });
            })();
        }, 1000);
        setTimeout(() => {
            clearInterval(lookingForReservationFunction);
        }, 6000);
        return () => clearInterval(lookingForReservationFunction);
    }, [paymentId]);

    const getTicketStatusText = () => {
        return isDone ? 'AVAILABLE' : 'PROCESSING';
    }

    const getButton = () => {
        return <button onClick={() => aRef.current?.click()}
                       className={"payment-reservation-ticket"} disabled={!isDone}>Download</button>
    };

    return <main className="payment-success">
        <header className={"payment-success__header"}>Your payment has been processed <span
            className={"payment-success__header-status"}>successfully</span></header>
        <section className={"payment-success__content"}>
            <div className={"payment-reservation-ticket-text"}>Click below to download your ticket. Your ticket is now {getTicketStatusText()}</div>
            {getButton()}
        </section>
    </main>
}

export default PaymentSuccess;
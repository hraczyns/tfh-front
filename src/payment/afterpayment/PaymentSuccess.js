import './style.css'
import {useEffect} from "react";
import paymentService from "../../rest/functionalities/PaymentService";

const PaymentSuccess = ({paymentIntentId}) => {

    useEffect(() => {
        const interval = setInterval(() => {
            const {status} = paymentService.getContentIfPaymentSuccessful(paymentIntentId);
            if (status) {

            }
        }, 300);
        return () => clearInterval(interval);
    }, []);


    return <main className="payment-success">
        <header className={"payment-success__header"}>Your payment has been processed <span
            className={"payment-success__header-status"}>successfully</span></header>
        <section>
            When data is processed, they will appear here
        </section>
    </main>
}

export default PaymentSuccess;
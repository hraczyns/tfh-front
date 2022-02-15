import ReservationService from "../rest/functionalities/ReservationService";
import {loadStripe} from "@stripe/stripe-js";
import {Elements} from "@stripe/react-stripe-js";
import paymentService from "../rest/functionalities/PaymentService";
import {useEffect, useState} from "react";
import CheckoutForm from "./CheckoutForm";
import './style.css'
import Navigation from "../navigation/Navigation";
import PaymentSummarySection from "./PaymentSummarySection";

const stripePromise = loadStripe("pk_test_51JvhCXHwVvg3IwFkfH6la5eEoXFM5BNp9zdmpqkYvaqjRilDPEZIB1XPiubJRaJv9cH3DKzv0auMuYEalXG6Dth100tGDmfcnR");
const CLOSED_PAYMENT_ERROR = "Closed payment error";
const Payment = ({history}) => {
    const [clientSecret, setClientSecret] = useState("");
    const [reservation, setReservation] = useState({});
    const [mail, setMail] = useState("");

    useEffect(() => {
        (async () => {
            let data;
            try {
                const body = getBody();
                data = await paymentService.createPaymentIntent(ReservationService.prepareReservation(body));
            } catch (e) {
                console.log(e.toString());
            }
            if (!data) return;
            setClientSecret(data?.clientSecret)
            setReservation({
                route: data?.route,
                passengersInfo: data?.passengersInfo,
                price: data?.price,
                mail: data?.mail
            })
            setMail(data?.mail);
        })();
    }, [])

    const getBody = () => {
        const item = sessionStorage.getItem(history.location.state);
        if (item) {
            sessionStorage.removeItem(history.location.state);
            return JSON.parse(item);
        }
        throw Error(CLOSED_PAYMENT_ERROR);
    }

    const appearance = {
        theme: 'stripe',
        variables: {
            fontSizeBase: "20px"
        }
    };
    const options = {
        clientSecret,
        appearance,
    };

    return <div className={"payment"}>
        <Navigation/>
        <main className={"payment-main"}>
            <section className={"payment-wrapper"}>
                <div className={"payment-body"}>
                    <div>
                        {clientSecret && (
                            <Elements options={options} stripe={stripePromise}>
                                <CheckoutForm/>
                            </Elements>
                        )}
                    </div>
                </div>
            </section>
            <section className={"payment-info"}>
                <PaymentSummarySection reservation={reservation}/>
            </section>
        </main>
    </div>
}

export default Payment;
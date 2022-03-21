import reservationService from "../rest/functionalities/ReservationService";
import {loadStripe} from "@stripe/stripe-js";
import paymentService from "../rest/functionalities/PaymentService";
import {useEffect, useState} from "react";
import './payment.css'
import Navigation from "../navigation/Navigation";
import PaymentSummarySection from "./PaymentSummarySection";
import Loading from "../loading/Loading";
import {Elements} from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe("pk_test_51JvhCXHwVvg3IwFkfH6la5eEoXFM5BNp9zdmpqkYvaqjRilDPEZIB1XPiubJRaJv9cH3DKzv0auMuYEalXG6Dth100tGDmfcnR");
const CLOSED_PAYMENT_ERROR = "Closed payment error";

const appearance = {
    theme: 'stripe',
    variables: {
        fontSizeBase: "20px"
    }
};

const getBody = (history) => {
    const item = sessionStorage.getItem(history.location.state);
    if (item) {
        return JSON.parse(item);
    }
    throw Error(CLOSED_PAYMENT_ERROR);
}

const Payment = ({history}) => {
    const [clientSecret, setClientSecret] = useState("");
    const [reservation, setReservation] = useState({});
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        setLoading(true);
        setError(false);
        (async () => {
            let data;
            try {
                const body = getBody(history);
                data = await paymentService.createPaymentIntent(reservationService.prepareReservation(body));
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
            if (!data) return;
            setClientSecret(data?.clientSecret)
            setReservation({
                route: data?.route,
                passengersInfo: data?.passengersInfo,
                price: data?.price,
                mail: data?.mail
            })
        })();
    }, [history]);

    const options = {
        clientSecret,
        appearance,
    };

    const getContent = () => {
        if (isLoading) {
            return <Loading/>;
        }
        if (error) {
            return <div className={"payment-error-msg"}>
                Cannot prepare payment form! {error}
            </div>
        }
        return <div className={"payment-body"}>
            <div>
                {clientSecret && (
                    <Elements options={options} stripe={stripePromise}>
                        <CheckoutForm handleClick={() => sessionStorage.removeItem(history.location.state)}/>
                    </Elements>
                )}
            </div>
        </div>
    }

    return <div className={"payment"}>
        <Navigation/>
        <main className={"payment-main"}>
            <section className={"payment-wrapper"}>
                {getContent()}
            </section>
            <section className={"payment-info"}>
                <PaymentSummarySection reservation={reservation}/>
            </section>
        </main>
    </div>
}

export default Payment;
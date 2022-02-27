import PaymentSuccess from "./PaymentSuccess";
import PaymentError from "./PaymentError";

const checkStatus = (redirectStatus) => {
    return redirectStatus === 'succeeded'
}

const AfterPayment = () => {
    const params = new URLSearchParams(window.location.search);
    const redirectStatus = params.get("redirect_status");
    const paymentIntentId = params.get("payment_intent");
    return <div>{checkStatus(redirectStatus) ? <PaymentSuccess paymentId ={paymentIntentId}/> : <PaymentError/>}</div>
}

export default AfterPayment
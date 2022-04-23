import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import './App.css'
import Home from './home/Home'
import FindResultsHome from "./findresults/FindResultsHome";
import FinderMap from "./finder/map/FinderMap";
import NotFound from "./utils/NotFound";
import Payment from "./payment/Payment";
import Navigation from "./navigation/Navigation";
import AfterPayment from "./payment/afterpayment/AfterPayment";
import ReservationFinder from "./reservation/created/ReservationFinder";
import ReservationPresenter from "./reservation/created/ReservationPresenter";
import Signup from "./user/Signup";
import SignupAfter from "./user/SignupAfter";
import SignupVerificationToken from "./user/SignupVerificationToken";
import Login from "./user/Login";
import {useMemo, useState} from "react";
import {UserContext} from "./context/UserContext";
import ReserveNowPage from "./reservation/now/ReserveNowPage";

function App() {
    const [user, setUser] = useState(null);

    const value = useMemo(() => ({user, setUser}), [user, setUser]);

    return (
        <div className="App">
            <UserContext.Provider value={value}>
                <Router>
                    <Navigation/>
                    <Switch>
                        <Route path="/" exact component={Home}/>
                        <Route path="/results" exact component={FindResultsHome}/>
                        <Route path="/reserve" exact component={ReserveNowPage}/>
                        <Route path="/map" exact component={FinderMap}/>
                        <Route path="/payment" exact component={Payment}/>
                        <Route path="/payment" component={AfterPayment}/>
                        <Route path="/reservations/search" exact component={ReservationFinder}/>
                        <Route path="/reservations" exact component={ReservationPresenter}/>
                        <Route path="/signup" exact component={Signup}/>
                        <Route path="/signup/after" exact component={SignupAfter}/>
                        <Route path="/signup/verification-token" exact component={SignupVerificationToken}/>
                        <Route path="/login" exact component={Login}/>
                        <Route component={NotFound}/>
                    </Switch>
                </Router>
            </UserContext.Provider>
        </div>
    );
}

export default App;

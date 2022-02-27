import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import './App.css'
import Home from './home/Home'
import FindResultsHome from "./findresults/FindResultsHome";
import FinderMap from "./finder/map/FinderMap";
import NotFound from "./utils/NotFound";
import ReserveNow from "./reservation/now/ReserveNow";
import Payment from "./payment/Payment";
import Navigation from "./navigation/Navigation";
import AfterPayment from "./payment/afterpayment/AfterPayment";

function App() {
    return (
        <div className="App">
            <Router>
                <Navigation/>
                <Switch>
                    <Route path="/" exact component={Home}/>
                    <Route path="/results" exact component={FindResultsHome}/>
                    <Route path="/reserve" exact component={ReserveNow}/>
                    <Route path="/map" exact component={FinderMap}/>
                    <Route path="/payment" exact component={Payment}/>
                    <Route path="/payment" component={AfterPayment}/>
                    <Route component={NotFound}/>
                </Switch>
            </Router>
        </div>
    );
}

export default App;

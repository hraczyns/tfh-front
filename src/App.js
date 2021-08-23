import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import './App.css'
import Home from './home'
import FindResultsHome from "./findresults/FindResultsHome";
import FinderMap from "./finder/map/FinderMap";
import NotFound from "./utils/NotFound";
import ReserveNow from "./reservation/now/ReserveNow";

function App() {
    return (
        <div className="App">
            <Router>
                <Switch>
                    <Route path="/" exact component={Home}/>
                    <Route path="/results" exact component={FindResultsHome}/>
                    <Route path="/reserve" component={ReserveNow}/>
                    <Route path="/map" component={FinderMap}/>
                    <Route component={NotFound}/>
                </Switch>
            </Router>
        </div>
    );
}

export default App;

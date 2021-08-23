import Landscape from "../landscape/Landscape";
import MainHome from "../mainhome/MainHome";
import Navigation from "../navigation/Navigation";

export default function Index() {

    //TODO
    // 1. Static landscape
    // 2. Basic search component and possibility to choose from the map in react leaf
    // 3. Navigation bar, login buttons
    // 4. Manage your reservation (navigation to login page and then to the valid content)
    // 5. Get info about the system, for example train table, trip table, city table.
    // 6. Footer


    return <div>
        <Navigation/>
        <Landscape/>
        <MainHome/>
    </div>
}
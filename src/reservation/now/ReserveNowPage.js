import {useUserData} from "../../hook/useUserData";
import {useState} from "react";
import ReserveNowPanel from "./ReserveNowPanel";
import ReserveNowPreOnLoginPanel from "./ReserveNowPreOnLoginPanel";
import Login from "../../user/Login";

const ReserveNowPage = ({history}) => {
    const [goAnonymously, setWantGoAnonymously] = useState(false);
    const [goLogin, setWantLogin] = useState(false);
    const user = useUserData();
    const parsed = JSON.parse(sessionStorage.getItem(history.location.state));
    const route = parsed?.route;

    if (user?.id || goAnonymously) {
        return <ReserveNowPanel user={user} route={route}/>
    } else {
        if (!route) {
            return <div/>
        }
        if (goLogin) {
            return <Login onClickLogin={() => setWantLogin(false)}/>
        }

        return <ReserveNowPreOnLoginPanel onClick={() => setWantGoAnonymously(true)}
                                          onClickLogin={() => setWantLogin(true)}/>
    }
}

export default ReserveNowPage
import {MapContainer, TileLayer, useMapEvent} from 'react-leaflet';
import Navigation from "../../navigation/Navigation";
import './style.css'
import {useEffect, useState} from "react";
import PolygonWithText from '../../utils/PolygonWithText'
import {useHistory} from 'react-router-dom'

const FinderMap = () => {
    const history = useHistory();
    const [citiesJson, setCitiesJson] = useState([]);
    const [cities, setCities] = useState([]);
    const [finderMapLightboxClassName, setFinderMapLightboxClassName] = useState("findermap__results findermap__results--hidden");
    const [chosen, setChosen] = useState({
        from: -1,
        to: -1
    })
    const [chosenDate, setChosenDate] = useState(null);
    const [initStyle, setInitStyle] = useState({display: 'none'})
    useEffect(() => {
        fetch('http://localhost:8084/api/cities/all')
            .then(data => data.json())
            .then(json => {
                setCitiesJson(json)
                setCities(json._embedded && json._embedded.cityDTOList ? json._embedded.cityDTOList : []);
            })
    }, []);

    const getOnClick = id => {
        if (chosen.from === -1) {
            setChosen({
                from: id,
                to: -1
            })
        } else if (chosen.to === -1 && id !== chosen.from) {
            setChosen({from: chosen.from, to: id})
            setFinderMapLightboxClassName("findermap__results findermap__results--visible");
            if (initStyle !== {}) {
                setInitStyle({});
            }
        } else {
            setChosen({
                from: -1,
                to: -1
            })
            setFinderMapLightboxClassName("findermap__results findermap__results--hidden")
        }
    }

    const getCities = () => {
        if (citiesJson._embedded && citiesJson._embedded.cityDTOList) {
            return citiesJson._embedded.cityDTOList.map(({name, lon, lat, id}) => <PolygonWithText key={id}
                                                                                                   text={name}
                                                                                                   coords={[[lat, lon], [lat, lon]]}
                                                                                                   onClick={() => getOnClick(id)}
                                                                                                   routeChosen={chosen.from === id || chosen.to === id}/>);
        }
        return [];
    };

    const findRoute = () => {
        history.push('/results', {
            source: chosen.from,
            destination: chosen.to,
            startTime: chosenDate
        })
    }

    const getRoute = isForLightBox => {
        const route = cities.filter(({id}) => id === chosen.from || id === chosen.to);
        if (route.length === 2) {
            if (isForLightBox) {
                return <section className={finderMapLightboxClassName} style={initStyle}>
                    <div className={"findermap__results-element"}>
                        <p>From: </p>
                        <b>{route.filter(({id})=>id === chosen.from)[0].name}</b>
                    </div>
                    <div className={"findermap__results-element"}>
                        <>To:</>
                        <b>{route.filter(({id})=>id === chosen.to)[0].name}</b>
                    </div>
                    <div className={"findermap__results-element"}>
                        <p>Date: </p>
                        <input className="findermap__results-element-date" type={"datetime-local"}
                               onChange={e => setChosenDate(e.target.value)}/>
                    </div>
                    <button className={"findermap__results-button"} onClick={findRoute}>Find route</button>
                </section>
            } else {
                return <PolygonWithText text={`${route[0].name} - ${route[1].name}`}
                                        coords={[[route[0].lat, route[0].lon], [route[1].lat, route[1].lon]]}
                                        routeText={true}/>
            }
        } else {
            return <section className={finderMapLightboxClassName} style={initStyle}>
                <div className={"findermap__results-element"}>
                    <p>From: </p>
                    <b>bye ;)</b>
                </div>
                <div className={"findermap__results-element"}>
                    <>To:</>
                    <b>bye ;)</b>
                </div>
                <div className={"findermap__results-element"}>
                    <p>Date: </p>
                    <input className="findermap__results-element-date" type={"datetime-local"}/>
                </div>
                <button className={"findermap__results-button"} disabled>Find route</button>
            </section>
        }

    }

    const reset = () => {
        setChosen({
            from: -1,
            to: -1
        })
        setFinderMapLightboxClassName("findermap__results findermap__results--hidden")
    };

    return <div>
        <Navigation/>
        <main className={"findermap__main"}>
            <MapContainer center={[51.237, 21.017]} zoom={5} scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {getCities()}
                {getRoute()}
                <Clicker onClick={reset}/>
            </MapContainer>
            {getRoute(true)}
        </main>
    </div>
}

const Clicker = ({onClick}) => {
    useMapEvent('click', onClick)
    return '';
}

export default FinderMap
import {MapContainer, TileLayer, useMapEvent} from 'react-leaflet';
import './findermap.css'
import {useEffect, useState} from "react";
import PolygonWithText from '../../utils/PolygonWithText'
import {useHistory} from 'react-router-dom'
import CityService from "../../rest/functionalities/CityService";
import {MapLightBoxSection} from "./MapLightBoxSection";
import {DefaultMapLightBoxSection} from "./DefaultMapLightBoxSection";

const NOT_CHOSEN = -1;
const DEFAULT_COORDS = [51.237, 21.017];

const FinderMap = () => {
    const history = useHistory();
    const [citiesJson, setCitiesJson] = useState([]);
    const [cities, setCities] = useState([]);
    const [finderMapLightboxClassName, setFinderMapLightboxClassName] = useState("findermap__results findermap__results--hidden");
    const [chosen, setChosen] = useState({
        from: NOT_CHOSEN,
        to: NOT_CHOSEN
    })
    const [chosenDate, setChosenDate] = useState(null);
    const [initStyle, setInitStyle] = useState({display: 'none'})

    useEffect(() => {
        (async () => {
            try {
                const result = await CityService.getAll();
                setCitiesJson(result);
                setCities(result._embedded?.cityDtoList ?? []);
            } catch (e) {
            }
        })();
    }, []);


    const getOnClick = id => {
        if (chosen.from === NOT_CHOSEN) {
            setChosen({
                from: id,
                to: NOT_CHOSEN
            })
        } else if (chosen.to === NOT_CHOSEN && id !== chosen.from) {
            setChosen({from: chosen.from, to: id})
            setFinderMapLightboxClassName("findermap__results findermap__results--visible");
            if (initStyle !== {}) {
                setInitStyle({});
            }
        } else {
            setChosen({
                from: NOT_CHOSEN,
                to: NOT_CHOSEN
            })
            setFinderMapLightboxClassName("findermap__results findermap__results--hidden")
        }
    }

    const getCities = () => {
        if (citiesJson?._embedded?.cityDtoList) {
            return citiesJson._embedded.cityDtoList.map(({name, lon, lat, id}) => <PolygonWithText key={id}
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

    const handleChosenDate = e => setChosenDate(e.target.value);

    const getRoute = isForLightBox => {
        const route = cities.filter(({id}) => id === chosen.from || id === chosen.to);
        if (route.length === 2) {
            if (isForLightBox) {
                return <MapLightBoxSection
                    mainClassName={finderMapLightboxClassName}
                    initStyle={initStyle}
                    route={route}
                    onDateChange={handleChosenDate}
                    onClick={findRoute}
                    chosen={chosen}
                    isDisabledBtn={!chosenDate}/>
            } else {
                return <PolygonWithText text={`${route[0].name} - ${route[1].name}`}
                                        coords={[[route[0].lat, route[0].lon], [route[1].lat, route[1].lon]]}
                                        routeText={true}/>
            }
        } else {
            return <DefaultMapLightBoxSection mainClassName={finderMapLightboxClassName} initStyle={initStyle}/>
        }

    }

    const reset = () => {
        setChosen({
            from: NOT_CHOSEN,
            to: NOT_CHOSEN
        })
        setFinderMapLightboxClassName("findermap__results findermap__results--hidden")
    };

    return <main className={"findermap__main"}>
        <MapContainer center={DEFAULT_COORDS} zoom={5} scrollWheelZoom={true}>
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
}

const Clicker = ({onClick}) => {
    useMapEvent('click', onClick)
    return '';
}

export default FinderMap
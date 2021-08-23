import {MapContainer, TileLayer} from 'react-leaflet';
import Navigation from "../../navigation/Navigation";
import './style.css'
import {useEffect, useState} from "react";
import PolygonWithText from '../../utils/PolygonWithText'

const FinderMap = () => {
    const [citiesJson, setCitiesJson] = useState([]);
    const [cities, setCities] = useState([]);
    const [finderMapLightboxClassName, setFinderMapLightboxClassName] = useState("findermap__results findermap__results--hidden");
    const [chosen, setChosen] = useState({
        from: -1,
        to: -1
    })
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
                from: id,
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

    const getRoute = isForLightBox => {
        const route = cities.filter(({id}) => id === chosen.from || id === chosen.to);
        if (route.length === 2) {
            if (isForLightBox) {
                return <section className={finderMapLightboxClassName} style={initStyle}>
                    <p>{`From: ${route[0].name}`}</p>
                    <p>{`To: ${route[1].name}`}</p>
                </section>
            } else {
                return <PolygonWithText text={`${route[0].name} - ${route[1].name}`}
                                        coords={[[route[0].lat, route[0].lon], [route[1].lat, route[1].lon]]}
                                        routeText={true}/>
            }
        }

    }
    const style = {display: 'none'};
    return <div>
        <Navigation/>
        <main className={"findermap__main"}>
            <MapContainer center={[52.237, 21.017]} zoom={13} scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {getCities()}
                {getRoute()}
            </MapContainer>
            {getRoute(true)}
        </main>
    </div>
}

export default FinderMap
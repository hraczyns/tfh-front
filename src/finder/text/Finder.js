import './style.css';
import DropdownSearchSelection from "../../dropdownsearchselection/DropdownSearchSelection";
import {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import CityService from "../../rest/functionalities/CityService";

const NOT_CHOSEN = -1;

const Finder = () => {
    const history = useHistory();
    const [cities, setCities] = useState([]);
    const [choice, setChoice] = useState({
        source: NOT_CHOSEN,
        destination: NOT_CHOSEN,
        startTime: ''
    })

    useEffect(() => {
        (async () => {
                try {
                    const result = await CityService.getAll()
                    setCities(parseCityData(result));
                } catch (e) {
                }
            }
        )
        ();
    }, [])

    const findTrip = (e) => {
        e.preventDefault();
        history.push("/results", choice);
    }

    const handleChange = (e, v) => {
        if (v) {
            if (v.id === 'finder__from') {
                const sourceId = cities.filter(s => s.value === v.value)
                    .map(s => s.key)[0];
                setChoice(prev => ({
                    ...prev,
                    'source': sourceId
                }))
            } else if (v.id === 'finder__to') {
                const destId = cities.filter(s => s.value === v.value)
                    .map(s => s.key)[0];
                setChoice(prev => ({
                    ...prev,
                    'destination': destId
                }))
            }
        } else {
            setChoice(prev => ({
                ...prev,
                'startTime': e.target.value
            }))
        }
    }

    const parseCityData = input => {
        if (input?._embedded?.cityDtoList) {
            const arr = [...input._embedded.cityDtoList];
            return arr.map(rec => {
                return {
                    key: rec.id,
                    value: rec.name,
                    text: rec.name
                }
            })
        }
        return [];
    }

    return <div className={"finder__container"}>
        <form onSubmit={findTrip}>
            <div className={"finder__header"}>Search:</div>
            <div className={"finder__section"}>
                <label className={"finder__section-element finder__label"}>From:</label>
                <DropdownSearchSelection name={"finder__from"} options={cities} onSearchChange={handleChange}/>
            </div>
            <div className={"finder__section"}>
                <label className={"finder__section-element finder__label"}>To:</label>
                <DropdownSearchSelection name={"finder__to"} options={cities} onSearchChange={handleChange}/>
            </div>
            <div className={"finder__section"}>
                <label className={"finder__section-element finder__label"}>Date: </label>
                <input className={"finder__date"} name={"date"} type={"datetime-local"}
                       onChange={e => handleChange(e, null)}/>
            </div>
            <div className={"finder__button-container"}>
                <button className={"finder__section-element finder__button"} type={"submit"}>Find</button>
            </div>
        </form>

    </div>
}

export default Finder
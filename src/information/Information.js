import DropdownSearchSelection from "../dropdownsearchselection/DropdownSearchSelection";
import CityService from "../rest/functionalities/CityService";
import {useEffect, useState} from "react";
import './information.css';
import Timetable from "./timetable/Timetable";

const NOT_CHOSEN = -1;

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

const getFromStorage = (param) => {
    const json = sessionStorage.getItem("timetable");
    const result = JSON.parse(json);
    return result ? result[param] : null;
}

const Information = () => {
    const [cities, setCities] = useState([]);
    const [choice, setChoice] = useState({
        city: getFromStorage("city") || NOT_CHOSEN,
        startTime: getFromStorage("startTime") || '',
        endTime: getFromStorage("endTime") || ''
    })
    const [city, setCity] = useState(getFromStorage("city") || NOT_CHOSEN);
    const [cityName, setCityName] = useState(getFromStorage("cityName") || '');
    const [startTime, setStartTime] = useState(getFromStorage("startTime") || '');
    const [endTime, setEndTime] = useState(getFromStorage("endTime") || '');

    useEffect(() => {
        (async () => {
                try {
                    const result = await CityService.getAll()
                    setCities(parseCityData(result));
                } catch (e) {
                }
            }
        )();
    }, []);

    const handleChange = (e, v) => {
        if (v) {
            const sourceId = cities.filter(s => s.value === v.value)
                .map(s => s.key)[0];
            setCity(sourceId);
            setCityName(v.value)
        } else {
            if (e.target.name === "date-end") {
                setEndTime(e.target.value);
            } else {
                setStartTime(e.target.value);
            }
        }
    }

    const search = (e) => {
        e.preventDefault();
        sessionStorage.setItem("timetable", JSON.stringify({
            city: city,
            startTime: startTime,
            endTime: endTime,
            cityName: cityName
        }));
        setChoice({
            city: city,
            startTime: startTime,
            endTime: endTime
        });

    }

    const clear = () => {
        sessionStorage.removeItem("timetable");
        setChoice({
            city: NOT_CHOSEN,
            startTime: '',
            endTime: ''
        })
        setCity(NOT_CHOSEN);
        setCityName('');
        setStartTime('');
        setEndTime('');
    }

    return <div className={"information-timetable-wrapper"}>
        <main className={"information-timetable"}>
            <section className={"information-timetable-finder"}>
                <header>Pick the city where you want to check the timetable</header>
                <div className={"information-timetable-finder-search"}>
                    <DropdownSearchSelection value={cityName} name="time" options={cities}
                                             onSearchChange={handleChange}/>
                    <span>from</span>
                    <input value={startTime} className={"information-timetable-finder-search-date"} name={"date"}
                           type={"datetime-local"} onChange={e => handleChange(e, null)}/>
                    <span>to</span>
                    <input value={endTime} className={"information-timetable-finder-search-date"} name={"date-end"}
                           type={"datetime-local"} onChange={e => handleChange(e, null)}/>
                    <button className={"information-timetable-finder-search-btn-find"} onClick={search}
                            disabled={!city || !startTime || !endTime}>Find
                    </button>
                    <button className={"information-timetable-finder-search-btn-clear"} onClick={clear}>Clear</button>
                </div>
            </section>
            <section className={"information-timetable-content"}>
                <Timetable choice={choice}/>
            </section>
        </main>
    </div>
}

export default Information;
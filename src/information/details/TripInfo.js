import {useEffect, useMemo, useState} from "react";
import timetableService from "../../rest/functionalities/TimetableService";
import {useParams} from "react-router";
import Table from "../../table/Table";
import {TRIP_COLUMNS} from "../../table/TableColumnsConst";
import Loading from "../../loading/Loading";
import {checkDate} from "../../utils/DateUtil";
import {NavLink, useHistory} from "react-router-dom";

const prepareData = (result) => {
    const data = [];
    for (let i = 1; i < result?.stopTimeDtoList.length; i++) {
        const next = result.stopTimeDtoList[i];
        const current = result.stopTimeDtoList[i - 1];
        data.push({
            from: current?.cityDto?.name,
            to: next?.cityDto?.name,
            departureTime: checkDate(current?.departureTime),
            arrivalTime: checkDate(next?.arrivalTime),
        })
    }
    return data;
}

const TripInfo = () => {
    const {tripId} = useParams();
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(null);
    const [trainId, setTrainId] = useState(null);
    const history = useHistory();

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const data = await timetableService.getTripInfo(tripId);
                setResult(data);
                const trainOfId = data?._links?.train?.href?.split("trains/")[1];
                setTrainId(trainOfId);
            } catch (e) {
                setResult(null);
                setTrainId(null);
            } finally {
                setLoading(false);
            }
        })();
    }, [tripId]);

    const data = useMemo(() => prepareData(result), [result]);

    if (loading) {
        return <Loading/>
    }
    return <div className={"information-trip-info-wrapper"}>
        <section className={"information-trip-info"}>
            <div className={"information-trip-info-menu"}>
                <button onClick={history.goBack}>Back</button>
                <NavLink to={"/information/trains/" + trainId}>Go to train of this trip</NavLink>
            </div>
            <Table columns={TRIP_COLUMNS} data={data}/>
        </section>
    </div>
}

export default TripInfo;
import {useParams} from "react-router";
import {useEffect, useMemo, useState} from "react";
import timetableService from "../../rest/functionalities/TimetableService";
import constApi from "../../rest/ConstApi";
import Table from "../../table/Table";
import {TRAIN_COLUMNS} from "../../table/TableColumnsConst";
import {checkDate} from "../../utils/DateUtil";
import {NavLink, useHistory} from "react-router-dom";

const prepareDataForTable = (trip) => {
    const data = [];
    const list = trip?.stopTimeDtoList || [];
    for (let i = 1; i < list.length; i++) {
        const current = list[i - 1];
        const next = list[i];
        data.push({
            from: current?.cityDto?.name,
            to: next?.cityDto?.name,
            departureTime: checkDate(current?.departureTime),
            arrivalTime: checkDate(next?.arrivalTime),
        })
    }
    return data;
}

const TrainInfo = () => {
    const history = useHistory();
    const {trainId} = useParams();
    const [trainDetails, setTrainDetails] = useState(null);
    const [tripsByTrainId, setTripsByTrainId] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const data = await timetableService.getTrainDetails(trainId);
                setTrainDetails(data);
            } catch (e) {
                setTrainDetails(null);
            }
        })();
        (async () => {
            try {
                const data = await timetableService.getTripsByTrainId(trainId);
                setTripsByTrainId(data);
            } catch (e) {
                setTripsByTrainId(null)
            }
        })();
    }, [trainId]);

    const prepareTripId = (trip) => {
        return trip?._links?.self.href?.split("/trips/")[1];
    }

    const preparedTables = useMemo(() => {
        return tripsByTrainId?._embedded?.tripDtoList?.map((trip) => {
            return <div key={Math.random()}>
                <div className={"information-train-info-trips-link-wrapper"}>
                    <NavLink to={"/information/trips/" + prepareTripId(trip)}>Go to trip below </NavLink>
                </div>
                <Table columns={TRAIN_COLUMNS} data={prepareDataForTable(trip)}/>
            </div>
        })
    }, [tripsByTrainId]);

    return <div className={"information-train-info-wrapper"}>
        <section className={"information-train-info-details"}>
            <button onClick={history.goBack}>Back</button>
            <div className={"information-train-info-details-content"}>
                <div>
                    <span>Train:</span><span>{trainDetails?.name}</span>
                </div>
                <div>
                    <span>Train unique name:</span><span>{trainDetails?.representationUnique}</span>
                </div>
                <div>
                    <span>Number of seats:</span><span>{trainDetails?.numberOfSeats}</span>
                </div>
                <div>
                    <span>Train class:</span><span>{trainDetails?.model}</span>
                </div>
                <div>
                    <span>Train icon:</span>
                    <div className={"information-train-info-details-content-image"}>
                        <img src={constApi.apiUrl + "/api/trains/images?train_id=" + trainId} alt={""}/>
                    </div>
                </div>
            </div>
        </section>
        <section className={"information-train-info-trips"}>
            {preparedTables}
        </section>
    </div>
}

export default TrainInfo;
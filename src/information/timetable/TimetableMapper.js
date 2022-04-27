import {checkDate} from "../../utils/DateUtil";
import {NavLink} from "react-router-dom";

const timetableMapper = {
    mapToTableData: (data) => {
        return data.map(obj => {
            return {
                departureTime: checkDate(obj?.stopTimeDto?.departureTime),
                to: obj?.nextStopTimeDto?.cityDto?.name,
                arrivalTimeDest: checkDate(obj?.nextStopTimeDto?.arrivalTime),
                trainUnique: obj?.trainUnique,
                trainClass: obj?.trainClass,
                redirectToTrip: <NavLink to={'/information/trips/' + (obj?.tripId || 0)}>Go to
                    trip</NavLink>,
                redirectToTrain: <NavLink to={'/information/trains/' + (obj?.trainId || 0)}>Go to train</NavLink>
            }
        })
    }
}

export default timetableMapper;
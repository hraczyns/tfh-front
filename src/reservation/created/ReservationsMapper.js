import {checkDate} from "../../utils/DateUtil";

const reservationsMapper = {
    mapToTableData: (reservation, history) => {
        return {
            from: reservation?.reservedRoute[0]?.start?.cityDto.name,
            to: reservation?.reservedRoute[reservation.reservedRoute.length - 1]?.end?.cityDto.name,
            date: checkDate(reservation?.reservedRoute[0]?.start?.departureTime),
            action: <button onClick={() => history.push("/reservations", {
                identifier: reservation?.identifier,
                email: reservation?.passengers[0].passenger?.email
            })}>Navigate</button>
        }
    }
}

export default reservationsMapper;
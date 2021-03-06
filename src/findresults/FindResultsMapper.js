import {checkDate} from "../utils/DateUtil";
import constApi from "../rest/ConstApi";

const findResultsMapper = {
    mapResponseToMainInfo: (stopTime) => {
        return {
            start: stopTime?.start.cityDto.name,
            departureTime: checkDate(stopTime?.start.departureTime),
            arrivalTime: checkDate(stopTime?.end.arrivalTime),
            end: stopTime?.end.cityDto.name,
            train: <div className={"findresultshome__train_image-wrapper"}>
                <span>{stopTime?.train.model}</span>
                <img className={"findresultshome__train_image"}
                                       src={constApi.apiUrl + "/api/trains/images?train_id=" + stopTime?.train.id}
                                       alt={""}/>
            </div>

        };
    },
    mapResponseToAdditionalInfo: (stopTime, resultsJson) => {
        return {
            trainName: stopTime?.train.name,
            trainModel: stopTime?.train.model,
            trainUniqueName: stopTime?.train.representationUnique,
            generalStartId: resultsJson?._embedded.journeyDtoList[0].source.id,
            generalDestId: resultsJson?._embedded.journeyDtoList[0].destination.id,
            localStartId: stopTime?.start.cityDto.id,
            localEndId: stopTime?.end.cityDto.id,
            localStartStopTimeId: stopTime?.start.id,
            localEndStopTimeId: stopTime?.end.id
        }
    },
    mapResponseToGeneralResults: (mainData, additionalData) => {
        return {
            id: -1,
            result: mainData,
            additionalData: additionalData
        }
    },
    mapToTableFragment: (fragmentOfTableContent) => {
        return {
            startCity: fragmentOfTableContent.result.start,
            endCity: fragmentOfTableContent.result.end,
            trainName: fragmentOfTableContent.additionalData.trainName,
            trainModel: fragmentOfTableContent.additionalData.trainModel,
            trainUniqueName: fragmentOfTableContent.additionalData.trainUniqueName
        }
    }
}

export default findResultsMapper;
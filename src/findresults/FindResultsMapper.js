import ReactHtmlParser from "react-html-parser";

const findResultsMapper = {
    mapResponseToMainInfo: (stopTime, trainImg) => {
        return {
            start: stopTime?.start.cityDto.name,
            arrivalTime: checkDate(stopTime?.start.departureTime),
            departureTime: checkDate(stopTime?.end.arrivalTime),
            end: stopTime?.end.cityDto.name,
            train: ReactHtmlParser(trainImg)
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
            trainModel: fragmentOfTableContent.additionalData.trainModel
        }
    }
}

const checkDate = json => json.length > 20 ? '-' : json.replace('T', ' ');

export default findResultsMapper;
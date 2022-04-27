import Table from '../table/Table'
import {useEffect, useState} from "react";
import './findresults.css'
import LinkButton from "../utils/LinkButton";
import RouteResultsElement from '../routeelementskeeper/RouteResultsElement'
import Loading from "../loading/Loading";
import findResultsMapper from "./FindResultsMapper";
import resultsService from "../rest/functionalities/ResultsService";
import PriceService from "../rest/functionalities/PriceService";
import priceServiceParams from "./PriceServiceParams";
import {RESULTS_COLUMNS} from "../table/TableColumnsConst";

const extractRoutes = foundResults => foundResults?._embedded?.journeyDtoList.map(s => s.partOfJourneys) ?? [];

const validate = json => json?._embedded?.journeyDtoList.every(s => s.resultId) ?? false;

const getParams = (content) => {
    return priceServiceParams.getParamsByContent(content);
}

const FindResultsHome = ({history}) => {
    const [currentPriceInfo, setCurrentPriceInfo] = useState({});
    const [tableIndex, setTableIndex] = useState(-1);
    const [tableContent, setTableContent] = useState([]);
    const [saveResults, setSavedResults] = useState([]);
    const [resultsJson, setResultsJson] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const {source, destination, startTime} = history?.location?.state;

    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true);
                const foundResults = await resultsService.findResults(source, destination, startTime);
                if (!validate(foundResults)) {
                    return;
                }
                setResultsJson(foundResults);
                const routes = extractRoutes(foundResults);
                const generaleResultsArray = [];
                for (const route of routes) {
                    for (const stopTime of route) {
                        const resultObj = findResultsMapper.mapResponseToMainInfo(stopTime);
                        const additionalData = findResultsMapper.mapResponseToAdditionalInfo(stopTime, foundResults);
                        const resToSave = findResultsMapper.mapResponseToGeneralResults(resultObj, additionalData);
                        generaleResultsArray.push(resToSave);
                    }
                }
                setSavedResults(generaleResultsArray);
            } catch (e) {
            } finally {
                setIsLoading(false);
            }
        })();
    }, [source, destination, startTime]);

    const getSummaryText = () => {
        if (!validate(resultsJson)) {
            return '';
        }
        const from = resultsJson?._embedded?.journeyDtoList[0].source.name;
        const to = resultsJson?._embedded?.journeyDtoList[0].destination.name;
        return <p className={"findresultshome__summary-cities"}>{`${from} - ${to}`}</p>
    }

    const processResults = () => {
        const objToSplit = [...saveResults];

        if (!validate(resultsJson)) {
            return [];
        }
        const arr = [];
        let skipped = 0;
        let id = 1;
        resultsJson?._embedded?.journeyDtoList.forEach(resFromBackend => {
            const lengthOfElsOneRoute = resFromBackend?.partOfJourneys.length;
            arr.push(objToSplit.slice(skipped, skipped + lengthOfElsOneRoute).map(obj => {
                obj.id = id;
                return obj;
            }));
            skipped += lengthOfElsOneRoute;
            id++;
        })
        return arr;
    }

    const parseContent = () => {
        if (tableContent.length !== 0) {
            const content = [...tableContent]
                .map((frag, index) => {
                    const {startCity, endCity, trainName, trainModel, trainUniqueName} = findResultsMapper.mapToTableFragment(frag);
                    let price = getPriceByStartAndStopId(frag);
                    if (!price) price = '0.0 zl';
                    return <RouteResultsElement
                        key={index}
                        startCity={startCity}
                        endCity={endCity}
                        trainModel={trainModel}
                        trainName={trainName}
                        trainUnique={trainUniqueName}
                        price={price}
                        setNonBottomFromLast={index === tableContent.length - 1}/>
                });

            content.push(<article className={"findresultshome__price-summary"} key={-2}>
                <div>Summary price</div>
                <div>{`${currentPriceInfo.priceInGeneral} zl`}</div>
            </article>);
            content.push(<article className={"findresultshome__reserve-btn-wrapper"} key={-1}>
                <LinkButton className={"findresultshome__reserve-btn"} to={"/reserve"}
                            storageName={'route'} param={prepareRouteParam()}>Book</LinkButton>
            </article>)

            return content;
        }
        return <div/>
    }

    const prepareRouteParam = () => {
        const prepared = {};
        prepared.route = [];
        [...tableContent]
            .forEach(frag => {
                const price = getPriceByStartAndStopId(frag);
                const obj = frag;
                obj.price = price;
                prepared.route.push(obj);
            });

        prepared.priceInGeneral = currentPriceInfo.priceInGeneral;

        return prepared;
    }

    const getPriceByStartAndStopId = ({additionalData: {localStartStopTimeId, localEndStopTimeId}}) => {
        let price;
        if (Array.isArray(currentPriceInfo?.prices)) {
            price = currentPriceInfo?.prices
                .filter(s => s.startId === localStartStopTimeId && s.stopId === localEndStopTimeId)
                .map(s => s.price)[0];
        } else {
            price = 0;
        }
        return price;
    }

    const chooseRoute = async (content, index) => {
        setTableIndex(index);
        setTableContent(content);
        const priceInfo = await PriceService.getEstimatedPrice(getParams(content));
        setCurrentPriceInfo(priceInfo);
    }

    const tableResults = () => {
        return processResults().map((result, index) => <Table key={index} columns={RESULTS_COLUMNS}
                                                              data={result.map(el => el.result)}
                                                              onClick={() => chooseRoute(result, index)}
                                                              isActive={tableIndex === index}/>)
    }

    const getMainResultsTableData = () => {
        return isLoading ?
            <div className={"findresultshome__loading"}>
                <Loading/>
            </div>
            :
            tableResults();
    }

    return <main className={"findresultshome"}>
        <div className={"findresultshome__bg-gradient"}/>
        <section className={"findresultshome__summary"}>
            Results for trip
            {getSummaryText()}
        </section>
        <section className={"findresultshome__content"}>
            <div className={"findresultshome__picker"}>
                <header>Trip details</header>
                {parseContent()}
            </div>
            {getMainResultsTableData()}
        </section>
    </main>
}

export default FindResultsHome
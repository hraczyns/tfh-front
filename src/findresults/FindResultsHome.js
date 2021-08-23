import Navigation from "../navigation/Navigation";
import Table from '../table/Table'
import {useEffect, useMemo, useState} from "react";
import ReactHtmlParser from 'react-html-parser';
import './style.css'
import LinkButton from "../utils/LinkButton";


const FindResultsHome = ({history}) => {
    const [currentPriceInfo, setCurrentPriceInfo] = useState({});
    const [tableIndex, setTableIndex] = useState(-1);
    const [tableContent, setTableContent] = useState([]);
    const [saveResults, setSavedResults] = useState([]);
    const [resultsJson, setResultsJson] = useState({});
    const columns = useMemo(() => [
        {
            Header: '',
            accessor: 'no_content'
        },
        {
            Header: 'From',
            accessor: 'start'
        },
        {
            Header: 'To',
            accessor: 'end'
        },
        {
            Header: 'Arrival',
            accessor: 'arrivalTime'
        },
        {
            Header: 'Departure',
            accessor: 'departureTime'
        },
        {
            Header: 'Train',
            accessor: 'train'
        }
    ], []);

    const data = history.location.state;

    useEffect(() => {
        extractData()
    }, []);

    const extractData = async () => {
        const apiUrl = `http://localhost:8084/api/search?source=${data.source}&destination=${data.destination}&startTime=${data.startTime}`;
        fetch(apiUrl)
            .then(data => data.json())
            .then(async json =>  {
                console.log(json)
                if (!validate(json)) {
                    return [];
                }
                setResultsJson(json);
                const parts = json._embedded.journeyDTOList.map(s => s.partOfJourneys);
                for (const route of parts) {
                    for (const s of route) {
                        await fetch('http://localhost:8084/api/trains/images?train_id=' + s.train.id)
                            .then(data => data.text())
                            .then(trainImg => {
                                const resultObj = {
                                    start: s.start.cityDTO.name,
                                    arrivalTime: checkDate(s.start.departureTime),
                                    departureTime: checkDate(s.end.arrivalTime),
                                    end: s.end.cityDTO.name,
                                    train: ReactHtmlParser(trainImg)
                                };

                                const additionalData = {
                                    trainName: s.train.name,
                                    trainModel: s.train.model,
                                    trainUniqueName: s.train.representationUnique,
                                    generalStartId: json._embedded.journeyDTOList[0].source.id,
                                    generalDestId: json._embedded.journeyDTOList[0].destination.id,
                                    localStartId: s.start.cityDTO.id,
                                    localEndId: s.end.cityDTO.id,
                                    localStartStopTimeId: s.start.id,
                                    localEndStopTimeId: s.end.id
                                };

                                const resToSave = {
                                    id: -1,
                                    result: resultObj,
                                    additionalData: additionalData
                                };

                                setSavedResults(prevState => [...prevState, resToSave]);
                            })
                    }
                }
            })
            .catch(() => {
                alert("Something wrong happened");
            })
    }

    const getSummaryText = () => {
        if (!validate(resultsJson)) {
            return '';
        }
        const from = resultsJson._embedded.journeyDTOList[0].source.name;
        const to = resultsJson._embedded.journeyDTOList[0].destination.name;
        return <p className={"findresultshome__summary-cities"}>{`${from} - ${to}`}</p>
    }

    const checkDate = json => json.length > 20 ? '-' : json.replace('T', ' ');

    const validate = json => json && json._embedded &&
        json._embedded.journeyDTOList && json._embedded.journeyDTOList.every(s => s.resultId);

    const processResults = () => {
        const objToSplit = [...saveResults];

        if (!validate(resultsJson)) {
            return [];
        }
        const arr = [];
        let skipped = 0;
        let id = 1;
        resultsJson._embedded.journeyDTOList.forEach(resFromBackend => {
            const lengthOfElsOneRoute = resFromBackend.partOfJourneys.length;
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
                .map(frag => {
                    const startCity = frag.result.start;
                    const endCity = frag.result.end;
                    const trainName = frag.additionalData.trainName;
                    const trainModel = frag.additionalData.trainModel;
                    let price;
                    if (Array.isArray(currentPriceInfo.prices)) {
                        price = currentPriceInfo.prices
                            .filter(s => s.startId === frag.additionalData.localStartStopTimeId && s.stopId === frag.additionalData.localEndStopTimeId)
                            .map(s => s.price)[0];
                    } else {
                        price = 0;
                    }
                    return <article className={"findresultshome__details"}>
                        <div className={"findresultshome__details-element"}>
                            {`${startCity} - ${endCity}`}
                        </div>
                        <div className={"findresultshome__details-element"}>
                            <div>{'Train: '}</div>
                            <div>{' ' + trainName}</div>
                        </div>
                        <div className={"findresultshome__details-element"}>
                            <div>{'Train class: '}</div>
                            <div>{' ' + trainModel}</div>
                        </div>
                        <div className={"findresultshome__details-element"}>
                            <div>{'Price: '}</div>
                            <div>{` ${price} zl`}</div>
                        </div>
                        <div/>
                    </article>
                });

            content.push(<article className={"findresultshome__price-summary"}>
                <div>Summary price</div>
                <div>{`${currentPriceInfo.priceInGeneral} zl`}</div>
            </article>);
            content.push(<article className={"findresultshome__reserve-btn-wrapper"}>
                <LinkButton className={"findresultshome__reserve-btn"} to={"/reserve"}>Book</LinkButton>
            </article>)
            return content;

        }
        return <div/>
    }

    const getParams = () => {
        return [...tableContent]
            .map(frag => {
                return {
                    startId: frag.additionalData.localStartStopTimeId,
                    stopId: frag.additionalData.localEndStopTimeId
                }
            }).reduce((prev, curr, index) => {
                if (index === 0) {
                    prev += curr.startId + ',' + curr.stopId;
                } else {
                    prev += ',' + curr.startId + ',' + curr.stopId;
                }
                return prev;
            }, '');
    }

    const chooseRoute = async (content, index) => {
        setTableIndex(index);
        setTableContent(content);
        await fetch(`http://localhost:8084/api/payment/estimation?ids=${getParams()}`)
            .then(data => data.json())
            .then(json => {
                setCurrentPriceInfo(json);
            })
    }

    return <div>
        <Navigation/>
        <main className={"findresultshome"}>
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
                {processResults().map((result, index) => <Table key={index} columns={columns}
                                                                data={result.map(el => el.result)}
                                                                onClick={() => chooseRoute(result, index)}
                                                                isActive={tableIndex === index}/>)}

            </section>
        </main>
    </div>
}

export default FindResultsHome
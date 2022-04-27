import {useCallback, useEffect, useState} from "react";
import timetableService from "../../rest/functionalities/TimetableService";
import Table from "../../table/Table";
import {TIMETABLE} from "../../table/TableColumnsConst";
import timetableMapper from "./TimetableMapper";
import Loading from "../../loading/Loading";
import NotFound from "../../utils/NotFound";
import './timetable.css';

const DEFAULT_RESULT_PER_PAGE = 5;
const MAX_RESULTS_PER_PAGE = 50;

const range = (start, stop) =>
    Array(Math.ceil((stop - start))).fill(start).map((x, y) => x + y)

const Timetable = ({choice: {city, startTime, endTime}}) => {
    const [result, setResult] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [resultMetadata, setResultMetadata] = useState(null);
    const [resultPerPage, setResultPerPage] = useState(DEFAULT_RESULT_PER_PAGE);

    const getData = useCallback(async (pageNumber = 0) => {
        if (!city || !startTime || !endTime) return;
        setLoading(true);
        try {
            const data = await timetableService.getTimetable(city, startTime, endTime, pageNumber, resultPerPage);
            const result = timetableMapper.mapToTableData(data?.content);
            setResultMetadata({
                totalElements: data?.totalElements,
                numberOfElements: data?.size,
                totalPages: data?.totalPages,
                pageNumber: data?.number,
                first: data?.first,
                last: data?.last
            });
            setResult(result);
        } catch (e) {
            setResult([])
            setResultMetadata(null);
        } finally {
            setLoading(false);
        }
    }, [city, endTime, resultPerPage, startTime]);

    useEffect(() => {
        (async () => {
            await getData();
        })();
    }, [city, getData, startTime])

    if (isLoading) {
        return <div>
            <Loading/>
        </div>
    }

    if (!result) {
        return <NotFound/>
    }

    return <>
        <div className={"timetable-pagination-wrapper"}>
            <div className={"timetable-pagination"}>
                <button onClick={() => getData(0)} disabled={resultMetadata?.first ?? true}>&lt;&lt;</button>
                <button onClick={() => getData(resultMetadata?.pageNumber - 1)}
                        disabled={resultMetadata?.first ?? true}>&lt;</button>
                <button onClick={() => getData(resultMetadata?.pageNumber + 1)}
                        disabled={resultMetadata?.last ?? true}>&gt;</button>
                <button onClick={() => getData(resultMetadata?.totalPages - 1)}
                        disabled={resultMetadata?.last ?? true}>&gt;&gt;</button>
                <span>
                    Page <span
                    className={"timetable-pagination-number"}>{resultMetadata?.pageNumber || 0}</span> of <span
                    className={"timetable-pagination-number"}>{resultMetadata?.totalPages - 1 || 0}</span>
                </span>
                <span>Results on page
                    <select className={"timetable-pagination-select"} value={resultPerPage}
                            onChange={({target: {value}}) => setResultPerPage(value)}>
                        {range(DEFAULT_RESULT_PER_PAGE, MAX_RESULTS_PER_PAGE + 1)
                            .map((num, index) => <option key={index} value={num}>{num}
                            </option>)}
                    </select>
                </span>
            </div>
        </div>
        <Table data={result} columns={TIMETABLE}/>
    </>
}

export default Timetable;
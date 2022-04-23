import {useTable} from 'react-table';
import './table.css'

const Table = ({columns, data, onClick, isActive}) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({
        columns,
        data,
    })
    let generalClass;
    if (isActive) {
        generalClass = 'table table--chosen'
    } else {
        generalClass = 'table';
    }

    return <table {...getTableProps()} className={generalClass} onClick={onClick}>
        <thead>
        {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                    <th className={"table__head-column"}  {...column.getHeaderProps()}>{column.render('Header')}</th>
                ))}
            </tr>
        ))}
        </thead>
        <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
            prepareRow(row);
            return (
                <tr {...row.getRowProps()}>
                    {row.cells.map(cell => {
                        return <td className={"table__body-column"} {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    })}
                </tr>
            )
        })}
        </tbody>
    </table>
}

export default Table
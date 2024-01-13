import React, { useState } from "react";
import styled from "styled-components";
import { useTable, usePagination } from "react-table";
import { useQuery } from "react-query";
import { fetchPokemonData } from "./fetchData";

const TableContainer = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }

  .pagination {
    padding: 0.5rem;
  }
`;

const columns = [
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Url",
    accessor: "id",
  },
];

const trimData = (data = []) =>
  data.map(({ name, id }) => ({
    name,
    id,
  }));

const initialState = {
  queryPageIndex: 0,
  queryPageSize: 10,
  totalCount: null,
};

const PAGE_CHANGED = "PAGE_CHANGED";
const PAGE_SIZE_CHANGED = "PAGE_SIZE_CHANGED";
const TOTAL_COUNT_CHANGED = "TOTAL_COUNT_CHANGED";

const reducer = (state, { type, payload }) => {
  switch (type) {
    case PAGE_CHANGED:
      return {
        ...state,
        queryPageIndex: payload,
      };
    case PAGE_SIZE_CHANGED:
      return {
        ...state,
        queryPageSize: payload,
      };
    case TOTAL_COUNT_CHANGED:
      console.log("Total count changed to be - ", payload);
      return {
        ...state,
        totalCount: Number(payload),
      };
    default:
      throw new Error(`Unhandled action type: ${type}`);
  }
};

function FreshTable() {
  const [dataList, setDataList] = useState([]);
  const [headers, setHeaders] = useState("");
  const [{ queryPageIndex, queryPageSize, totalCount }, dispatch] =
    React.useReducer(reducer, initialState);

  const { isLoading, error, data, isSuccess } = useQuery(
    ["pokemons", queryPageIndex, queryPageSize],
    () =>
      fetchPokemonData(queryPageIndex, queryPageSize, setDataList, setHeaders),
    {
      keepPreviousData: true,
      staleTime: Infinity,
    }
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    // Get the state from the instance
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: isSuccess ? dataList : [],
      initialState: {
        pageIndex: queryPageIndex,
        pageSize: queryPageSize,
      },
      manualPagination: true, // Tell the usePagination
      // hook that we'll handle our own data fetching
      // This means we'll also have to provide our own
      // pageCount.
      pageCount: isSuccess ? Math.ceil(totalCount / queryPageSize) : null,
    },
    usePagination
  );
  console.log("pageIndex: " + pageIndex);
  React.useEffect(() => {
    dispatch({ type: PAGE_CHANGED, payload: pageIndex });
  }, [pageIndex]);

  React.useEffect(() => {
    dispatch({ type: PAGE_SIZE_CHANGED, payload: pageSize });
    gotoPage(0);
  }, [pageSize, gotoPage]);

  React.useEffect(() => {
    console.log("Data updated -", data?.data.length);
    if (data?.data?.length) {
      dispatch({
        type: TOTAL_COUNT_CHANGED,
        payload: data.data.length,
      });
    }
  }, [data]);

  React.useEffect(() => {
    console.log("DataList in useEffect:", JSON.stringify(dataList));
    console.log("Headers in useEffect:", headers["x-pagination-per-page"]);
  }, [dataList, headers]);

  if (error) {
    return <p>Error</p>;
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <TableContainer>
      {isSuccess ? (
        <>
          <table {...getTableProps()}>
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()}>
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {console.log("page:" + page)}
              {page.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="pagination">
            <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
              {"<<"}
            </button>{" "}
            <button onClick={() => previousPage()} disabled={!canPreviousPage}>
              {"<"}
            </button>{" "}
            <button onClick={() => nextPage()} disabled={!canNextPage}>
              {">"}
            </button>{" "}
            <button
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
            >
              {">>"}
            </button>{" "}
            <span>
              Page{" "}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>{" "}
            </span>
            <span>
              | Go to page:{" "}
              <input
                type="number"
                value={pageIndex + 1}
                onChange={(e) => {
                  const pageNo = e.target.value
                    ? Number(e.target.value) - 1
                    : 0;
                  gotoPage(pageNo);
                }}
                style={{ width: "100px" }}
              />
            </span>{" "}
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
              }}
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
        </>
      ) : null}
    </TableContainer>
  );
}

export default FreshTable;

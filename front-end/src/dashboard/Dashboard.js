import React, { useEffect, useState } from "react";
import { listReservations, listTables, finishTable, updateStatus } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import {previous, next, today} from "../utils/date-time"
import useQuery from "../utils/useQuery";
import {useHistory} from "react-router"
import {eachReservation} from "../utils/helpers"



/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  const [finishError, setFinishError] = useState(null);
  const [cancelError, setCancelError] = useState(null);
  const queryDate = useQuery().get("date");
  const history = useHistory()
  if(queryDate){
    date = queryDate
  }

  useEffect(loadDashboard, [date]);

function loadDashboard() {
  setReservations(["Loading reservations..."])
  setTables(["Loading tables..."]);
  const abortController = new AbortController();
  setReservationsError(null);
  setTablesError(null)
  listReservations({ date }, abortController.signal)
    .then(setReservations)
    .catch(setReservationsError);
  listTables()
    .then(setTables)
    .catch(setTablesError)
  return () => abortController.abort();
}

const handleFinish = async (table) => {
  console.log(table)
  if (window.confirm("Is this table ready to seat new guests? This cannot be undone.")){
    try{
      await finishTable(table.table_id)
      history.go(0);
    } catch (error) {
      setFinishError(error)
    }
  }
}

  const handleCancel = async (reservation) => {
    console.log(reservation);
    if (
      window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      )
    ) {
      try {
        await updateStatus(reservation.reservation_id, "cancelled");
        history.go(0);
      } catch (err) {
        setCancelError(err);
      }
    }
  };



function eachTable(tables) {
  const separateTables = tables.map((table) => {
    if(table.reservation_id !== null){return (
      <div key={table.table_id}>
        {JSON.stringify(table)}
        <p data-table-id-status={`${table.table_id}`}>Occupied</p>
        <button
          data-table-id-finish={table.table_id}
          onClick={() => handleFinish(table)}
        >
          Finish
        </button>
        <ErrorAlert error={finishError} />
      </div>
    )}else{
    return (
      <div key={table.table_id}>
        {JSON.stringify(table)}
        <p data-table-id-status={`${table.table_id}`}>Free</p>
      </div>
    );}}
  )
  return separateTables
}

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date {date}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      {eachReservation(reservations, handleCancel, cancelError)}
      <div>
        <button
          type="button"
          onClick={() => {
            history.replace(`/dashboard/?date=${previous(date)}`);
          }}
          className="btn btn-primary btn-arrow-left"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => {
            history.replace(`/dashboard/?date=${today()}`);
          }}
          className="btn btn-primary btn-arrow-left"
        >
          Today
        </button>
        <button
          type="button"
          onClick={() => {
            history.replace(`/dashboard/?date=${next(date)}`);
          }}
          className="btn btn-primary btn-arrow-right"
        >
          Next
        </button>
        <ErrorAlert error={tablesError} />
        <div>
          {eachTable(tables)}
        </div>
      </div>
    </main>
  );
}

export default Dashboard;

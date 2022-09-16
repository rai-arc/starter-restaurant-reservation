import React, { useEffect, useState } from "react";
import {
  listReservations,
  listTables,
  finishTable,
  updateStatus,
} from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { previous, next, today } from "../utils/date-time";
import useQuery from "../utils/useQuery";
import { useHistory } from "react-router";
import { eachReservation } from "../utils/helpers";
import { eachTable } from "../utils/helpers";

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
  const history = useHistory();
  if (queryDate) {
    date = queryDate;
  }

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    setTablesError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables().then(setTables).catch(setTablesError);
    return () => abortController.abort();
  }

  //This handler brings up a confirmation window to set a reservation to finished and a free a table
  const handleFinish = async (table) => {
    console.log(table);
    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    ) {
      try {
        await finishTable(table.table_id);
        history.go(0);
      } catch (error) {
        setFinishError(error);
      }
    }
  };

  //This handler brings up a confirmation to cancel a reservation, which is filtered out of reservations
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

  return (
    <main>
      <div className="d-md-flex mb-3 justify-content-center flex-column">
        <h1 className="d-flex justify-content-center">Dashboard</h1>
        <h4 className="mb-2 text-center">Reservations for date {date}</h4>
        <div className="d-flex justify-content-center">
          <button
            type="button"
            onClick={() => {
              history.replace(`/dashboard/?date=${previous(date)}`);
            }}
            className="btn btn-primary btn-arrow-left mx-3"
          >
            ← Previous
          </button>
          <button
            type="button"
            onClick={() => {
              history.replace(`/dashboard/?date=${today()}`);
            }}
            className="btn btn-primary mx-3"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => {
              history.replace(`/dashboard/?date=${next(date)}`);
            }}
            className="btn btn-primary btn-arrow-right mx-3"
          >
            Next →
          </button>
        </div>
      </div>
      <ErrorAlert error={reservationsError} />
      <div className="d-flex justify-content-center row">
        {eachReservation(reservations, handleCancel, cancelError)}
      </div>
      <div>
        <h4 className="text-center mt-5">Tables</h4>
        <ErrorAlert error={tablesError} />
        <table className="table table-striped table-bordered table-bg text-light">
          <thead>
            <tr>
              <th scope="col">Table name</th>
              <th scope="col">Capacity</th>
              <th scope="col">Status</th>
              <th scope="col">Finish?</th>
            </tr>
          </thead>
          <tbody>{eachTable(tables, handleFinish, finishError)}</tbody>
        </table>
      </div>
    </main>
  );
}

export default Dashboard;

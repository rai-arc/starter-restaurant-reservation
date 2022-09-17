import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { listTables, seatReservation, getReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function ReservationSeat() {
  const history = useHistory();
  const { reservation_id } = useParams();
  const [currentReservation, setCurrentReservation] = useState([]);
  const [reservationError, setReservationError] = useState(null);
  const [seatError, setSeatError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  const [formData, setFormData] = useState({
    table_id: null,
    reservation_id: reservation_id,
  });

  useEffect(loadTables, [reservation_id]);

  function loadTables() {
    const abortController = new AbortController();
    setTablesError(null);
    getReservation(reservation_id)
      .then(setCurrentReservation)
      .catch(setReservationError);
    listTables().then(setTables).catch(setTablesError);
    return () => abortController.abort();
  }

  const handleSelectChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setSeatError(null);
    if (formData.table_id == null)
      return window.alert("Please select a table.");
    try {
      formData.capacity = Number(formData.capacity);
      await seatReservation(formData);
      history.push(`/dashboard`);
    } catch (error) {
      if (error.name !== "AbortError") setSeatError(error);
    }
  }

  function tableOptions(tables) {
    const separateTables = tables.map((table) => (
      <option key={table.table_id} value={table.table_id}>
        {table.table_name} - {table.capacity}
      </option>
    ));
    return separateTables;
  }

  return (
    <main>
      <div className="d-md-flex mb-3 justify-content-center flex-column">
        <h1 className="text-center mb-4">New Seating</h1>
        <div className="d-flex flex-column">
          <h3 className="text-center">
            Seating reservation for {currentReservation.last_name},{" "}
            {currentReservation.first_name}
          </h3>
          <h4 className="text-center mb-4">
            Party of {currentReservation.people}
          </h4>
        </div>
        <div className="d-flex justify-content-center">
          <ErrorAlert error={reservationError} />
          <ErrorAlert error={tablesError} />
          <ErrorAlert error={seatError} />
          <form
            onSubmit={handleSubmit}
            className="d-flex justify-content-center flex-column"
          >
            <select
              name="table_id"
              onChange={handleSelectChange}
              className="mb-4"
            >
              <option name="blank" key="null" value={null}>
                Please select a table.
              </option>
              {tableOptions(tables)}
            </select>
            <div className="d-flex justify-content-center">
              <button className="btn btn-primary mr-1" type="submit">
                Submit
              </button>
              <button
                className="btn btn-secondary mr-1"
                onClick={() => history.goBack(1)}
                type="button"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default ReservationSeat;

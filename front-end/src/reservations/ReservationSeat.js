import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { listTables, seatReservation} from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function ReservationSeat() {
  const history = useHistory();
  const {reservation_id} = useParams();
  const [seatError, setSeatError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null)
  const [formData, setFormData] = useState({
    table_id: null,
    reservation_id: reservation_id,
  });

  useEffect(loadTables, []);

  function loadTables() {
    setTables(["Loading tables..."]);
    const abortController = new AbortController();
    setTablesError(null);
    listTables().then(setTables).catch(setTablesError);
    return () => abortController.abort();
  }

  const handleSelectChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    })
  console.log(formData);}

  async function handleSubmit(event) {
    event.preventDefault();
    setSeatError(null);
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
      <option value={table.table_id}>{table.table_name} - {table.capacity}</option>
    ))
    return separateTables
  }

  return (
    <main>
      <h1>New Seating</h1>
      <div>
        <ErrorAlert error={tablesError} />
        <ErrorAlert error={seatError} />
        <form onSubmit={handleSubmit}>
          <select name="table_id" onChange={handleSelectChange}>
            {tableOptions(tables)}
          </select>
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
        </form>
      </div>
    </main>
  );
}

export default ReservationSeat;

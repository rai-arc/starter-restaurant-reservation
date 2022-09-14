import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { listReservations, updateStatus } from "../utils/api";
import { useHistory } from "react-router";
import { eachReservation } from "../utils/helpers";

export default function Search() {
  const [mobile_number, setMobileNumber] = useState([""]);
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [cancelError, setCancelError] = useState(null);
  const [noResults, setNoResults] = useState("Please enter a number");
  const history = useHistory();

  const handleInputChange = (event) =>
    setMobileNumber(event.target.value);

  function loadReservations() {
    const abortController = new AbortController();
    setReservations(["Loading reservations..."]);
    setReservationsError(null);
    listReservations({ mobile_number }, abortController.signal)
      .then(setReservations)
      .then(setNoResults("No reservations found"))
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    loadReservations();
  };

  const handleCancel = async (reservation) => {
    console.log(reservation)
    if (
      window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      )
    ) {
      try {
        await updateStatus(reservation.reservation_id, "cancelled")
        history.go(0);
      } catch (err) {
        setCancelError(err);
      }
    }
  };

  const results = reservations.length ? (
    <>
        <h2>Search Results:</h2>
        {eachReservation(reservations, handleCancel, cancelError)}</>
  ) : (
    <>{noResults}</>
  )

  return (
    <main>
      <div>
        <h2>Search</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <label className="search">Mobile Number</label>
          <input
            id="mobile_number"
            name="mobile_number"
            type="phone"
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Find</button>
      </form>
      {results}
      <ErrorAlert error={reservationsError}/>
    </main>
  );
}
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

  const handleInputChange = (event) => setMobileNumber(event.target.value);

  function loadReservations() {
    const abortController = new AbortController();
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

  const results = reservations.length ? (
    <>
      <div className="d-flex justify-content-center row">
        {eachReservation(reservations, handleCancel, cancelError)}
      </div>
    </>
  ) : (
    <div className="text-center">{noResults}</div>
  );

  return (
    <main>
      <div className="d-flex justify-content-center row">
        <div className="col-md-4 text-center">
          <h1>Search</h1>
          <form className="d-flex flex-column" onSubmit={handleSubmit}>
            <label className="search">Please Enter Mobile Number</label>
            <input
              id="mobile_number"
              name="mobile_number"
              type="phone"
              onChange={handleInputChange}
              required
            />
            <button type="submit">Find</button>
          </form>
        </div>
      </div>
      <h2 className="text-center my-3">Search Results:</h2>
      {results}
      <ErrorAlert error={reservationsError} />
    </main>
  );
}

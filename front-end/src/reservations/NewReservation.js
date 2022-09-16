import React, { useState } from "react";
import { useHistory } from "react-router";
import { createReservation } from "../utils/api";
import FormReservation from "./FormReservation";
import ErrorAlert from "../layout/ErrorAlert";

function NewReservation() {
  const history = useHistory();
  const [newReservationError, setNewReservationError] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 0,
  });

  async function handleSubmit(event) {
    event.preventDefault();
    setNewReservationError(null);
    const abortController = new AbortController();
    try {
      formData.people = Number(formData.people);
      await createReservation(formData);
      const formDate = formData.reservation_date;
      history.push(`/dashboard?date=${formDate}`);
    } catch (error) {
      if (error.name !== "AbortError") setNewReservationError(error);
    }
    return () => abortController.abort();
  }

  return (
    <main>
      <h1 className="d-flex justify-content-center">New Reservation</h1>
      <ErrorAlert error={newReservationError} />
      <div className="d-md-flex mb-3 justify-content-center">
        <FormReservation
          handleSubmit={handleSubmit}
          formData={formData}
          setFormData={setFormData}
        />
      </div>
    </main>
  );
}

export default NewReservation;

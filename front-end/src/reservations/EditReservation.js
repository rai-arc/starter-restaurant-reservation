import React, { useEffect, useState } from "react";
import { editReservation, getReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory, useParams } from "react-router";
import formatReservationDate from "../utils/format-reservation-date";
import formatReservationTime from "../utils/format-reservation-time";
import FormReservation from "./FormReservation";

export default function EditReservation() {
  const history = useHistory();
  const { reservation_id } = useParams();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 0,
  });
  const [editReservationError, setEditReservationError] = useState(null);

  useEffect(() => {
    async function getCurrentReservation() {
      const abortController = new AbortController();
      try {
        const response = await getReservation(reservation_id);
        formatReservationDate(response);
        formatReservationTime(response);
        setFormData(response);
      } catch (err) {
        setEditReservationError(err);
      }
      return () => abortController.abort();
    }
    getCurrentReservation();
    
  }, [reservation_id]);

  async function handleSubmit(event) {
    event.preventDefault();
    setEditReservationError(null);
    const abortController = new AbortController();
    try {
      formData.people = Number(formData.people);
      const editedReservation = await editReservation(formData, reservation_id);
      console.log(editedReservation);
      console.log(editedReservation.error);
      const formDate = formData.reservation_date;
      history.push(`/dashboard?date=${formDate}`);
    } catch (error) {
      if (error.name !== "AbortError") setEditReservationError(error);
    }
    return () => abortController.abort();
  }

  return (
    <main>
      <h1 className="d-flex justify-content-center">Edit Reservation</h1>
      <ErrorAlert error={editReservationError} />
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

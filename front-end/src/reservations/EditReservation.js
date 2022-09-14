import React, { useEffect, useState } from "react";
import { editReservation, getReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory, useParams } from "react-router";
import formatReservationDate from "../utils/format-reservation-date";
import formatReservationTime from "../utils/format-reservation-time";

export default function EditReservation(){
  const history = useHistory();
  const {reservation_id} = useParams();
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
      try{
        const response = await getReservation(reservation_id)
        formatReservationDate(response)
        formatReservationTime(response)
        setFormData(response)
      }catch (err) {
        setEditReservationError(err)
      }
    }
    getCurrentReservation()
  }, [])

  const handleInputChange = (event) =>
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });

  async function handleSubmit(event) {
    event.preventDefault();
    setEditReservationError(null);
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
  }


    return (
      <main>
        <h1>Edit Reservation</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label for="first_name" className="col-sm-2 col-form-label">
              First name
            </label>
            <input
              required
              type="text"
              name="first_name"
              id="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
            />
            <label for="last_name" className="col-sm-2 col-form-label">
              Last name
            </label>
            <input
              required
              type="text"
              name="last_name"
              id="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
            />
            <label for="mobile_number" className="col-sm-2 col-form-label">
              Mobile number
            </label>
            <input
              required
              type="tel"
              id="mobile_number"
              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}|[0-9]{3}[0-9]{3}[0-9]{4}"
              name="mobile_number"
              value={formData.mobile_number}
              onChange={handleInputChange}
            />
            <label for="reservation_date" className="col-sm-2 col-form-label">
              Date of reservation
            </label>
            <input
              required
              type="date"
              id="reservation_date"
              name="reservation_date"
              value={formData.reservation_date}
              onChange={handleInputChange}
            />
            <label for="reservation_time" className="col-sm-2 col-form-label">
              Time of reservation
            </label>
            <input
              required
              type="time"
              id="reservation_time"
              name="reservation_time"
              value={formData.reservation_time}
              onChange={handleInputChange}
            />
            <label for="people" className="col-sm-2 col-form-label">
              Number of people in the party
            </label>
            <input
              required
              type="number"
              id="people"
              name="people"
              value={formData.people}
              onChange={handleInputChange}
            />
            <div>
              <ErrorAlert error={editReservationError} />
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
          </div>
        </form>
      </main>
    );
}
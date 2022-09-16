import React, { useState } from "react";
import { useHistory } from "react-router";
import { createReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function NewReservation() {
  const history = useHistory();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 0,
  });
  const [newReservationError, setNewReservationError] = useState(null);

  const handleInputChange = (event) =>
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });

  async function handleSubmit(event) {
    event.preventDefault();
    setNewReservationError(null);
    try {
      formData.people = Number(formData.people);
      await createReservation(formData);
      const formDate = formData.reservation_date;
      history.push(`/dashboard?date=${formDate}`);
    } catch (error) {
      if (error.name !== "AbortError") setNewReservationError(error);
    }
  }

  return (
    <main>
      <h1 className="d-flex justify-content-center">New Reservation</h1>
      <div className="d-md-flex mb-3 justify-content-center">
        <form onSubmit={handleSubmit} className="col-sm-4">
          <div className="form-group">
            <label for="first_name" className="col-form-label">
              First name
            </label>
            <input
              required
              type="text"
              name="first_name"
              id="first_name"
              onChange={handleInputChange}
              className="form-control"
              placeholder="First name"
            />
            <label for="last_name" className="col-form-label">
              Last name
            </label>
            <input
              required
              type="text"
              name="last_name"
              id="last_name"
              onChange={handleInputChange}
              className="form-control"
              placeholder="Last name"
            />
            <label for="mobile_number" className="col-form-label">
              Mobile number
            </label>
            <input
              required
              type="tel"
              id="mobile_number"
              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}|[0-9]{3}[0-9]{3}[0-9]{4}"
              name="mobile_number"
              onChange={handleInputChange}
              className="form-control"
              placeholder="###-###-####"
            />
            <label for="reservation_date" className="col-form-label">
              Date of reservation
            </label>
            <input
              required
              type="date"
              id="reservation_date"
              name="reservation_date"
              onChange={handleInputChange}
              className="form-control"
            />
            <label for="reservation_time" className="col-form-label">
              Time of reservation
            </label>
            <input
              required
              type="time"
              id="reservation_time"
              name="reservation_time"
              onChange={handleInputChange}
              className="form-control"
            />
            <label for="people" className="col-form-label">
              Number of people in the party
            </label>
            <input
              required
              type="number"
              id="people"
              name="people"
              onChange={handleInputChange}
              className="form-control"
              placeholder="#"
            />
            <div className="mt-3">
              <ErrorAlert error={newReservationError} />
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
      </div>
    </main>
  );
}

export default NewReservation;

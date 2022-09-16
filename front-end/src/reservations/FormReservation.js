import React from "react";
import { useHistory } from "react-router";


export default function FormReservation({handleSubmit, formData, setFormData}) {
  const history = useHistory();
  const handleInputChange = (event) =>
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });

  return (
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
          value={formData.first_name}
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
          value={formData.last_name}
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
          value={formData.mobile_number}
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
          value={formData.reservation_date}
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
          value={formData.reservation_time}
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
          value={formData.people}
          className="form-control"
          placeholder="#"
        />
        <div className="mt-3">
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
  );
}

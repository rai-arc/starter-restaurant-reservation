import React, { useState } from "react";
import { useHistory } from "react-router";
import { createTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";


function NewTable() {
  const history = useHistory();
  const [formData, setFormData] = useState({
    table_name: "",
    capacity: 0,
  });
  const [newTableError, setNewTableError] = useState(null);

  const handleInputChange = (event) =>
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });

  async function handleSubmit(event) {
    event.preventDefault();
    setNewTableError(null);
    try {
      formData.capacity = Number(formData.capacity);
      const newTable = await createTable(formData);
      console.log(newTable);
      console.log(newTable.error);
      history.push(`/dashboard`);
    } catch (error) {
      if (error.name !== "AbortError") setNewTableError(error);
    }
  }

  return (
    <main>
      <h1 className="d-flex justify-content-center">New Table</h1>
      <div className="d-md-flex mb-3 justify-content-center">
        <form onSubmit={handleSubmit} className="col-sm-4">
          <div className="form-group">
            <label for="table_name" className="col-form-label">
              Table name
            </label>
            <input
              required
              type="text"
              name="table_name"
              id="table_name"
              onChange={handleInputChange}
              className="form-control"
              placeholder="Table name"
            />
            <label for="capacity" className="col-form-label">
              Capacity
            </label>
            <input
              required
              type="number"
              name="capacity"
              id="capacity"
              onChange={handleInputChange}
              className="form-control"
              placeholder="#"
            />
            <div>
              <ErrorAlert error={newTableError} />
              <div className="mt-5">
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
          </div>
        </form>
      </div>
    </main>
  );
}

export default NewTable;

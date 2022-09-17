import ErrorAlert from "../layout/ErrorAlert";

//This file contains mapping functions for reservations and tables to conserve space and make the code more readable
//Only the eachReservation function is used in multiple components

export function eachReservation(reservations, handleCancel, cancelError) {
  function formatPhoneNumber(phoneNumberString) {
    const cleaned = ("" + phoneNumberString).replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return "(" + match[1] + ") " + match[2] + "-" + match[3];
    }
    return null;
  }

  const filteredReservations = reservations.filter((reservation) => {
    return reservation.status !== "cancelled";
  });
  const separateReservations = filteredReservations.map((reservation) => {
    let seatButton = (
      <button
        className="btn btn-warning strikethrough"
        onClick={() =>
          window.alert(`A reservation must be "booked" to seat it.`)
        }
      >
        Seat
      </button>
    );
    let cancelButton = (
      <button
        data-reservation-id-cancel={reservation.reservation_id}
        onClick={() => handleCancel(reservation)}
        className="btn btn-danger"
      >
        Cancel
      </button>
    );
    if (reservation.status === "booked") {
      seatButton = (
        <a href={`/reservations/${reservation.reservation_id}/seat`}>
          <button className="btn btn-primary">Seat</button>
        </a>
      );
    }
    if (reservation.status === "finished") {
      cancelButton = (
        <button
          data-reservation-id-cancel={reservation.reservation_id}
          onClick={() =>
            window.alert(
              "This reservation cannot be cancelled because it is already finished."
            )
          }
          className="btn btn-warning strikethrough"
        >
          Cancel
        </button>
      );
    }
    return (
      <div
        key={reservation.reservation_id}
        className="card m-4 reservation-card text-white"
      >
        <div className="card-body">
          <h4 className="card-title">
            {reservation.last_name}, {reservation.first_name}
          </h4>
          <h6>{formatPhoneNumber(reservation.mobile_number)}</h6>
          <h5>Party of {reservation.people}</h5>
          <h5>Reserved for: {reservation.reservation_time}</h5>
          <p data-reservation-id-status={reservation.reservation_id}>
            This reservation is {reservation.status}
          </p>
          <div className="d-flex justify-content-around">
            {seatButton}
            <a href={`/reservations/${reservation.reservation_id}/edit`}>
              <button className="btn btn-secondary">Edit</button>
            </a>
            {cancelButton}
          </div>
          <>{cancelError}</>
        </div>
      </div>
    );
  });
  return separateReservations;
}

export function eachTable(tables, handleFinish, finishError) {
  const separateTables = tables.map((table) => {
    let tableStatus = (
      <>
        <td>
          <p data-table-id-status={`${table.table_id}`}>Free</p>
        </td>{" "}
        <td>
          <button
            data-table-id-finish={table.table_id}
            onClick={() => window.alert("This table is already free.")}
            className="strikethrough btn btn-warning"
          >
            Finish
          </button>
        </td>
      </>
    );
    if (table.reservation_id !== null) {
      tableStatus = (
        <>
          <td>
            <p data-table-id-status={`${table.table_id}`}>Occupied</p>
          </td>
          <td>
            <button
              data-table-id-finish={table.table_id}
              onClick={() => handleFinish(table)}
              className="btn btn-success"
            >
              Finish
            </button>
          </td>
        </>
      );
    }
    return (
      <tr key={table.table_id}>
        <th scope="row">{table.table_name}</th>
        <td>{table.capacity}</td>
        {tableStatus}
        <ErrorAlert error={finishError} />
      </tr>
    );
  });
  return separateTables;
}

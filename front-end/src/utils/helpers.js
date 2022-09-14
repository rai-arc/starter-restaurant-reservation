export function eachReservation(reservations, handleCancel, cancelError) {
  const filteredReservations = reservations.filter((reservation) => {
    return reservation.status !== "cancelled";
  });
  const separateReservations = filteredReservations.map((reservation) => {
    if (reservation.status === "booked") {
      return (
        <div key={reservation.reservation_id}>
          {JSON.stringify(reservation)}
          <p data-reservation-id-status={reservation.reservation_id}>
            {reservation.status}
          </p>
          <a href={`/reservations/${reservation.reservation_id}/seat`}>Seat</a>
          <a href={`/reservations/${reservation.reservation_id}/edit`}>Edit</a>
          <button
            data-reservation-id-cancel={reservation.reservation_id}
            onClick={() => handleCancel(reservation)}
          >
            Cancel
          </button>
          <>{cancelError}</>
        </div>
      );
    } else {
      return (
        <div key={reservation.reservation_id}>
          {JSON.stringify(reservation)}
          <p data-reservation-id-status={reservation.reservation_id}>
            {reservation.status}
          </p>
          <a href={`/reservations/${reservation.reservation_id}/edit`}>Edit</a>
          <button
            data-reservation-id-cancel={reservation.reservation_id}
            onClick={() => handleCancel(reservation)}
          >
            Cancel
          </button>
          <>{cancelError}</>
        </div>
      );
    }
  });
  return separateReservations;
}

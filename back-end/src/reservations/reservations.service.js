const knex = require("../db/connection");

function list() {
  return knex("reservations")
    .select("*")
    .orderBy("reservation_date", "asc")
    .orderBy("reservation_time", "asc");
}  

function listToday(todaysDate) {
    return knex("reservations")
      .select("*")
      .where({ reservation_date: todaysDate })
      .whereNot({ status: "finished" })
      .orderBy("reservation_time", "asc");
  }

function search(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

function read(reservationId) {
  return knex("reservations")
    .select("*")
    .where({ "reservation_id": reservationId })
    .first();
}

function create(reservation) {
  return knex("reservations")
    .insert(reservation)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

function updateStatus(updatedStatus) {
  return knex("reservations")
    .where({ reservation_id: updatedStatus.reservation_id })
    .update(updatedStatus, "*")
    .then((updatedRecords) => updatedRecords[0])
}

function edit(editedReservation) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: editedReservation.reservation_id })
    .update(editedReservation, "*")
    .then((editedRecords) => editedRecords[0]);
}

module.exports = {
  list,
  listToday,
  read,
  create,
  updateStatus,
  search,
  edit,
};
  
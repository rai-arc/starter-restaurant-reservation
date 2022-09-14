const knex = require("../db/connection");

function list() {
  return knex("tables")
    .select("*")
    .orderBy("table_name", "asc")
}

function create(table) {
  return knex("tables")
    .insert(table)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

function read(tableId) {
  return knex("tables")
    .select("*")
    .where({ "table_id": tableId })
    .first();
}

function reservationCheck(reservationId) {
  return knex("reservations")
    .select("*")
    .where({ "reservation_id": reservationId})
    .first();
}

async function update(updatedTable, reservationId) {
  try{await knex.transaction(async (trx) => {
    await trx("tables")
      .where({ "table_id": updatedTable.table_id })
      .update(updatedTable, "*")
      .then((updatedTableRecords) => updatedTableRecords[0])
    await trx("reservations")
        .where({ reservation_id: reservationId })
        .update({status: "seated"}, "*")
        .then((updatedReservationRecords) => updatedReservationRecords[0])
})}catch(err){
  console.error(err)
}}

async function clear(tableId, reservationId){
  try {await knex.transaction(async (trx) => {
    await trx("tables")
      .select("*")
      .where({ table_id: tableId })
      .update({ reservation_id: null })
    await trx("reservations")
      .select("*")
      .where({ reservation_id: reservationId })
      .update({ status: "finished" })
  })}catch(err){
    console.error(err)
  }
}


module.exports = {
  list,
  create,
  read,
  reservationCheck,
  update,
  clear,
};

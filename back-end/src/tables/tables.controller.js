/**
 * List handler for table resources
 */
const service = require("./tables.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
 
function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;
  const properties = [
    "table_name",
    "capacity",
  ];

  if (!data) {
      return next({
        status: 400,
        message: `Data is required.`,
      });
  }
  properties.forEach((property) => {
    if (!data[property]) {
      return next({
        status: 400,
        message: `A '${property}' property is required.`,
      });
    }
  });

  if (data.table_name.length <= 1) {
    return next({
      status: 400,
      message: `Property "table_name" must be two or more characters.`,
    });
  }

  if (typeof data.capacity !== "number") {
    return next({
      status: 400,
      message: `Property "capacity" must be a number.`,
    });
  }

  next();
}

async function tableExists(req, res, next) {
  const tableId = req.params.table_id;
  const table = await service.read(tableId);
  if (table) {
    res.locals.table = table;
    return next();
  }
  return next({ status: 404, message: `Table ${tableId} cannot be found.` });
}

async function tableFree(req, res,next) {
  const table = res.locals.table;
  if (table.reservation_id === null){
    return next({
      status: 400,
      message: `${table.table_name} is not occupied.`,
    });
  }
  next();
}

async function tableCheck(req, res, next) {
  const table = res.locals.table
  if (table.reservation_id !== null) {
    return next({
      status: 400,
      message: `${table.table_name} is already occupied.`,
    });
  }
  if(!req.body.data){
    return next({ status: 400, message: `Data cannot be found.` });
  }
  if (!req.body.data.reservation_id) {
    return next({ status: 400, message: `Data requires reservation_id.` });
  }
  const resCheck = await service.reservationCheck(req.body.data.reservation_id)
  if (!resCheck){
    return next({ status: 404, message: `Reservation id ${req.body.data.reservation_id} does not exist`})
  }
  if (resCheck.people > table.capacity){
    return next({ status: 400, message: `${table.table_name} does not have sufficient capacity.`})
  }
  if (resCheck.status === "seated"){
    return next({
      status: 400,
      message: `Reservation ${resCheck.reservation_id} is already seated.`,
    });
  }
  return next()
}

async function list(req, res) {
    const data = await service.list();
    res.json({ data: data });
}

async function create(req, res, next) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data: data });
}

async function update(req, res, next) {
  const updatedTable = {
    ...req.body.data,
    table_id: res.locals.table.table_id,
  };
  const {reservation_id} = req.body.data;
  const data = await service.update(updatedTable, reservation_id);
  res.status(200).json({ data: data });
}

async function clearTable(req, res, next){
  const { table_id } = req.params;
  const reservationId = res.locals.table.reservation_id
  const data = await service.clear(table_id, reservationId)
  res.status(200).json({ data: data})
}
  
module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasOnlyValidProperties,
    asyncErrorBoundary(create)
  ],
  update: [
    asyncErrorBoundary(tableExists),
    tableCheck,
    asyncErrorBoundary(update)
  ],
  delete: [
    asyncErrorBoundary(tableExists),
    tableFree,
    asyncErrorBoundary(clearTable)
  ]
};
  
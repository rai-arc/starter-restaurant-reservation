/**
 * List handler for reservation resources
 */
const service = require("./reservations.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;
  const properties = ["first_name", "last_name", "mobile_number", "reservation_date", "reservation_time", "people"]
  const today = new Date();
  const timeNow = today.toLocaleTimeString("en-GB");
  const todayConverted = today.toISOString().split('T')[0]
  
  if(!data){
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
  if(!data.status){
    data.status = "booked"
  }
  const dateRegex = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/
  const timeRegex = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/

  if (!(dateRegex.test(data.reservation_date))){
    return next({
      status: 400,
      message: `Property "reservation_date" must be a valid date.`,
    });
  }

  if(!(timeRegex.test(data.reservation_time))){
    return next({
      status: 400,
      message: `Property "reservation_time" must be a valid time.`
    })
  }

  if (typeof data.people !== "number") {
    return next({
      status: 400,
      message: `Property "people" must be a number.`,
    });
  }

  //Future date validation
  if (data.reservation_date < todayConverted){
    return next({
      status: 400,
      message: `Reservation must be in the future.`,
    });
  }

  if (data.reservation_date == todayConverted && data.reservation_time + ":00" < timeNow) {
    return next({
      status: 400,
      message: `Reservation time must be in the future.`,
    });
  }  

const requestedDate = new Date(data.reservation_date.replace(/-/g, "/"));
  if(requestedDate.getDay() == 2){
    return next({
      status: 400,
      message: `The restaurant is closed on Tuesday.`,
    });
  }

  if(data.reservation_time + ":00" < "10:30:00"){
    return next({
      status: 400,
      message: `The restaurant is closed before 10:30.`,
    });
  }

  if(data.reservation_time + ":00" > "21:30:00"){
    return next({
      status: 400,
      message: `The restaurant closes at 10:30.`,
    });
  }

  if (req.body.data.status !== "booked"){
      return next({
        status: 400,
        message: `Seating status must be "booked" and not ${req.body.data.status}.`,
      });  
  }
  next();
}

async function list(req, res) {
  const todaysDate = req.query.date;
  const mobileNumber = req.query.mobile_number;
  if(todaysDate){
    const data = await service.listToday(todaysDate)
    res.json({data: data})
  }
  if (mobileNumber) {
    const data = await service.search(mobileNumber)
    res.json({data:data})
  } else {
    const data = await service.list();
    res.json({ data: data });
  }
}

async function reservationExists(req, res, next) {
  const {reservation_id} = req.params;
  const reservation = await service.read(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  return next({ status: 404, message: `Reservation ${reservation_id} cannot be found.`})
}

async function read(req, res, next) {
  const {reservation} = res.locals;
  res.json({data: reservation});
}

async function create(req, res, next) {
  const data = await service.create(req.body.data)
    res.status(201).json({ data: data })
}

async function statusCheck(req, res, next) {
  if (res.locals.reservation.status === "finished"){
    return next({
      status: 400,
      message: `This reservation is already finished.`,
    });
  }
  const validStatus = ["booked", "seated", "finished", "cancelled"]
  const reqData = req.body.data;
  if (!validStatus.includes(reqData.status)){
    return next({
      status: 400,
      message: `Reservation status is unknown.`,
    });
  }
  next();
}

async function updateStatus(req, res, next) {
  const updatedReservation = {
    ...req.body.data,
    reservation_id: res.locals.reservation.reservation_id,
  };
  const data = await service.updateStatus(updatedReservation);
  res.status(200).json({ data: data });
}

async function editReservation(req, res, next) {
  const editedReservation = {
    ...req.body.data,
    reservation_id: res.locals.reservation.reservation_id,
  };
  const data = await service.edit(editedReservation);
  res.status(200).json({ data: data });
}


module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(reservationExists), read],
  create: [hasOnlyValidProperties, asyncErrorBoundary(create)],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    statusCheck,
    asyncErrorBoundary(updateStatus),
  ],
  editReservation: [
    hasOnlyValidProperties, 
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(editReservation),
  ],
};

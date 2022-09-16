import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import reservationImage from "../img/ReservationsImage.jpg";
import tableImage from "../img/TablesImage.jpg";
import searchImage from "../img/SearchImage.jpg";
import dashboardImage from "../img/DashboardImage.jpg";

//This component dynamically changes the banner depending on the current path, it defaults to the dashboard image

function Banner() {
  let location = useLocation();

  const [loadedImage, setLoadedImage] = useState("");

  function locationImage() {

    if (location.pathname.includes("tables")) 
      return setLoadedImage(tableImage);
    if (location.pathname.includes("reservations"))
      return setLoadedImage(reservationImage);
    if (location.pathname.includes("search"))
      return setLoadedImage(searchImage);
    else 
      return setLoadedImage(dashboardImage);
  }
  useEffect(locationImage, [location]);

  return (
    <img
      className="d-block img-responsive img-crop"
      src={loadedImage}
      alt="restaurant"
    />
  );
}

export default Banner;

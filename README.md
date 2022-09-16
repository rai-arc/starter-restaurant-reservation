# Restaurant Reservation Application

## [Application Demo](https://restaurant-reservation-rai.herokuapp.com/)
This demo application is hosted on Heroku.

# Overview

This restaurant reservation application was created to allow users to easily manage reservations and tables.
A variety or user stories were collected from a restaurant management team to create a user-friendly application. 

The style of this application is intended to be minimal and simplistic to provide a fast and responsive experience. 



---
## Dashboard

\
![Dashboard Image 1](https://i.imgur.com/Z2yeefe.png)

The dashboard page allows users to see all reservations for any day, defaulting to the user's local date. 

The user can see the name, size, reservation time, phone number, and size of each reservation.

There are options to seat, edit, and cancel reservations on the dashboard. A yellow button and strikethrough text are used to indicate which option cannot be selected.

![Dashboard Image 2](https://i.imgur.com/qjcrUfs.png)

A table containing all of the restaurant's tables is shown at the bottom of the screen to help users manage seating. A finish button is included to clear a table to be used again, it will set the corresponding reservation's status to Finished as well.

---
## Reservation Management

![New Reservation Page](https://i.imgur.com/a6lmhWv.png)

The new reservation page allows users to create a reservation containing the customer's name, number, reservation date, reservation time, and number of people in the party.

![Edit Reservation Page](https://i.imgur.com/KqBH5aB.png)

The edit button from the dashboard page brings up a similar form with all the information pre-filled for easy editing.

---
## Table Management

![New Table Page](https://i.imgur.com/j5MSwDI.png)

The new table page allows users to add tables to their restaurant with a name and capacity option.

![Reservation Seating Page](https://i.imgur.com/w3kMsBY.png)

The seating page allows users to seat a reservation at any of the restaurant's provided tables, an error message will appear if the table is already filled, or the reservation exceeds the table's max capacity.

---
## Search

![Search Page](https://i.imgur.com/qjcrUfs.png)

The search page allows users to search a customer's phone number to get their reservation information. It allows for partial matches for easier searching.

---
# Support

## Installation

To install this application locally:

1. Fork and clone this repository.
2. Run __npm install__ to install project dependencies.
3. Run __npm run start__ to start your server and application.

---
## Features requests / Bug reports / Feedback

For any requests, bug reports, or feedback, feel free to [contact me](https://github.com/rai-arc) here on Github.
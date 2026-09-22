# CoSpace API Reference

## Bookings
### Retrieve a booking
Retrieves a specific booking from the database.

- Method: `GET`
- URL Path: `/bookings/:id`
- Expected payload: None
- Expected result: `200 OK`

### Retrieve a booking
Retrieves all bookings from the database.

- Method: `GET`
- URL Path: `/bookings`
- Expected payload: None
- Expected result: `200 OK`

### Add a booking
Adds a new booking to the database. 

- Method: `POST`
- URL Path: `/bookings`
- Expected payload: `JSON` Object containing `id`, `desk`, `floor`, `date` and `active` components.
- Expected result: `201 CREATED`

### Overwrite booking fully
Overwrites an entire booking completely.

- Method: `PUT`
- URL Path: `/bookings/:id`
- Expected payload: `JSON` object containing entire updated booking data
- Expected result: `200 OK`

### Toggle booking status
Toggles the `active` attribute of an existing booking.

- Method: `PATCH`
- URL Path: `/bookings/:id`
- Expected payload: `JSON` object containing an `active` component of boolean datatype
- Expected result: `200 OK`

### Delete booking
Deletes the booking from the database.

- Method: `DELETE`
- URL Path: `/bookings/:id`
- Expected payload: None
- Expected result: `204 NO CONTENT`
## Normal case
```
[route]      POST /bookings received, forwarding to BookingController.create
[controller] BookingController.create called with body: { desk: "Desk A1", floor: "Floor 2, North Wing", date: "2026-09-22" }
[service]    BookingService.create validating desk name length
[repository] BookingRepository.create pushing new booking with id: 3f2a1c9e-...
[repository] BookingRepository.create returning booking
[service]    BookingService.create returning booking to controller
[controller] BookingController.create responding 201 with created booking
```


## Edge case
When we try to create a new booking with a desk name that is too short (less than 3 characters), the service layer will detect this as a problem and cause a `400 Bad Request` error to be returned to us consequently. 

## The design of the service layer
Our service layer is where the business logic lies, it will only intake the processed inputs and apply calculations/complex operations on them, hence why there should be involvement with express, as this is independant of the webserver. 
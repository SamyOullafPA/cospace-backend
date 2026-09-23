## Edge cases

### Short desk name
When we use a desk name that is too short (less than 3 characters) when creating a desk, it will return the following `400` error.

```json
{
    "status": "fail",
    "message": "Validation failed",
    "errors": [
        {
            "field": "desk",
            "message": "Too small: expected string to have >=3 characters"
        }
    ]
}
```

### Invalid ISO Date
When we input the date in the wrong format (which should be `YYYY-MM-DD`), it will error as it cannot parse the date, it will return the following `400` error.

```json
{
    "status": "fail",
    "message": "Validation failed",
    "errors": [
        {
            "field": "date",
            "message": "Invalid ISO date"
        }
    ]
}
```

## Expected behaviour

The validation is expected to remove the trailing spaces from the given data, which it correctly does. When we send this POST request to create this booking:
```json
{
    "desk": " Window Desk A ",
    "floor": "Floor 7",
    "date": "2026-09-23"
}
```

It will enter the booking and remove the trailing spaces from the desk name, and we can see this worked by running a `GET` request to the same endpoint, it will return a booking like so:
```json
{
    "id": "a2ed9dc2-66c0-4822-b0be-e1eb5112f1fe",
    "active": true,
    "desk": "Window Desk A",
    "floor": "Floor 7",
    "date": "2026-09-23"
}
```
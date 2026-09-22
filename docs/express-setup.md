# Express Setup
Run this project by opening a terminal in this directory and run `npm run dev` to start hot-reloading the `src/index.ts` file which contains the express server.

# Testing

## cURL method
On most operating systems (macOS, Linux and Windows), there is a preinstalled library called **cURL**, which can handle network requests from the terminal. We can test our server by running the command `curl localhost:5000/`, and if successful, it should return the following: `{"status":"active","message":"CoSpace API is running"}` in a JSON format.

## Postman method
Postman is a third-party software that developers use to test network requests using a graphical interface, which is much more user-friendly. We can test our server by sending a simple `GET` request to `localhost:5000/`, and it would return a nicely formatted version of `{"status":"active","message":"CoSpace API is running"}`.
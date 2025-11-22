# Express.js CRUD API for User Management

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.x-blue.svg)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14.x-blue.svg)](https://www.postgresql.org/)
[![Swagger](https://img.shields.io/badge/Swagger-Documentation-orange.svg)](/api-docs)

This project is a RESTful API built with Express.js that performs complete CRUD (Create, Read, Update, Delete) operations for a `users` resource. It uses a PostgreSQL database for data persistence and includes API documentation powered by Swagger.

## Features

- **User Management**: Full CRUD functionality for user accounts.
- **Secure Passwords**: Passwords are securely hashed using `bcrypt` before being stored.
- **Authentication**: A simple login endpoint (`/users/login`) to verify user credentials.
- **Pagination**: The `GET /users` endpoint supports pagination via query parameters (`page` and `limit`).
- **API Documentation**: Interactive API documentation available through Swagger UI.
- **Configuration**: Easy setup using environment variables for the server port and database connection.

## Technologies Used

- **Backend**: [Node.js](https://nodejs.org/), [Express.js](https://expressjs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Password Hashing**: [bcrypt](https://www.npmjs.com/package/bcrypt)
- **API Documentation**: [Swagger UI Express](https://www.npmjs.com/package/swagger-ui-express), [Swagger-Autogen](https://www.npmjs.com/package/swagger-autogen)
- **Environment Variables**: [dotenv](https://www.npmjs.com/package/dotenv)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/en/download/) (v18.x or later recommended)
- [npm](https://www.npmjs.com/get-npm)
- A running [PostgreSQL](https://www.postgresql.org/download/) database instance.

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/NandaBahtiar/expres-api-user-crud.git
    cd expres-api-user-crud
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory of the project by copying the example file:
    ```sh
    copy .env.example .env
    ```
    Open the `.env` file and add your configuration details:
    ```env
    # Server Port
    PORT=3000

    # PostgreSQL Connection URL
    # Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
    DATABASE_URL="your_database_connection_string"
    ```

4.  **Initialize the Database:**
    Connect to your PostgreSQL instance and run the following SQL command to create the `users` table:
    ```sql
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    ```

### Running the Application

1.  **Start the server:**
    ```sh
    node index.js
    ```
    The server will start, and you will see a confirmation message in the console.

2.  **Access API Documentation:**
    Open your web browser and navigate to the following URL to view the interactive Swagger documentation:
    [http://localhost:3000/api-docs/](http://localhost:3000/api-docs/)

## API Endpoints

All endpoints are prefixed with `/users`.

| Method | Endpoint        | Description                                       |
| ------ | --------------- | ------------------------------------------------- |
| `GET`  | `/`             | Fetches a paginated list of all users.            |
| `GET`  | `/:id`          | Fetches a single user by their ID.                |
| `POST` | `/`             | Creates a new user.                               |
| `POST` | `/login`        | Authenticates a user and returns their details.   |
| `PUT`  | `/:id`          | Updates a user's information (email/password).    |
| `DELETE`| `/:id`         | Deletes a user by their ID.                       |
# CRUD API

This project is a **simple CRUD API** using an **in-memory database** to manage users. The API supports creating, reading, updating, and deleting users, and it follows RESTful principles. The proejct is implemented using **Node.js**.

## Features

### User Management
- **Create User:** Add a new user with a unique ID, username, age, and hobbies.
- **Read User:** Retrieve all users or a specific user by ID.
- **Update User:** Modify an existing user's information.
- **Delete User:** Remove a user from the database.

### Error Handling
- Proper HTTP status codes and messages for:
  - Non-existent endpoints (404).
  - Invalid data or parameters (400).
  - Internal server errors (500).
- Graceful error responses with human-friendly messages.

## API Endpoints

| Method | Endpoint                   | Description                                | Status Codes                        |
|-------|-----------------------------|--------------------------------------------|-------------------------------------|
| GET   | /api/users                  | Retrieve all users                          | 200                                  |
| GET   | /api/users/{userId}          | Retrieve a user by ID                       | 200, 400, 404                        |
| POST  | /api/users                  | Create a new user                           | 201, 400                             |
| PUT   | /api/users/{userId}          | Update an existing user                     | 200, 400, 404                        |
| DELETE| /api/users/{userId}          | Delete a user by ID                         | 204, 400, 404                        |

## User Object Structure

```json
{
  "id": "string (uuid)",
  "username": "string",
  "age": "number",
  "hobbies": ["string"]
}
```

## Installation

1. Clone the repository:

```bash
git clone https://github.com/bt-diana/crud-api.git
```

2. Navigate to the project directory:

```bash
cd crud-api
```

3. Switch to `dev` branch:

```bash
git checkout dev
```


4. Install dependencies:

```bash
npm install
```


4. Create a `.env` file in the root directory and specify the port:

```
PORT=4000
```
## Running the Project

### Development Mode
Start the server with automatic reload:

```bash
npm run start:dev
```

### Production Mode
Build and run the server:

```bash
npm run start:prod
```

## Testing
Run automated tests to ensure that API works correctly:

```bash
npm test
```

Tests cover basic CRUD operations and error handling scenarios.

## Technologies Used

- Node.js (v22.14.0 or higher)
- TypeScript
- ts-node-dev
- Prettier, ESLint

## License

This project is licensed under the MIT License.

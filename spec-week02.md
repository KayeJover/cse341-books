# Books API Week 02 Spec - Version 1

## Feature 1: Book CRUD Operations and Author References

### Goal

Update the existing Week 01 book API so book documents include a reference to an author and the API supports all CRUD operations for books. Every book route must be documented and testable in Swagger.

### Data Model

Book documents will be stored in the `books` collection.

Required book fields:

- `id`: string, required, custom id such as `b1`
- `authorId`: string, required, references the `id` field of an author document
- `title`: string, required
- `publicationDate`: string, required

Books will continue to use custom string ids instead of MongoDB `_id` values for route parameters.

### Relationship to Authors

Each book will identify its author with an `authorId` field. The value of `authorId` must match the custom `id` value of an existing author document.

When creating or updating a book, the API should reject the request with a `400` status code if the submitted `authorId` does not match an existing author.

### Routes

#### GET /books

Purpose: Return all books.

Success:
- Status code: `200`
- Response body: an array of book objects

Errors:
- `500` if an unexpected server or database error occurs

#### GET /books/:id

Purpose: Return one book by its custom id.

Success:
- Status code: `200`
- Response body: the matching book object

Errors:
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

#### POST /books

Purpose: Create a new book.

Request body:

```json
{
  "id": "b4",
  "authorId": "a1",
  "title": "Example Book Title",
  "publicationDate": "2026-01-15"
}
```

Success:
- Status code: `201`
- Response body: the newly created book object

Errors:
- `400` if a required field is missing
- `400` if the `id` already exists
- `400` if the `authorId` does not match an existing author
- `500` if an unexpected server or database error occurs

#### PUT /books/:id

Purpose: Update an existing book.

Request body:

```json
{
  "authorId": "a2",
  "title": "Updated Book Title",
  "publicationDate": "2026-02-20"
}
```

Success:
- Status code: `200`
- Response body: the updated book object

Errors:
- `400` if a required field is missing
- `400` if the `authorId` does not match an existing author
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

#### DELETE /books/:id

Purpose: Delete an existing book.

Success:
- Status code: `204`
- Response body: none

Errors:
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

### Swagger Documentation

Swagger must document every book route.

### Deployment Expectations

After implementation, the book routes must work locally and from the deployed Render application. The deployed Swagger page at `/api-docs` must allow someone to test every book route from the browser.

---

## Feature 2: Author CRUD Operations

### Goal

Create an Authors API that allows users to create, retrieve, update, and delete author records. The API will also support the relationship between authors and books.

### Data Model

Author documents will be stored in the `authors` collection.

Required author fields:

- `id`: string, required, custom id such as `a1`
- `name`: string, required, author's full name
- `birthYear`: integer, required, author's year of birth

Authors will use custom string ids instead of MongoDB `_id` values for route parameters.

### Routes

#### GET /authors

Purpose: Return all authors.

Success:
- Status code: `200`
- Response body: an array of author objects

Errors:
- `500` if an unexpected server or database error occurs

#### GET /authors/:id

Purpose: Return one author by their custom id.

Success:
- Status code: `200`
- Response body: the matching author object

Errors:
- `404` if no author exists with that id
- `500` if an unexpected server or database error occurs

#### POST /authors

Purpose: Create a new author.

Request body:

```json
{
  "id": "a1",
  "name": "Maya Rivera",
  "birthYear": 1985
}
```

Success:
- Status code: `201`
- Response body: the newly created author object

Errors:
- `400` if a required field is missing or invalid
- `400` if the author id already exists
- `500` if an unexpected server or database error occurs

#### PUT /authors/:id

Purpose: Update an existing author.

Request body:

```json
{
  "name": "Maya Rivera Updated",
  "birthYear": 1986
}
```

Success:
- Status code: `200`
- Response body: the updated author object

Errors:
- `400` if a required field is missing or invalid
- `404` if no author exists with that id
- `500` if an unexpected server or database error occurs

#### DELETE /authors/:id

Purpose: Delete an existing author.

Success:
- Status code: `204`
- Response body: none

Errors:
- `404` if no author exists with that id
- `409` if the author still has one or more books associated with them
- `500` if an unexpected server or database error occurs

### Book Relationship

Each author can have multiple books. Each book must reference an existing author through its `authorId` field.

The API must prevent an author from being deleted while books still reference that author. Users must first update or delete the associated books.

### Swagger Documentation

Swagger must document every author route, including request bodies, successful responses, and possible error responses.

### Deployment Expectations

After implementation, all author routes must work locally and from the deployed Render application. The deployed Swagger page at `/api-docs` must allow users to test every author route.

---

## Version 1 Evaluation

### 1. Bugs and Short-Sighted Decisions

- The specifications do not fully define how empty strings, invalid data types, or incorrectly formatted dates should be handled.
- Duplicate custom IDs must be checked for both books and authors.
- The API must verify that an author exists before creating or updating a book.
- The API should clearly define what happens when an author is deleted while books still reference that author.

### 2. Security

- The API must validate incoming request bodies and accept only the expected fields.
- Clients must not be allowed to modify MongoDB's internal `_id` field.
- Error responses must not expose database credentials, stack traces, or other sensitive server information.
- Invalid or unexpected input must be rejected with an appropriate error response.

### 3. Efficiency

- Unique database indexes should be created for the custom `id` fields in both collections to prevent duplicate IDs.
- An index should be created for the `authorId` field in the books collection to improve author relationship lookups.
- Database queries should retrieve only the necessary records instead of loading unnecessary data.

### 4. Unclear Requirements and Response Behavior

- The publication date must follow the `YYYY-MM-DD` format and represent a valid date.
- The author's birth year must be a valid integer.
- PUT requests must include all required editable fields.
- Missing resources should return `404` with a descriptive JSON message.
- Invalid request data should return `400` with a descriptive JSON message.
- Deleting an author who still has associated books should return `409 Conflict`.
- Unexpected server or database errors should return `500` without exposing internal details.

### 5. Recommended Consistent Error Response Format

All API error responses should use the following JSON structure:

```json
{
  "message": "Book not found"
}
```

This format should be used consistently for both Books and Authors API errors.

---

# Books API Week 02 Spec - Version 2

## Feature 1: Book CRUD Operations and Author References

### Goal

Extend the existing Books API to support complete CRUD operations and establish a valid relationship between books and authors.

### Data Model

Book documents will be stored in the `books` collection.

Required fields:

- `id`: unique string, required.
- `authorId`: string referencing an existing author's custom id.
- `title`: non-empty string, required.
- `publicationDate`: valid date string in `YYYY-MM-DD` format.

MongoDB's `_id` field will remain internally managed by the database and will not be modified through API requests.

### Validation Rules

- All required fields must be provided.
- String fields must not be empty or contain only whitespace.
- `publicationDate` must follow `YYYY-MM-DD` and represent a valid calendar date.
- The book's custom `id` must be unique.
- `authorId` must reference an existing author.
- Requests containing unsupported fields must be rejected.
- PUT requests must include all required editable fields.
- The book's custom id cannot be changed through a PUT request. The id in the URL identifies the book being updated.

### Routes

#### GET /books

- `200`: Return all books.
- `500`: Return an error message if a server or database error occurs.

#### GET /books/:id

- `200`: Return the matching book.
- `404`: Return an error message if the book does not exist.
- `500`: Return an error message for unexpected errors.

#### POST /books

- `201`: Create and return the new book.
- `400`: Invalid or missing fields, duplicate ID, or invalid author reference.
- `500`: Unexpected server or database error.

#### PUT /books/:id

- `200`: Update and return the book.
- `400`: Invalid or missing fields, or invalid author reference.
- `404`: Book does not exist.
- `500`: Unexpected server or database error.

#### DELETE /books/:id

- `204`: Successfully delete the book without a response body.
- `404`: Book does not exist.
- `500`: Unexpected server or database error.

### Database Indexes

- Create a unique index on `books.id`.
- Create an index on `books.authorId`.

### Error Response Format

All error responses must follow this structure:

```json
{
  "message": "Book not found"
}
```

Error messages must be descriptive and must not expose sensitive server or database information.

---

## Feature 2: Author CRUD Operations

### Goal

Create an Authors API that supports complete CRUD operations and maintains valid relationships with books.

### Data Model

Author documents will be stored in the `authors` collection.

Required fields:

- `id`: unique string, required.
- `name`: non-empty string, required.
- `birthYear`: valid integer, required.

MongoDB's `_id` field will remain internally managed by the database.

### Validation Rules

- All required fields must be provided.
- `id` and `name` must not be empty or contain only whitespace.
- `birthYear` must be an integer representing a valid birth year.
- The birthYear must be a four-digit integer and must not be later than the current year.
- Custom author IDs must be unique.
- Requests containing unsupported fields must be rejected.
- PUT requests must include all required editable fields.
- The author's custom id cannot be changed through a PUT request. The id in the URL identifies the author being updated.

### Routes

#### GET /authors

- `200`: Return all authors.
- `500`: Unexpected server or database error.

#### GET /authors/:id

- `200`: Return the matching author.
- `404`: Author does not exist.
- `500`: Unexpected server or database error.

#### POST /authors

- `201`: Create and return the new author.
- `400`: Invalid or missing fields or duplicate author ID.
- `500`: Unexpected server or database error.

#### PUT /authors/:id

- `200`: Update and return the author.
- `400`: Invalid or missing fields.
- `404`: Author does not exist.
- `500`: Unexpected server or database error.

#### DELETE /authors/:id

- `204`: Successfully delete the author without a response body.
- `404`: Author does not exist.
- `409`: Author cannot be deleted because books still reference them.
- `500`: Unexpected server or database error.

### Book Relationship

- An author can have multiple books.
- Every book must reference an existing author through `authorId`.
- Before deleting an author, the API must check whether any books reference that author.
- If associated books exist, the API must return `409 Conflict` and prevent deletion.
- Users must first update or delete the associated books before deleting the author.

### Database Indexes

- Create a unique index on `authors.id`.

### Swagger Documentation

All book and author routes must be documented in Swagger, including:

- HTTP methods and route paths.
- Request parameters and request bodies.
- Successful response codes.
- Possible error response codes and JSON response examples.

### Deployment and Testing

- All routes must work locally and on the deployed Render application.
- All CRUD operations must be tested using Swagger.
- Invalid requests, missing records, duplicate IDs, and invalid author references must be tested.
- The deployed Swagger documentation must be accessible through `/api-docs`.

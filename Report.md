# Assignment Report: MongoDB Blog System
Kilian Froschauer, Erik Zauner, Adrian Pichler

## 1. Architecture
To ensure a modern, scalable, and easily deployable architecture, the entire project was containerized using Docker (`docker-compose`). The architecture consists of three interconnected containers:
1. **MongoDB Database:** Running natively on default port `27017`.
2. **Node.js REST-API:** An Express backend acting as the middleware, securely executing native MongoDB queries based on frontend requests.
3. **Angular Web Application:** The frontend interface providing the User Interface (UI), served dynamically via Nginx.

## 2. Data Model & Schema Design
To optimize read performance and maintain a logical structure, a hybrid approach between referencing and embedding was chosen.
*   **Users Collection (`users`):** Stores user profiles including `username`, `name` (firstname, lastname), `email`, and `password`. A unique index guarantees that no two users share the same username.
*   **Entries Collection (`entries`):** The primary collection for the blog system. 
    *   It contains standard fields like `title`, `description`, `category`, `impressionCount` and timestamps (`creationDate`, `editDates`).
    *   **Embedded Design:** Instead of creating a separate collection for comments, the **Comments** are stored as an embedded array within the blog entry document itself (`comments: []`). This follows the MongoDB philosophy of grouping data that is frequently accessed together.
    *   **Content:** The `content` field is a nested object holding raw text, arrays for links, and arrays for **Base64-encoded images**, explicitly fulfilling the requirement not to use image URLs.
    *   **Index:** A compound unique index on `title` and `author.username` ensures data integrity.

## 3. Database Initialization (`init.mongodb.js`)
To provide a reproducible starting point, an initialization script was created in pure `mongosh` syntax. 
The script drops any existing collections, establishes the required indexes, and utilizes `insertMany()` to seed the database with:
*   5 distinct blog users.
*   5 blog entries spanning 3 different categories (Programming, Database, Lifestyle).
*   Mocked Base64 WebP image data directly inside the blog entry contents.
*   4 comments pushed dynamically into 3 different entries using the `$push` operator.

## 4. Queries & Data Modification (`queries.mongodb.js`)
All 12 required data retrieval queries and the 5 data alteration operations were implemented directly in native MongoDB shell syntax. 
This file acts as the demonstrative core of the assignment, showcasing the use of advanced operators such as:
*   `$match`, `$sort`, `$limit`, and `$group` within Aggregation Pipelines.
*   `$or`, `$and`, `$exists`, and Regex pattern matching for complex filtering.
*   `upsert: true` and `$setOnInsert` for intelligent data merging.
*   `$expr` and `$indexOfCP` to search for title mentions strictly within the document's content fields.

## 5. Frontend UI Implementation
The Angular UI ("Existence of an UI") was built to fetch and mutate the database directly. It provides a dashboard to explore all initialized database entries dynamically. Users can read the content, view the parsed Base64 images seamlessly rendered in the browser, and interact with the data directly, integrating the MongoDB backend natively into a polished full-stack application.

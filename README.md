# VideoTube Project 🎥

A comprehensive video-sharing platform with a robust backend built on Node.js, Express.js, and MongoDB, and a dynamic frontend developed with React and Vite. This project replicates core functionalities of popular video platforms, enabling users to manage content, interact, and organize videos.

---

## ✨ Features

* **User Management:**
    * User registration with avatar and cover image uploads.
    * Secure user login and logout with JWT-based authentication.
    * Password change functionality.
    * Update account details, avatar, and cover image.
    * View user channel profiles, including subscriber counts and subscription status.
    * Access watch history and user-specific video uploads.
    * Dashboard for channel owners to view analytics (total views, subscribers, likes, videos).
* **Video Management:**
    * Upload and publish videos with title, description, video file, and thumbnail.
    * Retrieve all videos with pagination, search, and sorting capabilities.
    * Get detailed information for a single video, including likes and comments.
    * Update video details and toggle publishing status.
    * Delete videos (removes from cloud storage too).
    * Get recommended videos based on keywords.
* **Interactions:**
    * **Comments:** Add, update, and delete comments on videos.
    * **Likes:** Toggle likes on videos, comments, and tweets.
    * **Subscriptions:** Subscribe to and unsubscribe from user channels.
    * **Tweets:** Create, update, and delete short text posts.
* **Playlist Management:**
    * Create, update, and delete custom video playlists.
    * Add and remove videos from playlists.
    * View user-specific playlists and individual playlist details.

---

## 🚀 Technologies Used

### Backend

* **Node.js**: JavaScript runtime environment
* **Express.js**: Web application framework for Node.js
* **MongoDB**: NoSQL database
* **Mongoose**: MongoDB object data modeling (ODM) for Node.js
* **bcrypt**: For hashing passwords
* **jsonwebtoken (JWT)**: For secure authentication
* **multer**: Middleware for handling `multipart/form-data` (file uploads)
* **Cloudinary**: Cloud-based media management for storing videos and images
* **cookie-parser**: Middleware to parse cookies
* **cors**: Middleware for enabling Cross-Origin Resource Sharing
* **dotenv**: Loads environment variables from a `.env` file
* **Utilities**: `ApiError.js`, `ApiResponse.js`, `asyncHandler.js`

### Client-side

* **React**: A JavaScript library for building user interfaces.
* **Vite**: A fast build tool for modern web projects.
* **React Router DOM**: For declarative routing in React applications.
* **Redux Toolkit**: For efficient Redux development, including state management and async logic.
* **Axios**: A promise-based HTTP client for making API requests.
* **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
* **ESLint**: For identifying and reporting on patterns in JavaScript code.
* **Autoprefixer & PostCSS**: Tools for processing CSS with JavaScript plugins.

---

## ⚙️ Getting Started

To set up and run the project locally, ensure you have Node.js (v18 or higher), MongoDB (local or Atlas), and a Cloudinary account.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/videotube-backend.git](https://github.com/your-username/videotube-backend.git)
    cd videotube-backend # Navigate to the backend directory
    npm install
    cd ../videotube-frontend # Navigate to the frontend directory
    npm install
    ```
2.  **Environment Variables:**
    Create a `.env` file in **both** the `backend` and `frontend` root directories and configure them with your respective settings. Sample files (`.env.sample`) are provided for reference in both directories.

### Running the Project

1.  **Start the MongoDB server** (if running locally).
2.  **Run the backend:** Open your terminal, navigate to the `backend` directory, and run:
    ```bash
    npm run dev
    ```
    The backend server will start on the port specified in your backend `.env` file (default: `8000`).
3.  **Run the frontend:** Open a **new** terminal, navigate to the `frontend` directory, and run:
    ```bash
    npm run dev
    ```
    The frontend application will typically open in your browser at `http://localhost:5173` (or another port if 5173 is in use).

---

## 📊 API Endpoints

The API is structured under the `/api/v1` prefix.

| Method | Endpoint | Description | Middleware |
| :----- | :------- | :---------- | :--------- |
| `POST` | `/register` | Register a new user | `multer` |
| `POST` | `/login` | Log in a user | |
| `POST` | `/logout` | Log out the current user | `verifyJWT` |
| `POST` | `/refresh-token` | Refresh access token using refresh token | |
| `POST` | `/change-password` | Change current user's password | `verifyJWT` |
| `GET` | `/current-user` | Get details of the currently logged-in user | `verifyJWT` |
| `PATCH` | `/update-account` | Update user's full name and email | `verifyJWT` |
| `PATCH` | `/avatar` | Update user's avatar | `verifyJWT`, `multer` |
| `PATCH` | `/cover-image` | Update user's cover image | `verifyJWT`, `multer` |
| `GET` | `/c/:userName` | Get channel profile by username | `verifyJWT` |
| `GET` | `/history` | Get current user's watch history | `verifyJWT` |
| `GET` | `/c/:userName/videos` | Get all videos uploaded by a specific user | `verifyJWT` |
| `GET` | `/c/:userName/dashboard` | Get dashboard analytics for a channel owner | `verifyJWT` |

<br>

| Method | Endpoint | Description | Middleware |
| :----- | :------- | :---------- | :--------- |
| `GET` | `/` | Get all videos (supports query, sort, pagination) | |
| `GET` | `/recommendation/:videoId` | Get recommended videos based on a video | |
| `POST` | `/upload-video` | Publish a new video | `verifyJWT`, `multer` |
| `GET` | `/:videoId` | Get video details by ID | `verifyJWT` |
| `PATCH` | `/update/:videoId` | Update video details (title, description, thumbnail) | `verifyJWT`, `multer` |
| `DELETE` | `/delete/:videoId` | Delete a video | `verifyJWT` |
| `PATCH` | `/toggle/:videoId` | Toggle video publish status | `verifyJWT` |

<br>

| Method | Endpoint | Description | Middleware |
| :----- | :------- | :---------- | :--------- |
| `GET` | `/:videoId` | Get all comments for a video | `verifyJWT` |
| `POST` | `/:videoId` | Add a comment to a video | `verifyJWT` |
| `PATCH` | `/c/:commentId` | Update a comment | `verifyJWT` |
| `DELETE` | `/c/:commentId` | Delete a comment | `verifyJWT` |

<br>

| Method | Endpoint | Description | Middleware |
| :----- | :------- | :---------- | :--------- |
| `POST` | `/toggle/v/:videoId` | Toggle like on a video | `verifyJWT` |
| `POST` | `/toggle/c/:commentId` | Toggle like on a comment | `verifyJWT` |
| `POST` | `/toggle/t/:tweetId` | Toggle like on a tweet | `verifyJWT` |
| `GET` | `/videos` | Get all videos liked by the current user | `verifyJWT` |

<br>

| Method | Endpoint | Description | Middleware |
| :----- | :------- | :---------- | :--------- |
| `GET` | `/c/subscribed-to/:userName` | Get channels a user is subscribed to | |
| `GET` | `/c/subscribers/:channelId` | Get subscribers of a channel | `verifyJWT` |
| `POST` | `/c/:channelId` | Toggle subscription to a channel | `verifyJWT` |

<br>

| Method | Endpoint | Description | Middleware |
| :----- | :------- | :---------- | :--------- |
| `GET` | `/user/:userName` | Get all playlists created by a user | |
| `POST` | `/` | Create a new playlist | `verifyJWT` |
| `GET` | `/:playlistId` | Get playlist details by ID | `verifyJWT` |
| `PATCH` | `/:playlistId` | Update playlist name/description | `verifyJWT` |
| `DELETE` | `/:playlistId` | Delete a playlist | `verifyJWT` |
| `PATCH` | `/add/:videoId/:playlistId` | Add a video to a playlist | `verifyJWT` |
| `PATCH` | `/remove/:videoId/:playlistId` | Remove a video from a playlist | `verifyJWT` |

<br>

| Method | Endpoint | Description | Middleware |
| :----- | :------- | :---------- | :--------- |
| `GET` | `/c/:userName` | Get all tweets by a specific user | |
| `POST` | `/` | Create a new tweet | `verifyJWT` |
| `PATCH` | `/:tweetId` | Update a tweet's content | `verifyJWT` |
| `DELETE` | `/:tweetId` | Delete a tweet | `verifyJWT` |

<br>

| Method | Endpoint | Description | Middleware |
| :----- | :------- | :---------- | :--------- |
| `GET` | `/` | Check if the server is running | |

---

## 🚀 Key Learnings & Challenges

This project was a significant learning experience, especially for a beginner in backend development. Here are some key takeaways:

* **Asynchronous Programming:** Mastering `async/await` and handling promises correctly is crucial for Node.js. The `asyncHandler` utility was a lifesaver for managing errors in asynchronous routes without repetitive `try-catch` blocks.
* **Authentication & Authorization:** Implementing JWTs for stateless authentication, managing access and refresh tokens, and securing routes with middleware (`verifyJWT`) taught me the fundamentals of secure API access.
* **File Management with Cloudinary:** Integrating `multer` for local file handling and then seamlessly uploading to a cloud service like Cloudinary was a practical lesson in managing media assets efficiently and securely.
* **Database Design & Complex Queries:** Designing MongoDB schemas and utilizing Mongoose's powerful aggregation pipeline for complex data retrieval (e.g., fetching user profiles with subscriber counts, or video details with likes and comments) was challenging but incredibly rewarding. It highlighted the importance of optimizing database queries.
* **API Design Principles:** Understanding how to structure RESTful APIs, standardize responses (`ApiResponse`), and handle errors gracefully (`ApiError`) are vital for building maintainable and user-friendly backends.
* **Environment Variables:** The critical importance of using `.env` files to manage sensitive information and configurations, ensuring security and flexibility across different deployment environments.

This project reinforced the importance of **clean code**, **modular design**, **security best practices**, and **efficient data handling** in building robust web applications.

---

## 🤝 Contributing

Contributions are welcome! If you have suggestions for improvements or want to add new features, please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add new feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Create a new Pull Request.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](https://www.google.com/search?q=LICENSE) file for details.

---

## 📧 Contact

For any questions or feedback, feel free to reach out:

* **Name:** Rishav
* **Email:** rishavrajiitg2025@gmail.com
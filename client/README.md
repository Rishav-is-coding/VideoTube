# VideoTube Frontend

VideoTube is a modern, full-stack video-sharing platform designed to provide a rich user experience similar to popular video platforms. This repository contains the frontend application, built with React and Redux Toolkit, featuring a responsive design and seamless API integration.

## Features

VideoTube offers a comprehensive set of functionalities for users to interact with video content and manage their channels:

### User Authentication & Management
* **User Registration**: Create new accounts.
* **User Login**: Securely log in to existing accounts.
* **Logout**: End session securely.
* **Update Account Details**: Modify personal information like full name and email.
* **Change Password**: Update account password securely.
* **Update Avatar & Cover Image**: Personalize channel appearance by updating profile pictures and cover images.

### Video & Content Management
* **Video Upload**: Publish new videos with titles, descriptions, and thumbnails.
* **Video Playback**: Watch videos with a dedicated video player.
* **Home Page**: Browse a collection of all available videos.
* **User Videos Page**: View all videos uploaded by a specific user or channel.
* **Video Card Component**: Reusable component for displaying video previews with title, views, and publication time.
* **Dashboard**: Access a personalized dashboard showing total views, subscribers, videos, and likes (for channel owners).

### Engagement & Interaction
* **Like/Unlike Videos**: Express appreciation for videos.
* **Liked Videos Page**: View a collection of all videos you have liked.
* **Comments**: Add, view, update, and delete comments on videos.
* **Like/Unlike Comments**: Interact with comments by liking or unliking them.
* **Tweets (Posts)**: Create, view, update, and delete short text-based posts associated with a channel.
* **Like/Unlike Tweets**: Express appreciation for tweets.

### Channel & Subscription Features
* **Channel Page**: View a channel's profile, including their videos and subscriber count.
* **Subscribe/Unsubscribe**: Follow channels to get updates.
* **Subscribed Channels Page**: See a list of channels you are subscribed to.
* **Channel Subscribers Page**: View the list of subscribers for your own channel.

### Playlists
* **Create Playlist**: Organize videos into custom playlists.
* **User Playlists Page**: View all playlists created by a specific user.
* **Playlist Detail Page**: View, update, or delete a playlist, and manage videos within it (add/remove).

### Watch History
* **Watch History Page**: Keep track of videos you've watched.

## Technologies Used

* **Frontend Framework**: React
* **State Management**: Redux Toolkit
* **Routing**: React Router DOM
* **API Communication**: Axios with an interceptor for token refresh and error handling
* **Styling**: Tailwind CSS
* **Build Tool**: Vite (indicated by `import.meta.env.VITE_API_BASE_URL` in `api.js` and typical React/Vite project structure)

## Project Structure

The project follows a standard React application structure, organized primarily by feature and type: <br/>
```
videotube-frontend/
├── public/
├── src/
│   ├── App.jsx             // Main application component, defines routes
│   ├── index.css           // Global styles, including Tailwind CSS imports
│   ├── main.jsx            // Entry point for React application
│   ├── components/         // Reusable UI components (e.g., Header, Footer, Sidebar, VideoCard, LoadingSpinner)
│   │   ├── Footer.jsx

│   │   ├── Header.jsx

│   │   ├── LoadingSpinner.jsx
│   │   ├── Sidebar.jsx

│   │   └── VideoCard.jsx

│   ├── features/           // Contains Redux slices and components related to specific features
│   │   ├── auth/           // Authentication related components and slice
│   │   │   ├── authSlice.js
│   │   │   ├── ChangePasswordPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── UpdateAccountPage.jsx
│   │   ├── comment/        // Comments related components and slice
│   │   │   ├── CommentSection.jsx
│   │   │   └── commentSlice.js
│   │   ├── like/           // Likes related slice
│   │   │   └── likeSlice.js
│   │   ├── playlist/       // Playlists related components and slice
│   │   │   ├── CreatePlaylistPage.jsx
│   │   │   ├── PlaylistDetailPage.jsx
│   │   │   └── playlistSlice.js
│   │   ├── subscription/   // Subscriptions related slice
│   │   │   └── subscriptionSlice.js
│   │   ├── tweet/          // Tweets related slice
│   │   │   └── tweetSlice.js
│   │   └── video/          // Video related components and slice
│   │       ├── UploadVideo.jsx
│   │       ├── VideoDetail.jsx
│   │       └── videoSlice.js
│   ├── layouts/            // Layout components for different route groups
│   │   ├── MainLayout.jsx  // Layout for public routes
│   │   └── ProtectedLayout.jsx // Layout for authenticated routes
│   ├── pages/              // Top-level page components
│   │   ├── ChannelPage.jsx
│   │   ├── ChannelSubscribersPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── HomePage.jsx

│   │   ├── LikedVideosPage.jsx
│   │   ├── SubscribedChannelsPage.jsx
│   │   ├── UserPlaylistsPage.jsx
│   │   ├── UserTweetsPage.jsx
│   │   ├── UserVideosPage.jsx
│   │   └── WatchHistoryPage.jsx
│   ├── redux/              // Redux store configuration
│   │   └── store.js

│   └── utils/              // Utility functions
│       └── api.js          // Axios instance for API calls
├── .env.example            // Example environment variables file
├── package.json
└── README.md
```
## Setup and Installation

To set up the VideoTube frontend locally, follow these steps:

1.  **Clone the Repository**:
    ```bash
    git clone <repository-url>
    cd videotube-frontend
    ```
2.  **Install Dependencies**:
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Environment Variables**:
    Create a `.env` file in the root of the `videotube-frontend` directory and add your API base URL. This URL should point to your backend server.
    ```
    VITE_API_BASE_URL=http://localhost:8000/api/v1
    ```
    (Replace `http://localhost:8000/api/v1` with your actual backend URL)
4.  **Run the Application**:
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The application will typically run on `http://localhost:5173` (or another port if 5173 is in use).

## Usage

1.  **Register**: Create a new account by providing your details, including an avatar.
2.  **Login**: Log in using your registered email or username and password.
3.  **Browse Videos**: Once logged in, you can view all available videos on the home page or explore specific channels.
4.  **Upload Videos**: As an authenticated user, you can upload your own videos with a title, description, and thumbnail.
5.  **Manage Content**: Access your dashboard to see your channel's analytics, manage your videos, playlists, and tweets.

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.


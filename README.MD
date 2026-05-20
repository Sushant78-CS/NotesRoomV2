# NotesRoom

A modern collaborative notes and file sharing application built with React Native, Expo, Clerk Authentication, and Spring Boot.

---

# Features

- Clerk Authentication
- Google OAuth Login
- Email & Password Authentication
- Persistent Sessions
- Protected Routes
- Create and Join Groups
- Invite Code Based Group Joining
- Group Member Management
- Admin Controls
- Upload and Share Files
- Download Shared Files
- Delete Shared Files
- Dark & Light Theme Support
- Modern Responsive UI
- Axios Interceptors
- Secure API Authentication
- Zustand State Management

---

# Tech Stack

## Frontend

- React Native
- Expo
- Expo Router
- TypeScript
- Clerk Authentication
- Zustand
- Axios
- React Native Size Matters

## Backend

- Spring Boot
- Spring Security
- PostgreSQL
- Hibernate / JPA
- Cloudinary

---

# Folder Structure

```txt
app/
 ├── (auth)
 ├── screens
 ├── group

components/
api/
store/
constants/
```

---

# Authentication

## Clerk Authentication

- Email & Password Login
- Google OAuth Login
- Persistent Sessions
- Protected Navigation
- Secure Token Handling
- Session Management

---

# Main Functionalities

## Authentication

- Login
- Signup
- Google OAuth
- Logout
- Persistent Login

## Groups

- Create Group
- Join Group
- Leave Group
- Delete Group
- Invite Code System
- View Group Members

## File Sharing

- Upload Files
- Download Files
- Share Files
- Delete Files
- View Shared Files

## UI Features

- Dark Mode
- Responsive UI
- Modern Mobile Design
- Smooth Loading States
- Floating Action Buttons
- Modal Based Actions

---

# Backend Configuration

Create:

```txt
src/main/resources/application.properties
```

Example:

```properties
spring.application.name=

spring.datasource.url=
spring.datasource.username=
spring.datasource.password=

spring.jpa.hibernate.ddl-auto=
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=

cloudinary.cloud_name=
cloudinary.api_key=
cloudinary.api_secret=

spring.servlet.multipart.enabled=true
spring.servlet.multipart.max-file-size=50MB
spring.servlet.multipart.max-request-size=50MB

spring.datasource.hikari.maximum-pool-size=
spring.datasource.hikari.minimum-idle=
spring.datasource.hikari.idle-timeout=
spring.datasource.hikari.max-lifetime=
spring.datasource.hikari.connection-timeout=
spring.datasource.hikari.keepalive-time=

server.address=
```

---

# Frontend Environment Variables

Create:

```txt
.env
```

Example:

```env
EXPO_PUBLIC_BASE_URL=
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=
EXPO_PUBLIC_CLERK_GOOGLE_WEB_CLIENT_ID=
EXPO_PUBLIC_CLERK_GOOGLE_ANDROID_CLIENT_ID=
```

---

# Clerk Setup

## Enable

- Email & Password Authentication
- Google OAuth

## Configure Google OAuth

Add:

- Android Client ID
- iOS Client ID

inside Clerk Dashboard.

---

# Install Dependencies

## Frontend

```bash
bun install
```

or

```bash
npm install
```

---

# Start Expo App

```bash
bunx expo start
```

or

```bash
npx expo start
```

---

# Run Android Development Build

```bash
bunx expo run:android
```

---

# Run iOS Development Build

```bash
bunx expo run:ios
```

---

# Start Backend

## Linux / Mac

```bash
./mvnw spring-boot:run
```

## Windows

```bash
mvnw.cmd spring-boot:run
```

---

# API Features

- Clerk Protected APIs
- Group APIs
- File Upload APIs
- Member Management APIs
- Cloudinary File Storage

---

# Screens

- Login Screen
- Signup Screen
- Home Screen
- Group Screen
- Members Screen
- Profile Screen
- File Sharing Screen

---

# Future Improvements

- Real-time Chat
- Push Notifications
- Group Avatars
- File Preview
- Search & Filtering
- Voice Notes
- Real-time Collaboration

---

# Author

Sushant Sonkamble

GitHub:
https://github.com/Sushant78-CS

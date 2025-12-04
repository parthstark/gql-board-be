# Project Management GraphQL API

A simple project management system built with GraphQL, Apollo Server, and TypeScript.

## Features

- User management
- Board creation and management
- Task creation with subtasks
- Task assignment and status updates
- Comments on tasks

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Server runs on `http://localhost:4000`

## GraphQL Playground

Visit `http://localhost:4000` to access the GraphQL playground and explore the API.

<img width="1440" height="776" alt="playground" src="https://github.com/user-attachments/assets/4f37254f-79cc-4c31-9e66-2152bbc2d131" />

## Example Queries

```graphql
# Get all boards
query {
  boards {
    id
    title
    key
    tasks {
      key
      title
      status
    }
  }
}

# Create a task
mutation {
  addTask(
    title: "New Task"
    boardKey: "PROJ"
    assigneeEmail: "user@example.com"
  ) {
    key
    title
    status
  }
}

# Update a task
mutation {
  updateTask(
    taskKey: "PROJ-1"
    status: "IN_PROGRESS"
    title: "Updated Task"
  ) {
    key
    title
    status
  }
}
```

## Tech Stack

- Node.js + TypeScript
- Apollo Server
- GraphQL
- LowDB (JSON file database)

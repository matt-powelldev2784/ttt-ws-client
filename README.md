# Tic‑Tac‑Toe WebSocket Client

A Vite + React client for a real‑time Tic‑Tac‑Toe game over WebSockets.

## Features

- Real‑time multiplayer via WebSocket
- Simple 3×3 grid UI
- Connection states and game status handling

## Tech Stack

- Vite + React + TypeScript
- Tailwind CSS

## WebSocket Server

This client connects to the server in this repo:

https://github.com/matt-powelldev2784/ttt-ws-server

The server is deployed on Render.

## Environment Variables

Create a `.env` file in the project root:

```
VITE_SERVER_URL_LOCAL=ws://localhost:8081/ws
```

## Getting Started

Install dependencies:

```
npm install
```

Run the app locally:

```
npm run dev
```

## Build

```
npm run build
```

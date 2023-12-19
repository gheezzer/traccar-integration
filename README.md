# Traccar Server Integration

This project is a simple integration with Traccar, an open-source vehicle tracking platform. The integration includes user creation, session authentication, and communication with the Traccar server using WebSocket.

## Prerequisites
Make sure you have Docker and Node installed on your machine before getting started.

## Installation Guide

Usage Instructions

Clone this repository to your local environment:

```bash
git clone https://github.com/gheezzer/traccar-integration.git
```

Navigate to the project directory:

```bash
cd traccar-integration
```

Build the Docker image for the Traccar server:

```bash
sudo docker build -t traccar-server .
```

Run the Traccar server Docker container:

```bash
sudo docker run -p 8082:8082 -p 5011:5011 --name traccar-container traccar-server
```

Ensure that ports `8082` and `5011` are not in use by other services.

Port 5011 refers to the `Suntech` tracker; if testing with another model, it's necessary to check the correct port in the documentation.

After a successful execution, the Traccar Server will be available at http://localhost:8082.

The index.js file contains the logic for creating users, authenticating sessions, and connecting to the Traccar server via WebSocket.

This is a project to assist in the initial integration with the Traccar Server.

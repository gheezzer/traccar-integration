import WebSocket from "ws";
import axios from "axios";

const baseUrl = "http://localhost:8082";
const email = "admin@123.com";
const password = "admin";
let sessionCookie;
let session;

// axios.interceptors.request.use((request) => {
//   console.log(`Initiating request: ${request.method} ${request.url}`);
//   console.log("Headers:", request.headers);
//   return request;
// });

const makeRequest = async (method, endpoint, data = null) => {
  try {
    const headers = {
      "Content-Type": "application/json",
      ...(endpoint.includes("/api/session") && {
        "Content-Type": "application/x-www-form-urlencoded",
      }),
    };

    const response = await axios({
      method,
      url: `${baseUrl}${endpoint}`,
      data,
      headers,
    });

    if (endpoint.includes("/api/session")) {
      sessionCookie = response.headers["set-cookie"][0].split(";")[0];
    }

    return response.data;
  } catch (error) {
    console.error("Request error:", error.message);
    throw error;
  }
};

const createUser = async () => {
  try {
    const newUser = await makeRequest("POST", "/api/users", {
      name: "Admin",
      email,
      password,
    });
    console.log("New user:", newUser);

    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

const createSession = async () => {
  try {
    const newSession = await makeRequest("POST", "/api/session", {
      email,
      password,
    });

    console.log("New session:", newSession);
    return newSession;
  } catch (error) {
    throw error;
  }
};

const connectToWebSocket = () => {
  const socketUrl = `ws${baseUrl.substring(4)}/api/socket`;

  const socket = new WebSocket(socketUrl, {
    headers: {
      Cookie: sessionCookie,
    },
  });

  socket.onopen = () => {
    console.log("Socket opened");
  };

  socket.onerror = (error) => {
    console.error("Socket error:", error);
  };

  socket.onclose = (event) => {
    console.log("Socket closed", event);
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log("Socket message:", data);
  };
};

const init = async () => {
  try {
    session = await createSession();
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log(
        "Session creation failed. Creating a new user and trying again."
      );
      await createUser();
      session = await createSession();
    } else {
      console.error("Error initializing session:", error);
    }
  }

  if (session) {
    connectToWebSocket();
  }
};

init();

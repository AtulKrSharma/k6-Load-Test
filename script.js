import http from "k6/http";
import { check, sleep } from "k6";
import { b64encode } from "k6/encoding"; // Correct import for Base64 encoding

// Configuration options
export let options = {
  vus: 10, // Number of virtual users
  duration: "30s", // Test duration
};

// User credentials
const username = "gms-prod";
const password = "GroupMedicalServices Rebuild";

// Function to execute the request with Basic Auth
export default function () {
  const credentials = `${username}:${password}`;
  const encodedCredentials = b64encode(credentials); // Encode in base64 using b64encode

  // Make HTTP GET request with Authorization header
  let res = http.get("https://prod-gms.zu.com/", {
    headers: {
      Authorization: `Basic ${encodedCredentials}`,
    },
  });

  // Check if the response is OK
  check(res, {
    "status is 200": (r) => r.status === 200,
  });

  sleep(1); // Pause between iterations
}

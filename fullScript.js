import http from "k6/http";
import { check, sleep } from "k6";
import { b64encode } from "k6/encoding"; // Import encoding module

// Configuration options for Simple Load Profile
export const options = {
  vus: 10, // Number of virtual users
  duration: "1m", // Test duration
  cloud: {
    projectID: 3715693,
    // Test runs with the same name groups test runs together
    name: "GMS2.0- Demo",
  },
};

// Configuration options for ramp up and ramp down Load Profile
// export const options = {
//   stages: [
//     { duration: "1m", target: 7 },
//     { duration: "1m", target: 14 },
//     { duration: "1m", target: 21 },
//     { duration: "1m", target: 34 },
//     { duration: "1m", target: 67 },
//   ],
// };

// User credentials
const username = "gms-prod";
const password = "GroupMedicalServices Rebuild";

// List of URLs to test
const urls = [
  "https://prod-gms.zu.com/#main-content",
  "https://prod-gms.zu.com/",
  "https://prod-gms.zu.com/about-gms",
  "https://prod-gms.zu.com/contact-us",
  "https://prod-gms.zu.com/health-dental-claims",
  "https://prod-gms.zu.com/vtc-claims",
  "https://prod-gms.zu.com/trip-cancellation-claims",
  "https://prod-gms.zu.com/emergency-medical-claims",
  "https://prod-gms.zu.com/baggage-claims",
  "https://prod-gms.zu.com/health-insurance",
  "https://prod-gms.zu.com/health-insurance/personal-health-insurance",
  "https://prod-gms.zu.com/health-insurance/replacement-health-insurance",
  "https://prod-gms.zu.com/travel-insurance",
  "https://prod-gms.zu.com/travel-insurance/emergency-medical-insurance",
  "https://prod-gms.zu.com/travel-insurance/trip-cancellation-interruption-insurance",
  "https://prod-gms.zu.com/visitors-to-canada-insurance",
  "https://prod-gms.zu.com/group-health-insurance-plans",
  "https://prod-gms.zu.com/insurance-resource-hub",
  "https://prod-gms.zu.com/resource-hub/forms",
  "https://prod-gms.zu.com/resource-hub/documents",
  "https://prod-gms.zu.com/insurance-resource-hub/frequently-asked-questions",
  "https://prod-gms.zu.com/insurance-resource-hub/insurance-articles",
  "https://prod-gms.zu.com/resource-hub/gms-care-network",
  "https://prod-gms.zu.com/resource-hub/pay-direct-provider-locator",
  "https://prod-gms.zu.com/insurance-resource-hub/replacement-health-drug-lookup",
  "https://prod-gms.zu.com/about-gms#queen-city-marathon",
  "https://prod-gms.zu.com/insurance-articles/exploring-virtual-healthcare-key-advantages-and-benefits",
  "https://prod-gms.zu.com/insurance-articles/provincial-health-plans-what-does-canadian-health-care-cover",
  "https://prod-gms.zu.com/news",
  "https://prod-gms.zu.com/news/company-updates/celebrating-75-years-your-trust-us",
  "https://prod-gms.zu.com/news/company-updates/gms-named-2024-top-saskatchewan-employer",
  "https://prod-gms.zu.com/claims-turnaround-times",
  "https://prod-gms.zu.com/gms-broker-network",
  "https://prod-gms.zu.com/about-gms/careers",
  "https://prod-gms.zu.com/legal-notice",
  "https://prod-gms.zu.com/unclaimed-property",
  "https://prod-gms.zu.com/privacy-policy",
];

export default function () {
  // Randomly select a URL
  const randomIndex = Math.floor(Math.random() * urls.length);
  const url = urls[randomIndex];
  //ss console.log(url);

  // Encode credentials for Basic Auth
  const credentials = `${username}:${password}`;
  const encodedCredentials = b64encode(credentials);

  // Make HTTP GET request to the selected URL with Authorization header
  let res = http.get(url, {
    headers: {
      Authorization: `Basic ${encodedCredentials}`,
    },
  });

  // Check if the response is OK
  check(res, {
    "status is 200": (r) => r.status === 200,
  });
  // console.log("hello");
  sleep(Math.floor(Math.random() * 5)); // Pause random time after the request
}

//powershell cmds to run the k6 dashboard and html report
// $env:K6_WEB_DASHBOARD="true"
// $env:K6_WEB_DASHBOARD_EXPORT="html-report.html"
// k6 run script.js

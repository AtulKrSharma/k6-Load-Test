import http from "k6/http";
import { check, sleep } from "k6";
import { browser, chromium } from "k6/browser";
import { b64encode } from "k6/encoding"; // Import encoding modules

// User credentials
const username = "gms-prod";
const password = "GroupMedicalServices Rebuild";
const websiteUrl = `https://${username}:${password}@prod-gms.zu.com/`; // Replace with the actual URLs

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

// Define different scenarios for both protocol-level testing and browser testing
export const options = {
  cloud: {
    projectID: 3715693,
    // Test runs with the same name groups test runs together
    name: "GMS2.0-XhybridtestingX",
  },
  scenarios: {
    // Scenario 1: Protocol-level (HTTP) load testing
    protocol_testing: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "10s", target: 1 }, // Ramp up to 10 VUs in 20s
        { duration: "10s", target: 1 }, // Maintain 10 VUs for 20s
        { duration: "10s", target: 0 }, // Ramp down to 0 VUs
      ],
      exec: "protocolTest", // The function to execute for protocol-level testing
    },

    // Scenario 2: Browser-based load testing
    browser_testing: {
      executor: "shared-iterations",
      vus: 1, // Number of browser-based virtual users
      iterations: 1, // Number of total iterations across the VUs
      maxDuration: "10s",
      exec: "browserTest", // The function to execute for browser-based testing
      options: {
        browser: {
          type: "chromium",
        },
      },
    },
  },
};

// Scenario 1: Protocol-level testing function
export function protocolTest() {
  // Randomly select a URL
  const randomIndex = Math.floor(Math.random() * urls.length);
  const url = urls[randomIndex];

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

  sleep(Math.floor(Math.random() * 5)); // Pause random time after the request
}

// Scenario 2: Browser-based testing function
export async function browserTest() {
  const page = await browser.newPage();

  try {
    //Set HTTP Basic Authentication credentials
    // await page.setHTTPCredentials({
    //   username: username,
    //   password: password,
    // });

    // Navigate to the URL
    await page.goto(websiteUrl);

    console.log("Logged in successfully!");

    // Extract all hyperlinks after login
    // const links = await page.$$eval("a", (anchors) =>
    //   anchors.map((anchor) => anchor.href)
    // );
    const links = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("a")).map(
        (anchor) => anchor.href
      );
    });
    console.log("Captured Links:", links);

    // Loop through each link and click it
    for (const link of links) {
      try {
        console.log(`Navigating to: ${link}`);
        await page.goto(link); // Navigate to the hyperlink
        await page.waitForTimeout(2000); // Optional: wait for 2 seconds for the page to load

        // Get the page title after navigating to each link
        const pageTitle = await page.title();
        console.log(`Page Title for ${link}: ${pageTitle}`);
      } catch (error) {
        console.error(`Failed to navigate to ${link}:`, error);
        s;
      }
    }
  } finally {
    await page.close(); // Ensure browser closes after the test is done
  }
}

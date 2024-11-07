// Credit @michaelkitas: https://github.com/michaelkitas/CapSolver-Recaptcha-Python/blob/main/recaptchav2.py

import "dotenv/config";
import CapSolver from "../dist/index.js";
import { chromium } from "playwright";

(async () => {
	const capSolver = new CapSolver(process.env.CAPSOLVER_API_KEY); // Set an API key in .env

	const solution = await capSolver.solve({
		type: "ReCaptchaV2TaskProxyLess", // Use "ReCaptchaV2Task" if using proxies
		websiteKey: "6Le-wvkSAAAAAPBMRTvw0Q4Muexq9bi0DJwx_mJ-", // Domain's public key (site key)
		websiteURL: "https://www.google.com/recaptcha/api2/demo", // URL of the page with the reCAPTCHA
		// Optional Parameters:
		// proxy: "http://user:password@123.123.123.123:8080", // Required if using "ReCaptchaV2Task"
		// isInvisible: false, // Set to true if the reCAPTCHA is invisible
		// userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...", // Specify the User-Agent if needed
		// cookies: "name=value; name2=value2", // Include cookies if necessary
	});

	console.log("CapSolver Solution:", solution);

	// Extract the CAPTCHA token from the solution
	const token = solution?.solution?.gRecaptchaResponse;

	if (!token) {
		console.log("Failed to get CAPTCHA token from CapSolver.");
		return;
	}

	// Set up Playwright
	const browser = await chromium.launch({ headless: false }); // Set to true to run headless
	const context = await browser.newContext();
	const page = await context.newPage();

	try {
		// Navigate to the target website
		await page.goto("https://www.google.com/recaptcha/api2/demo");

		// Wait for the reCAPTCHA to load
		await page.waitForSelector(".g-recaptcha", { timeout: 10000 });

		// Inject the CAPTCHA token into the page
		await page.evaluate((token) => {
			(document.getElementById("g-recaptcha-response")).style.display = "block";
			(document.getElementById("g-recaptcha-response")).value = token;
		}, token);

		// Submit the form
		await page.click("#recaptcha-demo-submit");

		// Wait for the result page to load
		await page.waitForSelector(".recaptcha-success", { timeout: 10000 });

		// Print the result
		const result = await page.$eval(".recaptcha-success", (el) => el.textContent);
		console.log("Result:", result?.trim());
	} catch (error) {
		console.error("An error occurred:", error);
	} finally {
		// Close the browser
		await browser.close();
	}
})();

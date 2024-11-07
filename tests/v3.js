// Credit @michaelkitas: https://github.com/michaelkitas/CapSolver-Recaptcha-Python/blob/main/recaptchav3.py

import "dotenv/config";
import CapSolver from "../dist/index.js";
import { chromium } from "playwright";

(async () => {
	const capSolver = new CapSolver(process.env.CAPSOLVER_API_KEY); // Replace with your actual API key

	// Solve the reCAPTCHA using CapSolver
	const solution = await capSolver.solve({
		type: 'ReCaptchaV3TaskProxyLess', // Required. Use 'ReCaptchaV3Task' if using proxies
		websiteKey: '6LdKlZEpAAAAAAOQjzC2v_d36tWxCl6dWsozdSy9', // Required. The domain's public key (site key)
		websiteURL: 'https://recaptcha-demo.appspot.com/recaptcha-v3-request-scores.php', // Required. The URL of the page where the reCaptcha is located
		pageAction: 'homepage', // Required. The action parameter for reCaptcha v3
	});

	console.log('CapSolver Solution:', solution);

	// Extract the CAPTCHA token from the solution
	const token = solution?.solution?.gRecaptchaResponse;

	if (!token) {
		console.log('Failed to get CAPTCHA token from CapSolver.');
		return;
	}

	// Set up Playwright
	const browser = await chromium.launch({ headless: false }); // Set to true to run headless
	const context = await browser.newContext();
	const page = await context.newPage();

	try {
		// Navigate to the target website
		await page.goto('https://recaptcha-demo.appspot.com/recaptcha-v3-request-scores.php');

		// Wait for the reCAPTCHA API to be loaded
		await page.waitForFunction(() => typeof window.grecaptcha !== 'undefined', { timeout: 10000 });

		// Override grecaptcha.execute to return our token
		await page.evaluate((token) => {
			window.grecaptcha.execute = function (siteKey, options) {
				return Promise.resolve(token);
			};
		}, token);

		// Click the button to invoke reCAPTCHA
		await page.click('input[type="submit"]');

		// Wait until the result text is present in the response element
		await page.waitForFunction(() => {
			const responseElement = document.querySelector('.response');
			return responseElement && responseElement.textContent && responseElement.textContent.trim() !== '';
		}, { timeout: 10000 });

		// Print the result
		const result = await page.$eval('.response', (el) => el.textContent);
		console.log('Result:', result?.trim());
	} catch (error) {
		console.error('An error occurred:', error);
	} finally {
		// Close the browser
		await browser.close();
	}
})();
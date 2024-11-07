import "dotenv/config";
import CapSolver from "../dist/index.js";
import * as fs from "fs";

(async () => {
	const solver = new CapSolver(process.env.CAPSOLVER_API_KEY, { // Set an API key in .env
		verbose: true, // Optional
		verboseIdentifier: "[Image Solve]", // Optional & not required when verbose: true
	});

	try {
		const data = await solver.getBalance();
		if (data?.balance > 0) {
			const task = await solver.solve({
				type: "ImageToTextTask",
				body: fs.readFileSync("test/test.png"), // Should return "testv"
			});
			console.log(task.solution.text);
		} else {
			console.log("Insufficient balance.");
		}
	} catch (error) {
		console.error("An error occurred:", error);
	}
})();
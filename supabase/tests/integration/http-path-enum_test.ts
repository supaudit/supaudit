import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

const EDGE_FUNCTION_URL = "http://127.0.0.1:54321/functions/v1/http-path-enum";

interface Result {
	url: string;
	statusCode: number;
	bodySize: number;
}

interface RequestBody {
	url: string;
}

Deno.test("Test HttpPathEnum edge function", async () => {
	const requestPayload: RequestBody = { url: "https://scanme.nmap.org" };

	const response: Response = await fetch(EDGE_FUNCTION_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(requestPayload),
	});

	assertEquals(response.status, 200);

	const json: Result[] = await response.json();

	assertEquals(Array.isArray(json), true);

	if (json.length > 0) {
		const firstResult: Result = json[0];
		assertEquals(typeof firstResult.url, "string");
		assertEquals(typeof firstResult.statusCode, "number");
		assertEquals(typeof firstResult.bodySize, "number");
	}
});

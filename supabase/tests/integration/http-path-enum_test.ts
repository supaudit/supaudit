import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { AuditReportState } from '../../../types.ts';

const EDGE_FUNCTION_URL = "http://127.0.0.1:54321/functions/v1/http-path-enum";

interface Result {
	url: string;
	statusCode: number;
	bodySize: number;
}

export const mockAuditReportState: AuditReportState = {
	domains: {
		"example.com": {
			name: "example.com",
			records: {
				A: ["192.168.1.1"],
				MX: ["mail.example.com"],
				TXT: ["v=spf1 include:example.com ~all"]
			},
			subdomains: [
				{
					name: "sub.example.com",
					records: {
						A: ["192.168.1.2"]
					},
					subdomains: [
						{
							name: "subsub.example.com",
							records: {
								A: ["192.168.1.3"]
							},
							subdomains: [],
							http: {
								https: true,
								paths: {
									"https://subsub.example.com": {
										url: "https://subsub.example.com",
										response: {
											status: 200,
											headers: {
												"Content-Type": "text/html"
											},
											bodySize: 2048
										}
									}
								}
							}
						}
					],
					http: {
						https: true,
						paths: {
							"https://sub.example.com": {
								url: "https://sub.example.com",
								response: {
									status: 404,
									headers: {
										"Content-Type": "text/html"
									},
									bodySize: 512
								}
							}
						}
					}
				}
			],
			http: {
				https: true,
				paths: {
					"https://example.com": {
						url: "https://example.com",
						response: {
							status: 200,
							headers: {
								"Content-Type": "text/html"
							},
							bodySize: 1024
						}
					}
				}
			}
		},
		"test.com": {
			name: "test.com",
			records: {
				A: ["203.0.113.1"],
				CNAME: ["www.test.com"]
			},
			subdomains: [],
			http: {
				https: false,
				paths: {
					"http://test.com": {
						url: "http://test.com",
						response: {
							status: 301,
							headers: {
								"Location": "https://test.com"
							},
							bodySize: 0
						}
					},
					"https://test.com": {
						url: "https://test.com",
						response: {
							status: 200,
							headers: {
								"Content-Type": "text/html"
							},
							bodySize: 1500
						}
					}
				}
			}
		}
	}
}


Deno.test("Test HttpPathEnum edge function", async () => {
	const response: Response = await fetch(EDGE_FUNCTION_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			state: mockAuditReportState,
			prompt: ''
		}),
	});

	assertEquals(response.status, 200);

	const json: Result[] = await response.json();

	console.log(json);

	// assertEquals(Array.isArray(json), true);
	//
	// if (json.length > 0) {
	// 	const firstResult: Result = json[0];
	// 	assertEquals(typeof firstResult.url, "string");
	// 	assertEquals(typeof firstResult.statusCode, "number");
	// 	assertEquals(typeof firstResult.bodySize, "number");
	// }
});

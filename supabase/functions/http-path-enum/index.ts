import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import Instructor from "npm:@instructor-ai/instructor";
import OpenAI from 'https://deno.land/x/openai@v4.24.0/mod.ts'
import { z } from "https://deno.land/x/zod/mod.ts";

import { FunctionRequest, LlmHttpPathEnumResponse } from '../types.ts'

const makeHttpRequest = async (url: string): Promise<Result> => {
	const response = await fetch(url);
	const bodyText = await response.text();
	const bodySize = bodyText.length;

	return {
		url,
		statusCode: response.status,
		bodySize,
	};
};

const processUrls = async (urlList: LlmHttpPathEnumResponse): Promise<Result[]> => {
	const results: Result[] = [];

	for (const url of urlList) {
		try {
			const result = await makeHttpRequest(url);
			results.push(result);
		} catch (error) {
			console.error(`Failed to fetch ${url}:`, error);
		}
	}

	// TODO: Refresh state

	return results;
};

const makeLlmResponse = async (funcReq: FunctionRequest): Promise<LlmHttpPathEnumResponse> => {
	const apiKey = Deno.env.get('OPENAI_API_KEY')

	const openai = Instructor({
		client: new OpenAI({ apiKey: apiKey }),
		mode: "FUNCTIONS"
	})

	const prompt = `
		You are a pentesting machine and now your actual role is a HTTP path enumerator. 
		In this moment you have the next contextual information:
		${JSON.stringify(funcReq.state)}
		
		Generate a list of URLs with generated paths based of the previous context and also the next prompt:
		${funcReq.prompt}  
	`;

	const response = await openai.chat.completions.create({
		messages: [{ role: 'user', content: prompt }],
		model: 'gpt-4o',
		response_model: {
			schema: z.object({urls: z.array(z.string())}),
			name: "urls"
		}
	})

	console.debug(response.urls)

	return response.urls as LlmHttpPathEnumResponse
};

const entrypoint = async (req): Promise<Result> => {
	const funcReq = (await req.json()) ?? {} as Partial<FunctionRequest>;
	const urlList = await makeLlmResponse(funcReq);
	const results = await processUrls(urlList);

	return new Response(JSON.stringify(results), {
		headers: { "Content-Type": "application/json" },
	});
};

Deno.serve(async (req) => {
	try {
		return await entrypoint(req);
	} catch (error) {
		console.error("Error:", error instanceof Error ? error.message : error);
		return new Response(
			JSON.stringify({
				error: error instanceof Error ? error.message : "Unknown error",
			}),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			},
		);
	}
});

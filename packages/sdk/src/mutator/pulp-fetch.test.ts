import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { pulpFetch } from "./pulp-fetch";

describe("Integration: pulpFetch", { tags: ["integration"] }, () => {
	const server = setupServer();

	beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
	afterEach(() => server.resetHandlers());
	afterAll(() => server.close());

	it("resolves with the parsed JSON body on a 2xx response", async () => {
		server.use(
			http.get("/pulp/api/v3/status/", () =>
				HttpResponse.json({ version: [] }),
			),
		);

		const result = await pulpFetch("/pulp/api/v3/status/", { method: "GET" });

		expect(result).toStrictEqual({ version: [] });
	});

	it("throws error carrying the status and parsed body on a non-2xx response", async () => {
		server.use(
			http.get("/pulp/api/v3/status/", () =>
				HttpResponse.json({ detail: "Not found." }, { status: 404 }),
			),
		);

		await expect(
			pulpFetch("/pulp/api/v3/status/", { method: "GET" }),
		).rejects.toMatchObject({
			status: 404,
			data: { detail: "Not found." },
		});
	});

	it("sets Content-Type: application/json when a body is present and none is set", async () => {
		let contentType: string | null = null;
		server.use(
			http.post("/pulp/api/v3/repositories", async ({ request }) => {
				contentType = request.headers.get("content-type");
				return HttpResponse.json({});
			}),
		);

		await pulpFetch("/pulp/api/v3/repositories/", {
			method: "POST",
			body: JSON.stringify({ name: "test" }),
		});

		expect(contentType).toStrictEqual("application/json");
	});

	it("throws with the raw text body when a non-2xx non-JSON response", async () => {
		server.use(
			http.get(
				"/pulp/api/v3/status",
				() =>
					new HttpResponse("<html>Internal Server Error</html>", {
						status: 500,
						headers: { "Content-Type": "text/html" },
					}),
			),
		);

		await expect(
			pulpFetch("/pulp/api/v3/status/", { method: "GET" }),
		).rejects.toMatchObject({
			status: 500,
			data: "<html>Internal Server Error</html>",
		});
	});

	it("does not override a Content-Type header the caller has already set", async () => {
		let contentType: string | null = null;
		server.use(
			http.post("/pulp/api/v3/repositories", async ({ request }) => {
				contentType = request.headers.get("content-type");
				return HttpResponse.json({});
			}),
		);

		await pulpFetch("/pulp/api/v3/repositories/", {
			method: "POST",
			headers: { "Content-Type": "application/merge-patch+json" },
			body: JSON.stringify({ name: "test" }),
		});

		expect(contentType).toStrictEqual("application/merge-patch+json");
	});

	it("sends credentials: include on every request", async () => {
		let credentials: Request["credentials"] | undefined;
		server.use(
			http.get("/pulp/api/v3/status/", ({ request }) => {
				credentials = request.credentials;
				return HttpResponse.json({ version: [] });
			}),
		);

		await pulpFetch("/pulp/api/v3/status/", { method: "GET" });

		expect(credentials).toStrictEqual("include");
	});

	it("does not set Content-Type when there is no body", async () => {
		let contentType: string | null = null;
		server.use(
			http.get("/pulp/api/v3/status/", ({ request }) => {
				contentType = request.headers.get("content-type");
				return HttpResponse.json({ version: [] });
			}),
		);

		await pulpFetch("/pulp/api/v3/status/", { method: "GET" });

		expect(contentType).toBeNull();
	});

	it("uses application/merge-patch+json for PATCH when the caller sets no Content-Type", async () => {
		let contentType: string | null = null;
		server.use(
			http.patch(
				"/pulp/api/v3/repositories/rpm/rpm/1234567890/",
				({ request }) => {
					contentType = request.headers.get("content-type");
					return HttpResponse.json({});
				},
			),
		);

		await pulpFetch("/pulp/api/v3/repositories/rpm/rpm/1234567890/", {
			method: "PATCH",
			body: JSON.stringify({ name: "test" }),
		});

		expect(contentType).toStrictEqual("application/merge-patch+json");
	});

	it("resolves with undefined on a 204 No Content response", async () => {
		server.use(
			http.delete("/pulp/api/v3/rpm/rpm/1234567890", () => {
				return new HttpResponse(null, { status: 204 });
			}),
		);

		const result = await pulpFetch("/pulp/api/v3/rpm/rpm/1234567890", {
			method: "DELETE",
		});

		expect(result).toBeUndefined();
	});

	it("throws when a 2xx response is missing Content-Type", async () => {
		server.use(
			http.get("/pulp/api/v3/status/", () => {
				const res = new HttpResponse("No Headers", { status: 200 });
				res.headers.delete("content-type");
				return res;
			}),
		);

		await expect(
			pulpFetch("/pulp/api/v3/status/", { method: "GET" }),
		).rejects.toThrow("Response missing Content-Type header");
	});
});

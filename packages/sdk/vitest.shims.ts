import "vitest";

declare module "vitest" {
	interface TestTags {
		tags: "integration" | "unit" | "component";
	}
}

/** @type {import('jest').Config} */
module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	roots: ["<rootDir>/src", "<rootDir>/__test__"],
	testMatch: ["**/*.test.ts"],
	moduleFileExtensions: ["ts", "js", "json"],
	transform: {
		"^.+\\.ts$": ["ts-jest", { tsconfig: "tsconfig.jest.json" }],
	},
	passWithNoTests: true,
	clearMocks: true,
	collectCoverageFrom: ["src/**/*.ts", "!src/**/*.d.ts"],
};

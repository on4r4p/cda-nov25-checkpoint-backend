import { celsiusToFahrenheit } from "../src/utils/temp";

describe("celsiusToFahrenheit", () => {
	it("converts 20°C to 68°F", () => {
		expect(celsiusToFahrenheit(20)).toBe(68);
	});

	it("converts 30°C to 86°F", () => {
		expect(celsiusToFahrenheit(30)).toBe(86);
	});

	it("converts -10°C to 14°F", () => {
		expect(celsiusToFahrenheit(-10)).toBe(14);
	});

	it("converts decimal values", () => {
		expect(celsiusToFahrenheit(22.7)).toBeCloseTo(72.86);
	});
});

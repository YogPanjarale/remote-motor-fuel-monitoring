export function clamp(n: number, min: number, max: number) {
	if (n > max) {
		return max;
	} else if (n < min) {
		return min;
	} else {
		return n;
	}
}

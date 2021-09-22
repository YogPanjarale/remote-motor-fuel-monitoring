import lsq from "./least-square";

//Voltage
const X = [
    15, 24, 36, 48, 59, 68, 78, 87, 96, 104, 112, 120, 128, 136, 143, 150, 158,
	165, 172, 179, 186, 192, 199, 206, 213, 219, 226, 233, 240, 246, 252, 259,
	266, 272, 279, 286, 292, 299, 306, 312, 319, 326, 333, 340, 347, 354, 361,
	368, 376, 383, 391, 399, 407, 416, 425, 432,
];
//volume
const Y = [
0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90,
95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160, 165,
    170, 175, 180, 185, 190, 195, 200, 205, 210, 215, 220, 225, 230, 235, 240,
    245, 250, 255, 260, 265, 270, 275,
];

const f = lsq(X, Y);

export default function getVolume(voltage:number) {
	return Math.round(f(voltage*100));
}
let a =getVolume(4);
// a+=1
console.log("Expected = ",1 , " Got = ",a);
// assert(a === 10);

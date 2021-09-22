export default function NonLinearRegression(
	X: number[],
	Y: number[],
): (x: number) => number {
	return function (x:number): number {
        // console.log("x = ",x)
        const i = X.findIndex(x_i => x_i > x);
        const  [ a,b] = [X[i-1],Y[i-1]]
        const [c,d] = [X[i],Y[i]]
        // console.log(i);
        // console.log("a = ",a," b = ",b)
        // console.log("c = ",c," d = ",d)
        if (a === x){
            return b
        }
        if (a === undefined&&c === x){
            return d;
        }
        if (x>a&&x<c){
            return (x-a)*(d-b)/(c-a)+b
        }
		return 0;
	};
}

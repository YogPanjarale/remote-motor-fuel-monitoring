const FuelLevel = ({ level, deviceId }:{level:number,deviceId:string}) => {
    const {value,percentage} = getFuelLiters(level,deviceId);
	return (
		<h1 className="text-lg font-semibold text-gray-800 bg-red-400 w-min whitespace-nowrap p-1 rounded-md">
			Fuel level: {value}liters ({percentage}%)  {percentage < 20 ?<span className="bg-white">Low Fuel!!</span>  :"" }
		</h1>
	);
};
export default FuelLevel;
function getFuelLiters(level: number, deviceId: string) {
 return {
     value:level/5,
     percentage:Number(((level)/1024*100).toFixed())
 }  
}


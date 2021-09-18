import Head from "next/head";
import { useState } from "react";

function Device() {
	const [checkBox, setCheckBox] = useState(false);
	const [engineTemp1, setengineTemp1] = useState(0);
	const [engineTemp2, setengineTemp2] = useState(0);
	const [engineTemp3, setengineTemp3] = useState(0);
	const [vacuumTemp, setVacuumTemp] = useState(0);
	const [engineRpm, setEngineRpm] = useState(0);
	const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
		//@ts-ignore
		const value = e.target?.checked;
		console.log(value);
		setCheckBox(value);
	};
	return (
		<>
			<Head>
				<title>Remote Fuel Monitoring and Pump Control</title>
			</Head>
			<div className="flex justify-center items-start flex-col p-4 pl-6">
				<h1 className="text-2xl font-bold my-2 text-gray-800">
					Remote Fuel Monitoring and Pump Control
				</h1>
				<hr className="h-2 w-full bg-gray-200 my-2 " />
				<div>
					<h2 className="text-2xl font-bold text-gray-700 ">
						Engine
					</h2>
					<div className="relative inline-block w-10 mr-2 pt-2 align-middle select-none transition duration-200 ease-in ">
						<input
							type="checkbox"
							name="toggle"
							id="toggle"
							className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
							onChange={handleChange}
							checked={checkBox}
						/>
						<label
							htmlFor="toggle"
							className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
						></label>
					</div>
					<label htmlFor="toggle" className="text-xs text-gray-700">
						Motor On/Off
					</label>
					<p className="text-xl text-gray-800 font-bold py-2 rounded">
						Engine Temperature 1 : {engineTemp1} °C
					</p>
					<p className="text-xl text-gray-800 font-bold py-2 rounded">
						Engine Temperature 2 : {engineTemp2} °C
					</p>
					<p className="text-xl text-gray-800 font-bold py-2 rounded">
						Engine Temperature 3 : {engineTemp3} °C
					</p>
					<p className="text-xl text-gray-800 font-bold py-2 rounded">
						Vacuum Pump Temperature : {vacuumTemp} °C
					</p>
					<p className="text-xl text-gray-800 font-bold py-2 rounded">
						Engine RPM : {engineRpm} RPM
					</p>
					{/* Engine Running hours */}
					<p className="text-xl text-gray-800 font-bold py-2 rounded">
						Engine Running hours : 0 hours
					</p>
					<hr className="h-2 w-full bg-gray-200 my-2 " />
					<h2 className="text-2xl font-bold text-gray-700 ">Water</h2>
					<p className="text-xl text-gray-800 font-bold py-2 rounded">
						Water Presence : No
					</p>
					<p className="text-xl text-gray-800 font-bold py-2 rounded">
						Dry Run : No
					</p>
					<p className="text-xl text-gray-800 font-bold py-2 rounded">
						Water Flow : 0 L/min
					</p>
					<p className="text-xl text-gray-800 font-bold py-2 rounded">
						Water Flow Volume (Total) : 0 L
					</p>
					<hr className="h-2 w-full bg-gray-200 my-2 " />
					<h2 className="text-2xl font-bold text-gray-700 ">Fuel</h2>
					<p className="text-xl text-gray-800 font-bold py-2 rounded">
						Fuel Volume : 0 L
					</p>
					<p className="text-xl text-gray-800 font-bold py-2 rounded">
						Fuel Filled Percentage : 0 %
					</p>
					<p className="text-xl text-gray-800 font-bold py-2 rounded">
						Fuel Filled Quantity : 0 L
					</p>
					<p className="text-xl text-gray-800 font-bold py-2 rounded">
						Fuel Drained Quantity : 0 L
					</p>
					<hr className="h-2 w-full bg-gray-200 my-2 " />
				</div>
			</div>
		</>
	);
}

export default Device;

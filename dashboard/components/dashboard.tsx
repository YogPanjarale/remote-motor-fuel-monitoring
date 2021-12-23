import { useState } from "react";
import { DeviceDoc } from "../lib/types";
import FuelLevel from "./FuelLevel";

type menu = "Home" | "History" | "Settings";

const SideBar = ({current,setCurrent}:{current:menu,setCurrent}) => {
    const btn = ["Home","History","Settings"]
	return <div className=" flex flex-col space-y-2  m-2 p-2 bg-gray-800 shadow-md rounded-md">
        {btn.map(n=>{
            return <button className={`text-lg font-semibold text-white ${current==n?"underline":"shadow-md"}`} onClick={()=>setCurrent(n)}>
				{n}
			</button>
        })}
    </div>;
};
const Header = () => {
	return (
		<div className=" flex flex-row justify-start m-2 p-2  bg-gray-800 shadow-md rounded-md">
			<h1 className="text-lg font-semibold text-white ">
				Remote Fuel Management System
			</h1>
		</div>
	);
};
const DashBoard = ({ data }: { data: DeviceDoc }) => {
    let [current,setCurrent] = useState<menu>("Home")
	return (
		<>
			<div className="bg-gray-700 h-screen p-1">
				<Header />
				<div className="flex flex-row  ">
					<SideBar current={current} setCurrent={setCurrent}/>
                <div className="w-full flex flex-col  m-2 p-2  bg-gray-800 shadow-md rounded-md">
                    <h1 className="text-lg font-semibold text-white ">Device: {data.deviceId}</h1>
                    <div className="flex flex-row space-x-5">
                    {/* // TODO: Convert to time ago */}
                    <h1 className="text-lg font-semibold text-white ">Last Seen : {new Date(data.last_seen).toLocaleString()}</h1>
                    
                    </div>
                    <FuelLevel level={data.json.fuelSensor} calibration_table={data.calibration_table}/>

                </div>
				</div>
			</div>
		</>
	);
};

export default DashBoard;


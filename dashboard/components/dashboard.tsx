import { useState } from "react";
import { DeviceDoc } from "../lib/types";
import FuelLevel from "./FuelLevel";

type menu = "Home" | "History" | "Settings";

const SideBar = ({ current, setCurrent }: { current: menu; setCurrent }) => {
	const btn = ["Home", "History", "Settings"];
	return (
		<div className=" flex flex-col space-y-2  m-2 p-2 bg-gray-800 shadow-md rounded-md">
			{btn.map((n) => {
				return (
					<button
						key={n + "bhurr"}
						className={`text-lg font-semibold text-white ${
							current == n ? "underline" : "shadow-md"
						}`}
						onClick={() => setCurrent(n)}
					>
						{n}
					</button>
				);
			})}
		</div>
	);
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
	let [current, setCurrent] = useState<menu>("Home");
    let [button, setButton] = useState<"reset"|"off"|"on">("on");
	return (
		<>
			<div className="bg-gray-700 h-screen p-1">
				<Header />
				<div className="flex flex-row  ">
					<SideBar current={current} setCurrent={setCurrent} />
					<div className="w-full flex flex-col  m-2 p-2  bg-gray-800 shadow-md rounded-md space-y-5">
						<div className="flex flex-row space-x-5">
							<h1 className="text-lg font-semibold text-white  ">
								Device: {data.deviceId}
							</h1>
							{/* // TODO: Convert to time ago */}
							<h1 className="text-lg font-semibold text-white ">
								Last Seen :{" "}
								{new Date(data.last_seen).toLocaleString()}
							</h1>
						</div>
						<FuelLevel
							level={data.json.fuelSensor}
							calibration_table={data.calibration_table}
						/>
						<h1 className="text-xl font-semibold text-white border-b-[1px] border-gray-200">
							Engine
						</h1>
                        {/* //three position toggle button */}
                        <Toggle setButton={setButton} current={button}/>
					</div>
				</div>
			</div>
		</>
	);
};

export default DashBoard;
function Toggle({setButton,current}) {
    return <div className="w-min flex flex-row space-x-5 border-2 border-gray-200 bg-gray-600 rounded-md  ">
        <Button onClick={() => setButton("reset")} isCurrent={current=="reset"}>Reset</Button>
        <Button onClick={() => setButton("off")} isCurrent={current=="off"}>Off</Button>
        <Button onClick={() => setButton("on")} isCurrent={current=="on"}>On</Button>
        
    </div>;
}

function Button({children, onClick,isCurrent}: {children: string, onClick: () => void,isCurrent?: boolean}) {
    let color = ""
    switch (children) {
        case "Reset":
            color = "bg-amber-500";
            break;
        case "Off":
            color = "bg-red-500";
            break;

        case "On":
            color = "bg-green-500";
            break;
        default:
            color = "bg-gray-200";
            break;
    }
    let a = (<ul>
        <li className="bg-amber-500"></li>
        <li className="bg-red-500"></li>
        <li className="bg-green-500"></li>
        <li className="bg-gray-200"></li>
    </ul>)
    if (children=="no"){
        return a
    }
    return <button className={`text-white p-2 font-semibold  ${isCurrent?(color):""} `} onClick={onClick}>{children}</button>;
}


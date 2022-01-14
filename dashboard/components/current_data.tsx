import React from "react";
import { useQuery, useQueryClient } from "react-query";

export interface Root {
	deviceId: string;
	timestamp: string;
	engine: Engine;
	fuelLevel: number;
	waterFlowing: boolean;
	engineRunningHours: string;
	waterFlowVolumeRate: number;
}

export interface Engine {
	engineTemp1: number;
	engineTemp2: number;
	engineTemp3: number;
	engineTemp4: number;
	lubeOilPressure: number;
	engineRpm: number;
}

const Display = ({ data }: { data: Root }) => {
	return (
		<div className="d-flex row">
			<h6 className="col">
                Last Updated <span className="badge bg-secondary">{new Date(data.timestamp).toLocaleString()}</span>

            </h6>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th scope="col">Sensor</th>
                        <th scope="col">Value</th>
                    </tr>
                </thead>
                <tbody>
                    <DataRow label="Engine Temp 1" value={data.engine.engineTemp1} warning={160} />
                    <DataRow label="Engine Temp 2" value={data.engine.engineTemp2} warning={160} />
                    <DataRow label="Engine Temp 3" value={data.engine.engineTemp3} warning={160} />
                    <DataRow label="Engine Temp 4" value={data.engine.engineTemp4} warning={160} />
                    <tr>
                        <th scope="row">Lube Oil Pressure</th>
                        <td>{data.engine.lubeOilPressure}</td>
                    </tr>
                    <tr>
                        <th scope="row">Engine RPM</th>
                        <td>{data.engine.engineRpm}</td>
                    </tr>
                    <tr>
                        <th scope="row">Water Flow Volume Rate</th>
                        <td>{data.waterFlowVolumeRate}</td>
                    </tr>
                    <tr>
                        <th scope="row">Water Present</th>
                        <td>{data.waterFlowing ? "Yes" : "No"}</td>
                    </tr>
                    <tr>
                        <th scope="row">Engine Running Hours</th>
                        <td>{data.engineRunningHours}</td>
                    </tr>
                    <tr>
                        <th scope="row">Fuel Level</th>
                        <td>{data.fuelLevel} (TODO)</td>
                    </tr>
                </tbody>

            </table>
		</div>
	);
};
function DataRow({label,value,warning}:{label:string,value:any,warning?:number}):JSX.Element {
    return (
        <tr className={`${warning && (warning<value?"table-danger":"")}`}>
            <th scope="row">{label}</th>
            <td>{value}</td>
        </tr>
    )
}
function useDeviceLatestData(id: string) {
	return useQuery("latest-data", async () => {
		const { data } = await fetch(`/api/${id}/latest_data`).then((res) =>
			res.json()
		);
		return data;
	});
}
const CurrentData = ({ id }: { id: string }) => {
	const queryClient = useQueryClient();
	const { status, data, error, isFetching } = useDeviceLatestData(id);
    
	if (status === "loading") {
		return (
            <Wrapper id={id}>
                <div className="d-flex justify-content-center">

                <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
                </div>
            </Wrapper>
		);
	}
    if (status === "error") {
        return (
            <Wrapper id={id}>
                <div className="d-flex justify-content-center">
                    <div className="spinner-border text-danger" role="status">
                        <span className="sr-only">Error</span>
                    </div>
                </div>
            </Wrapper>
        );
    }
    return (
        <Wrapper id={id}>
            <Display data={data} />
        </Wrapper>
    )
};

export { CurrentData };
    function Wrapper({id,children}:{id: string,children:React.ReactNode}): JSX.Element {
        return <div className="container col py-2">
            <div className="col-md-9">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Device {id}</h5>
                        {children}
                    </div>
                </div>
            </div>
        </div>;
    }


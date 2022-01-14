/**
 * Setting page
 * Key Todos:
 * 1. Engine warn level for RPM,temp [1234] ,lube oil pressure,fuel level
 * 2. calibration for fuel level sensor,
 * 3. factors for water flow volume rate , engine rpm sensor
 *
 * Extra:
 * 1. import Setting template from file
 * 2. export Setting to file
 * 3. Edit/Save button
 */
const SettingsDoc = {
	id: "0x001",
	nickname: "Settings 001",
	description: "Settings for the device",
	data: {
		engine: {
			engineTemp1: {
				warn: 180,
			},
			engineTemp2: {
				warn: 180,
			},
			engineTemp3: {
				warn: 180,
			},
			engineTemp4: {
				warn: 180,
			},
			lubeOilPressure: {
				warn: 100,
			},
			engineRpm: {
				warn: 2000,
                factor: 1.0
			},
		},
        waterFlowVolumeRate: {
            factor: 1,
        },
        fuelLevel: {
            // calibrationTable
        }
        

	},
};
const SettingsPage = ({ id }) => {
	return (
		<Wrapper id={id}>
			<div className="card">
				<div className="card-body">
					<h5 className="card-title">Settings {id}</h5>
					<p className="card-text"></p>
				</div>
			</div>
		</Wrapper>
	);
};
function Wrapper({
	id,
	children,
}: {
	id: string;
	children: React.ReactNode;
}): JSX.Element {
	return <div className="container col py-2">{children}</div>;
}
export default SettingsPage;

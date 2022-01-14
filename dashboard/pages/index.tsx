// a page with device id input & go button

import { useRouter } from "next/router";
import { useState } from "react";

export default function page() {
	const router = useRouter();
    const [id, setId] = useState(router.query.id||"");
    const goToDevicePage = (e) => {
        e.preventDefault();
		if (id) {
			router.push(`/device?id=${id}`);
		}
    };
	return (
		<div className="container h-100">
			<div className="d-flex justify-content-md-center align-items-center vh-100">
				<div className="card">
					<form className="card-body" onSubmit={goToDevicePage}>
						<h5 className="card-title">Device ID</h5>
						<p className="card-text">
							<input
								type="text"
								className="form-control"
								placeholder="Enter Device ID"
								value={id}
                                onChange={(e) => setId(e.target.value)}
							/>
						</p>

						<button
							type="button"
							className="btn btn-primary"
							onClick={() => {
								router.push(`/device?id=${id}`);
							}}
                            // href={`/device?id=${id}`}
						>
							Go
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}

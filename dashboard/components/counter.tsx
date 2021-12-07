import { useState, useEffect } from "react";

export default function Counter() {
	const [count, setCount] = useState(0);

	useEffect(() => {
		document.title = `You clicked ${count} times`;
	});

	function handleAlertClick() {
		setTimeout(() => {
			alert("You clicked on: " + count);
		}, 1000);
	}

	return (
		<div>
			<p>You clicked {count} times</p>
			<button
				className="button is-primary is-outlined "
				onClick={() => setCount(count + 1)}
			>
				Click me
			</button>
			<button
				className="button is-primary is-outlined "
				onClick={handleAlertClick}
			>
				Show alert
			</button>
            <i className="fa"></i>
		</div>
	);
}

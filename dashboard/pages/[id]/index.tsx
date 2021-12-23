import { useRouter } from "next/router";
import { useEffect, useState } from "react";


const Page = () => {
    const id = useRouter().query.id;
	let [data, setData] = useState(null);
	useEffect(() => {

	});
	return (
		<div>
			<h1>Hello {id}</h1>
		</div>
	);
};

export default Page;

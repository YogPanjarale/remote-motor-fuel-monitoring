import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import DashBoard from "../../components/dashboard";
import ErrorPage from "../../components/Error";
import getDevice from "../../lib/getDevice";
import clientPromise from "../../lib/mongodb";
import { ApiResponse, DeviceDoc } from "../../lib/types";


const Page = ({id}) => {
    // const id = useRouter().query.id;
	// @dts-ignore

	const {isLoading, isError, data, error} = useQuery<ApiResponse>("device",async()=>await getDevice(id));
	const [device, setDevice] = useState<DeviceDoc>();

	if (isLoading) {
		return <span>Loading...</span>
	  }
	
	  if (data.status){

	  }
	  if (isError) {
		  //@ts-ignore
		return <ErrorPage statusCode={404} message={error.message}/>
	}
	if (data.error){
		  return <ErrorPage statusCode={404} message={data.error}/>
	}
	  // We can assume by this point that `isSuccess === true`
	  return (
		<DashBoard data={data.data as DeviceDoc} />
	  )
};
// get static props sends id

export const getStaticProps = async ({ params }) => {
	const id = params.id;
	// console.log(id)
	return {
		props: {
			id,
		},
	};
};
export const getStaticPaths = async () => {
	const client = await clientPromise;
	const coll = client.db("rfms").collection("devices");
	const docs = await coll.find({}).toArray();
	const paths = docs.map((doc) => ({
		params: {
			id: doc.deviceId,
		},
	}));
	return {
		paths,
		fallback: true,
	};

};

export default Page;

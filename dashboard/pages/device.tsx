import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const views = ["Latest Data", "Settings", "History"];
// a page with a navbar and 3 tabs
export default function page({_id,_v}) {
	const router = useRouter();
	const [id, setId] = useState(_id);
	const [activeTab, setActiveTab] = useState(_v);
	useEffect(
		() => {
			setId(router.query.id);
			setActiveTab(Number(router.query.view) || 1);
		},
		[router.query.id, router.query.view]
	);
	return (
		<div className="h-100">
			<nav className="navbar navbar-expand-lg navbar-light bg-light ">
				<a className="navbar-brand" href="#">
					Remote Water Pump Management System
				</a>
			</nav>
			<div className=" row justify-content-start">
				<nav id="sidebar" className="col-2">
					<ul className="nav nav-pills flex-column columns-md">
						{views.map((view, index) => (
							<li className="nav-item" key={index}>
								<a
									className={`nav-link ${
										activeTab == index + 1 ? "active" : ""
									}`}
									href={`
                                    ?id=${id}&view=${index + 1}
                                `}
								>
									{view}
								</a>
							</li>
						))}
					</ul>
				</nav>
				<div className="container col py-2">
					<div className="col-md-9">
						<div className="card">
							<div className="card-body">
								<h5 className="card-title">Card title</h5>
								<p className="card-text">
									Some quick example text to build on the card
									title and make up the bulk of the card's
									content.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
export const getServerSideProps = async (ctx) => {
    const { id,view } = ctx.query;
    return {
        props: {
            _id: id,
            _v : view
        }
    };
};

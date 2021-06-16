import { useState, useEffect } from "react";
import { AlertTriangle } from "react-feather";
import { Spinner } from "@chakra-ui/core";
import axios from "@lib/axios";
import {
	useAccounts,
	usePolkadotApi,
	useSelectedNetwork,
	useOverviewData,
} from "@lib/store";
import { useWalletConnect } from "@components/wallet-connect";
import { get, isNil, noop } from "lodash";
import { decodeAddress, encodeAddress } from "@polkadot/util-crypto";
import { getNetworkInfo } from "yieldscan.config";
import { Events, trackEvent } from "@lib/analytics";

const Tabs = {
	ACTIVE_VALIDATORS: "validators",
	NOMINATIONS: "nominations",
};

const Discover = () => {
	const { selectedNetwork } = useSelectedNetwork();
	const networkInfo = getNetworkInfo(selectedNetwork);
	const { apiInstance } = usePolkadotApi();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [crowdloans, setCrowdloans] = useState([]);

	useEffect(() => {
		setLoading(true);
		setError(false);

		setCrowdloans([
			{
				logoSrc: "/images/karura.svg",
				name: "Karura",
				desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius, quos.",
				status: "Ongoing",
				link: "/",
			},
			{
				logoSrc: "/images/karura.svg",
				name: "Karura",
				desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius, quos. hefa asd pk pk [asdkp[akkskda l",
				status: "Ongoing",
				link: "/",
			},
			{
				logoSrc: "/images/karura.svg",
				name: "Karura",
				desc: "Lorem  sit amet consectetur adipisicing elit. Eius, quos.",
				status: "Not Started",
				link: "/",
			},
			{
				logoSrc: "/images/karura.svg",
				name: "Karura",
				desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius, quos.jjda skl;l asll; s",
				status: "Ongoing",
				link: "/",
			},
		]);

		// if (apiInstance) {
		// 	axios
		// 		.get(`/${networkInfo.network}/`)
		// 		.then(({ data }) => {
		// 			if (data.message === "No data found!") setError(true);
		// 			setCrowdloans(data);
		// 		})
		// 		.catch(() => {
		// 			setError(true);
		// 		})
		// 		.finally(() => {
		// 			setLoading(false);
		// 		});
		// }
	}, [apiInstance, selectedNetwork]);

	return (
		<div className="py-10">
			<h1 className="text-4xl font-bold">Crowdloans</h1>
			<div className="mt-8 p-4 flex space-x-3 bg-yellow-200 rounded-lg">
				<div className="flex-grow">
					<AlertTriangle size="32" className="" />
				</div>
				<div>
					<h2 className="text-lg leading-8 font-bold">DISCLAIMER</h2>
					<p className="">
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt
						fugiat ea natus ducimus, sint tempora quos esse. Rem amet officiis
						fugit eos nesciunt inventore nobis velit nemo temporibus labore eius
						nisi alias non quidem illo quaerat voluptatem accusantium
						perspiciatis ex, minima voluptates odio molestiae! Cum,
						necessitatibus. Sint eos quis nemo.
					</p>
				</div>
			</div>

			{crowdloans.length > 0 ? (
				<div className="mt-8">
					<ul className="space-y-8">
						{crowdloans.map((cl, i) => (
							<li key={i} className="bg-gray-200 shadowm rounded-xl">
								<a href={cl.link} className="block">
									<div className="flex items-center p-6">
										<div className="min-w-0 flex-1 flex">
											<div className="flex-shrink-0">
												<img
													className="h-12 w-12 rounded-full"
													src={cl.logoSrc}
													alt=""
												/>
											</div>
											<div className="min-w-0 flex-1 px-6 grid-list">
												<div className="">
													<h2 className="text-lg font-bold">{cl.name}</h2>
													<p className="flex items-center max-w-lg text-sm text-textGray-500">
														<span className="truncate">{cl.desc}</span>
													</p>
												</div>
												<div className="">
													<div>
														<p className="text-xs font-bold text-textGray-400">
															STATUS
														</p>
														<p className="mt-2 flex items-center text-sm font-normal text-textGray-500">
															<svg
																className={`-ml-0.5 mr-2 h-2 w-2 ${
																	cl.status === "Ongoing"
																		? "text-orange-500"
																		: "text-gray-600"
																}`}
																fill="currentColor"
																viewBox="0 0 8 8"
															>
																<circle cx={4} cy={4} r={4} />
															</svg>
															{cl.status}
														</p>
													</div>
												</div>
											</div>
										</div>
									</div>
								</a>
							</li>
						))}
					</ul>
				</div>
			) : (
				"much empty here"
			)}
		</div>
	);
};

export default Discover;

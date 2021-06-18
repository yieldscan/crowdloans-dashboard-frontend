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
const people = [
	{
		name: "Jane Cooper",
		title: "Regional Paradigm Technician",
		department: "Optimization",
		role: "Admin",
		email: "jane.cooper@example.com",
		image:
			"https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
	},
	{
		name: "Jane Cooper",
		title: "Regional Paradigm Technician",
		department: "Optimization",
		role: "Admin",
		email: "jane.cooper@example.com",
		image:
			"https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
	},
	// More people...
];

const Overview = () => {
	const { selectedNetwork } = useSelectedNetwork();
	const networkInfo = getNetworkInfo(selectedNetwork);
	const { toggle } = useWalletConnect();
	const { apiInstance } = usePolkadotApi();
	const { stashAccount, accounts } = useAccounts();
	const [loading, setLoading] = useState(false);
	const [loadingCrowdloans, setLoadingCrowdloans] = useState(true);
	const [crowdloans, setCrowdloans] = useState([]);
	const [error, setError] = useState(false);
	const { setUserData } = useOverviewData();

	const wasWalletFoundBefore = JSON.parse(localStorage.getItem("walletFound"));

	useEffect(() => {
		setLoading(true);
		setError(false);
		setUserData(null);
		if (get(stashAccount, "address") && apiInstance) {
			localStorage.setItem("walletFound", "true");
			const kusamaAddress = encodeAddress(
				decodeAddress(stashAccount.address),
				networkInfo.addressPrefix
			);
			axios
				.get(`/${networkInfo.network}/user/${kusamaAddress}`)
				.then(({ data }) => {
					if (data.message === "No data found!") setError(true);
					setUserData(data);
				})
				.catch(() => {
					setError(true);
				})
				.finally(() => {
					setLoading(false);
				});
		} else {
			setLoading(false);
		}
	}, [stashAccount, apiInstance, selectedNetwork]);

	useEffect(() => {
		if (stashAccount) {
			setTimeout(() => {
				setCrowdloans([
					{
						logoSrc: "/images/karura.svg",
						name: "Karura",
						locked: 1000,
						raised: 173450.456,
						total: 1500000,
						status: "Ongoing",
						ending: "42 days 11:30:41",
						link: "/",
					},
					{
						logoSrc: "/images/karura.svg",
						name: "Karura",
						locked: 1000,
						raised: 173450.456,
						total: 1500000,
						status: "Ongoing",
						ending: "42 days 11:30:41",
						link: "/",
					},
					{
						logoSrc: "/images/karura.svg",
						name: "Karura",
						locked: 1000,
						raised: 173450.456,
						total: 1500000,
						status: "Ongoing",
						ending: "42 days 11:30:41",
						link: "/",
					},
					{
						logoSrc: "/images/karura.svg",
						name: "Karura",
						locked: 1000,
						raised: 173450.456,
						total: 1500000,
						status: "Ongoing",
						ending: "42 days 11:30:41",
						link: "/",
					},
					{
						logoSrc: "/images/karura.svg",
						name: "Karura",
						locked: 1000,
						available: 3600,
						total: 12000,
						denom: "KAR",
						status: "Completed",
						yield: 420.56,
						link: "/",
					},
					{
						logoSrc: "/images/karura.svg",
						name: "Karura",
						locked: 1000,
						available: 23000,
						total: 35000,
						denom: "SCN",
						status: "Completed",
						yield: 220.56,
						link: "/",
					},
				]);
				setLoadingCrowdloans(false);
			}, 2000);
		}
	}, [stashAccount]);

	return (
		<div className="py-10">
			{!stashAccount && !loading && !wasWalletFoundBefore ? (
				<>
					<h1 className="text-4xl font-bold">Hello there! 👋</h1>
					<div className="mt-8 ">
						<h2 className="text-lg leading-8 font-bold">
							Meet your crowdloan dashboard...
						</h2>
						<p className="">
							Looking to track and manage all your crowdloan contributions in
							one place? Well, look no further... <br /> Just connect your
							wallet and make this dashboard your own!
						</p>
					</div>
					<div className="mt-8 flex items-center justify-center">
						<img src="/images/wallet.svg" alt="" />
					</div>
					<div className="mt-8 flex items-center justify-center">
						<button
							className="flex item-center rounded-lg border border-gray-300 p-2 px-4 font-medium text-white bg-black mr-4"
							onClick={toggle}
						>
							{isNil(accounts) ? (
								<>
									<span> Connect Wallet</span>
									<img
										className="ml-4 inline"
										src="/images/celo-wallet.svg"
										alt=""
									/>
								</>
							) : (
								"Select Account"
							)}
						</button>
					</div>
				</>
			) : null}

			{!loadingCrowdloans && crowdloans.length > 0 ? (
				<>
					<h1 className="text-xs font-bold uppercase text-textGray-200">
						Your net locked amount
					</h1>
					<h2 className="text-4xl font-bold">4.000 KSM</h2>

					<div>
						<h2 className="text-lg font-bold my-6">Ongoing</h2>
						<div className="flex flex-col">
							<div className="-my-2 overflow-x-auto -mx-8">
								<div className="py-2 align-middle inline-block min-w-full px-8">
									<div className="overflow-hidden border-b border-gray-200">
										<table className="min-w-full divide-y divide-gray-200">
											<thead className="bg-gray-400">
												<tr>
													<th
														scope="col"
														className="px-6 py-3 text-left text-sm font-semibold text-black uppercase tracking-wider"
													>
														Crowdloan
													</th>
													<th
														scope="col"
														className="px-6 py-3 text-left text-sm font-semibold text-black uppercase tracking-wider"
													>
														Locked Amount
													</th>
													<th
														scope="col"
														className="px-6 py-3 text-left text-sm font-semibold text-black uppercase tracking-wider"
													>
														Fundraise Progress
													</th>
													<th
														scope="col"
														className="px-6 py-3 text-left text-sm font-semibold text-black uppercase tracking-wider"
													>
														Ending
													</th>
												</tr>
											</thead>
											<tbody className="bg-white divide-y divi divide-gray-200">
												{crowdloans
													.filter((c) => c.status === "Ongoing")
													.map((crwdl, i) => (
														<tr key={i}>
															<td className="px-6 py-4 whitespace-nowrap">
																<div className="flex items-center">
																	<div className="flex-shrink-0 h-6 w-6">
																		<img
																			className="h-6 w-6 rounded-full"
																			src={crwdl.logoSrc}
																			alt=""
																		/>
																	</div>
																	<div className="ml-4">
																		<div className="text-base">
																			{crwdl.name}
																		</div>
																	</div>
																</div>
															</td>
															<td className="px-6 py-4 whitespace-nowrap">
																<div className="text-base">
																	{Number(crwdl.locked / 1000).toFixed(3)} kKSM
																</div>
															</td>
															<td className="px-6 py-4 whitespace-nowrap">
																<div>
																	<div className="flex items-center">
																		<div className="h-2 mb-1 w-3/4 relative max-w-xl rounded-full overflow-hidden">
																			<div className="w-full h-full bg-gray-200 absolute"></div>
																			<div
																				id="bar"
																				className="h-full bg-black relative rounded-full"
																				style={{
																					width: `${
																						(crwdl.raised / crwdl.total) * 100
																					}%`,
																				}}
																			></div>
																		</div>
																		<span className="ml-auto">
																			{Math.floor(
																				(crwdl.raised / crwdl.total) * 100
																			)}
																			%{" "}
																		</span>
																	</div>
																	<p>{`${crwdl.raised} / ${Number(
																		crwdl.total / 1000000
																	).toFixed(6)} MKSM`}</p>
																</div>
															</td>
															<td className="px-6 py-4 whitespace-nowrap">
																{crwdl.ending}
															</td>
														</tr>
													))}
											</tbody>
										</table>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div>
						<h2 className="text-lg font-bold my-6">Successfully Completed</h2>

						<div className="flex flex-col">
							<div className="-my-2 overflow-x-auto -mx-8">
								<div className="py-2 align-middle inline-block min-w-full px-8">
									<div className="overflow-hidden border-b border-gray-200">
										<table className="min-w-full divide-y divide-gray-200">
											<thead className="bg-gray-400">
												<tr>
													<th
														scope="col"
														className="px-6 py-3 text-left text-sm font-semibold text-black uppercase tracking-wider"
													>
														Crowdloan
													</th>
													<th
														scope="col"
														className="px-6 py-3 text-left text-sm font-semibold text-black uppercase tracking-wider"
													>
														Locked Amount
													</th>
													<th
														scope="col"
														className="px-6 py-3 text-left text-sm font-semibold text-black uppercase tracking-wider"
													>
														Rewards{" "}
														<span className="text-gray-700">
															(Available/Total)
														</span>
													</th>
													<th
														scope="col"
														className="px-6 py-3 text-left text-sm font-semibold text-black uppercase tracking-wider"
													>
														Yield
													</th>
												</tr>
											</thead>
											<tbody className="bg-white divide-y divi divide-gray-200">
												{crowdloans
													.filter((c) => c.status === "Completed")
													.map((crwdl, i) => (
														<tr key={i}>
															<td className="px-6 py-4 whitespace-nowrap">
																<div className="flex items-center">
																	<div className="flex-shrink-0 h-6 w-6">
																		<img
																			className="h-6 w-6 rounded-full"
																			src={crwdl.logoSrc}
																			alt=""
																		/>
																	</div>
																	<div className="ml-4">
																		<div className="">{crwdl.name}</div>
																	</div>
																</div>
															</td>
															<td className="px-6 py-4 whitespace-nowrap">
																<div className="">
																	{Number(crwdl.locked / 1000).toFixed(3)} kKSM
																</div>
															</td>
															<td className="px-6 py-4 whitespace-nowrap">
																<div>
																	<div className="flex items-center">
																		<div className="h-2 mb-1 w-3/4 relative max-w-xl rounded-full overflow-hidden">
																			<div className="w-full h-full bg-gray-200 absolute"></div>
																			<div
																				id="bar"
																				className="h-full bg-black relative rounded-full"
																				style={{
																					width: `${
																						(crwdl.available / crwdl.total) *
																						100
																					}%`,
																				}}
																			></div>
																		</div>
																		<span className="ml-auto">
																			{Math.floor(
																				(crwdl.available / crwdl.total) * 100
																			)}
																			%{" "}
																		</span>
																	</div>
																	<p>{`${crwdl.available} / ${crwdl.total} ${crwdl.denom}`}</p>
																</div>
															</td>
															<td className="px-6 py-4 whitespace-nowrap text-green-400 font-bold">
																{`+${crwdl.yield}%`}
															</td>
														</tr>
													))}
											</tbody>
										</table>
									</div>
								</div>
							</div>
						</div>
					</div>
				</>
			) : null}

			{!loadingCrowdloans && crowdloans.length === 0 ? (
				<>
					<h1 className="text-4xl font-bold">It’s pretty empty here...</h1>
					<div className="mt-8 ">
						<h2 className="text-lg leading-8 font-bold">
							Looks like you haven’t contributed to any crowdloans yet
						</h2>
						<p className="">
							You can track and manage all your crowdloan contributions here,
							but looks like you don’t have any yet. Explore our crowdloans list
							to find out information about ongoing and upcoming crowdloans.
						</p>
					</div>
					<div className="mt-8 flex items-center justify-center">
						<img src="/images/Crowdloans.svg" alt="" />
					</div>
					<div className="mt-8 flex items-center justify-center">
						<button
							className="flex item-center rounded-lg border border-gray-300 p-2 px-4 font-medium text-white bg-black mr-4"
							onClick={toggle}
						>
							Discover Crowdloans
						</button>
					</div>
				</>
			) : null}

			{loading ? (
				<div className="mt-8 flex items-center justify-center">
					<div className="flex-center flex-col">
						<Spinner size="xl" color="black" thickness="4px" />
						<span className="text-sm text-gray-600 mt-5">
							{isNil(apiInstance)
								? "Instantiating API..."
								: "Fetching your data..."}
						</span>
					</div>
				</div>
			) : null}
		</div>
	);
};

export default Overview;

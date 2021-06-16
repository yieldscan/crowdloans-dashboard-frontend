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

const Overview = () => {
	const { selectedNetwork } = useSelectedNetwork();
	const networkInfo = getNetworkInfo(selectedNetwork);
	const { toggle } = useWalletConnect();
	const { apiInstance } = usePolkadotApi();
	const { stashAccount, accounts } = useAccounts();
	const [loading, setLoading] = useState(false);
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
			) : (
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
			)}
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

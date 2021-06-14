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
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const { setUserData } = useOverviewData();

	useEffect(() => {
		setLoading(true);
		setError(false);
		setUserData(null);
		if (get(stashAccount, "address") && apiInstance) {
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
		}
	}, [stashAccount, apiInstance, selectedNetwork]);

	return !stashAccount ? (
		<div className="flex-center w-full h-full">
			<div className="flex-center flex-col">
				<AlertTriangle size="32" className="text-orange-500" />
				<span className="text-gray-600 text-lg mb-10">
					No account {isNil(accounts) ? "connected" : "selected"}!
				</span>
				<button
					className="border border-teal-500 text-teal-500 px-3 py-2 rounded-full"
					onClick={toggle}
				>
					{isNil(accounts) ? "Connect Wallet" : "Select Account"}
				</button>
			</div>
		</div>
	) : loading ? (
		<div className="flex-center w-full h-full">
			<div className="flex-center flex-col">
				<Spinner size="xl" color="teal.500" thickness="4px" />
				<span className="text-sm text-gray-600 mt-5">
					{isNil(apiInstance)
						? "Instantiating API..."
						: "Fetching your data..."}
				</span>
			</div>
		</div>
	) : (
		"Soon"
	);
};

export default Overview;

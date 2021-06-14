import { useState, useEffect } from "react";
import { Edit2, AlertTriangle, ChevronRight } from "react-feather";
import OverviewCards from "./OverviewCards";
import NominationsTable from "./NominationsTable";
import ExpectedReturns from "./ExpectedReturns";
import {
	Spinner,
	useDisclosure,
	useToast,
	Collapse,
	Button,
} from "@chakra-ui/core";
import axios from "@lib/axios";
import {
	useAccounts,
	usePolkadotApi,
	useSelectedNetwork,
	useOverviewData,
	useEraProgress,
	useValidatorData,
} from "@lib/store";
import { useWalletConnect } from "@components/wallet-connect";
import { get, isNil, noop } from "lodash";
import { decodeAddress, encodeAddress } from "@polkadot/util-crypto";
import RewardDestinationModal from "./RewardDestinationModal";
import EditControllerModal from "./EditControllerModal";
import FundsUpdate from "./FundsUpdate";
import UnbondingList from "./UnbondingList";
import EditValidators from "./EditValidators";
import ChillAlert from "./ChillAlert";
import Routes from "@lib/routes";
import { useRouter } from "next/router";
import AllNominations from "./AllNominations";
import { getNetworkInfo } from "yieldscan.config";
import EarningsOutput from "./EarningsOutput";
import { Events, trackEvent } from "@lib/analytics";
import ProgressiveImage from "react-progressive-image";
import RedeemUnbonded from "./RedeemUnbonded";

const Tabs = {
	ACTIVE_VALIDATORS: "validators",
	NOMINATIONS: "nominations",
};

const Overview = () => {
	const router = useRouter();
	const { selectedNetwork } = useSelectedNetwork();
	const networkInfo = getNetworkInfo(selectedNetwork);
	const { toggle } = useWalletConnect();
	const { apiInstance } = usePolkadotApi();
	const {
		stashAccount,
		accounts,
		bondedAmount,
		activeStake,
		setFreeAmount,
		unlockingBalances,
		redeemableBalance,
		unbondingBalances,
		accountInfoLoading,
	} = useAccounts();
	const toast = useToast();
	const [loading, setLoading] = useState(true);
	const [nominationsLoading, setNominationsLoading] = useState(true); // work-around :(
	const [error, setError] = useState(false);
	const {
		userData,
		setUserData,
		allNominationsData,
		setAllNominations,
	} = useOverviewData();
	const { validators, setValidators } = useValidatorData();
	const { eraLength, eraProgress } = useEraProgress();
	const [showValidators, setShowValidators] = useState(false);
	const [validatorsLoading, setValidatorsLoading] = useState(true);
	const [fundsUpdateModalType, setFundsUpdateModalType] = useState();
	const handleValToggle = () => setShowValidators(!showValidators);
	const [selectedTab, setSelectedTab] = useState(Tabs.NOMINATIONS);
	const {
		isOpen: isRewardDestinationModalOpen,
		onToggle: toggleRewardDestinationModal,
		onClose: closeRewardDestinationModal,
	} = useDisclosure();
	const {
		isOpen: editControllerModalOpen,
		onToggle: toggleEditControllerModal,
		onClose: closeEditControllerModal,
	} = useDisclosure();
	const {
		isOpen: fundsUpdateModalOpen,
		onToggle: toggleFundsUpdateModal,
		onClose: closeFundsUpdateModal,
	} = useDisclosure();
	const {
		isOpen: openUnbondingList,
		onToggle: toggleUnbondingList,
		onClose: closeUnbondingList,
	} = useDisclosure();
	const {
		isOpen: openRedeemUnbonded,
		onToggle: toggleRedeemUnbonded,
		onClose: closeRedeemUnbonded,
	} = useDisclosure();

	useEffect(() => {
		setLoading(true);
		setError(false);
		setAllNominations(null);
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

			let unsubscribe = noop;
			unsubscribe = apiInstance.query.staking
				.nominators(
					stashAccount.address,
					({ value: { targets: nominations } }) => {
						if (nominations) {
							const readableNominations = nominations.map((nomination) =>
								nomination.toString()
							);
							const multiQueryString = readableNominations.reduce(
								(acc, curr) => acc + `,${curr}`,
								""
							);
							axios
								.get(
									`/${networkInfo.network}/validator/multi?stashIds=${multiQueryString}`
								)
								.then(({ data }) => {
									setAllNominations(data);
								})
								.catch((err) => {
									toast({
										title: "Error",
										description: "Something went wrong!",
										position: "top-right",
										duration: 3000,
										status: "error",
									});
									close();
								})
								.finally(() => {
									setNominationsLoading(false);
								});
						} else {
							setError(true);
							setNominationsLoading(false);
						}
					}
				)
				.then((_unsubscribe) => {
					unsubscribe = _unsubscribe;
				})
				.finally(() => {
					// setLoading(false);
				});

			return () => {
				unsubscribe;
			};
		}
	}, [stashAccount, apiInstance, selectedNetwork]);

	// useEffect(() => {
	// 	if (!validators) {
	// 		axios
	// 			.get(`/${networkInfo.network}/rewards/risk-set`)
	// 			.then(({ data }) => {
	// 				const validators = data.totalset;
	// 				setValidators(validators);
	// 				setSelectedValidatorsMap(allNominationsData);
	// 			})
	// 			.catch(() => {
	// 				// toast({
	// 				// 	title: "Error",
	// 				// 	description: "Something went wrong!",
	// 				// 	position: "top-right",
	// 				// 	duration: 3000,
	// 				// 	status: "error",
	// 				// });
	// 				close();
	// 			})
	// 			.finally(() => {
	// 				setValidatorsLoading(false);
	// 			});
	// 	}
	// }, [allNominationsData]);

	// if (loading || accountInfoLoading || nominationsLoading) {
	// 	return (
	// 		<div className="flex-center w-full h-full">
	// 			<div className="flex-center flex-col">
	// 				<Spinner size="xl" color="teal.500" thickness="4px" />
	// 				<span className="text-sm text-gray-600 mt-5">
	// 					Fetching your data...
	// 				</span>
	// 			</div>
	// 		</div>
	// 	);
	// }

	// if (error) {
	// 	return (
	// 		<div className="flex-center w-full h-full">
	// 			<div className="flex-center flex-col">
	// 				<AlertTriangle size="2rem" className="text-orange-500" />
	// 				<span className="font-semibold text-red-600 text-lg mb-10">
	// 					Sorry, no data for your account since you don't have active
	// 					nominations! :(
	// 				</span>
	// 				<span
	// 					onClick={() => router.replace(Routes.CALCULATOR)}
	// 					className="text-sm text-gray-600 mt-5 hover:underline cursor-pointer"
	// 				>
	// 					Use Reward Calculator to bond more funds and nominate.
	// 				</span>
	// 			</div>
	// 		</div>
	// 	);
	// }

	const onEditController = () => {
		closeRewardDestinationModal();
		toggleEditControllerModal();
	};

	const openFundsUpdateModal = (type) => {
		setFundsUpdateModalType(type);
		toggleFundsUpdateModal();
	};

	const openUnbondingListModal = (type) => {
		toggleUnbondingList();
	};

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
	) : isNil(bondedAmount) ||
	  isNil(activeStake) ||
	  nominationsLoading ||
	  loading ? (
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
	) : isNil(allNominationsData) &&
	  isNil(userData) &&
	  unbondingBalances.length === 0 &&
	  isNil(unlockingBalances) &&
	  redeemableBalance === 0 ? (
		<div className="flex items-center flex-col pt-24">
			<ProgressiveImage
				src="/images/unicorn-sweat/unicorn-sweat.png"
				placeholder="/images/unicorn-sweat/unicorn-sweat@0.5x.png"
			>
				{(src) => (
					<img src={src} alt="unicorn-sweat" width="200px" height="auto" />
				)}
			</ProgressiveImage>
			<h2 className="text-2xl text-gray-700 font-semibold mt-4">
				Hey! So, ummm...
			</h2>
			<p className="text-gray-600 mt-2 text-center">
				You haven’t yet started staking. <br />
				Try checking back after you’ve done that.
			</p>
			<Button
				as="button"
				className="min-w-max-content"
				variantColor="teal"
				rounded="full"
				fontWeight="normal"
				size="lg"
				mt={12}
				px={12}
				_hover={{ bg: "#2bcaca" }}
				onClick={() => {
					trackEvent(Events.LANDING_CTA_CLICK, {
						path: Routes.OVERVIEW,
					}).then(() => router.push({ pathname: "/reward-calculator" }));
				}}
			>
				Start staking
			</Button>
			<p className="mt-6 text-sm text-gray-600">
				Think this is a mistake?{" "}
				<a
					className="text-gray-700 font-semibold"
					href="mailto:karan@buidllabs.io"
					target="_blank"
				>
					Contact us
				</a>
			</p>
		</div>
	) : (
		<div className="py-10 w-full h-full">
			{/* <RewardDestinationModal
				isOpen={isRewardDestinationModalOpen}
				close={closeRewardDestinationModal}
				onEditController={onEditController}
			/>
			<EditControllerModal
				isOpen={editControllerModalOpen}
				close={closeEditControllerModal}
				networkInfo={networkInfo}
			/> */}
			<FundsUpdate
				isOpen={fundsUpdateModalOpen}
				close={closeFundsUpdateModal}
				type={fundsUpdateModalType}
				nominations={allNominationsData}
				unbondingBalances={unbondingBalances}
				bondedAmount={bondedAmount}
				networkInfo={networkInfo}
			/>
			<UnbondingList
				isOpen={openUnbondingList}
				close={closeUnbondingList}
				toggle={toggleUnbondingList}
				unbondingBalances={unbondingBalances}
				eraLength={eraLength}
				eraProgress={eraProgress}
				networkInfo={networkInfo}
			/>
			<RedeemUnbonded
				isOpen={openRedeemUnbonded}
				close={closeRedeemUnbonded}
				api={apiInstance}
				toggle={toggleRedeemUnbonded}
				redeemableBalance={redeemableBalance}
				stashAccount={stashAccount}
				networkInfo={networkInfo}
			/>
			{/* <EditValidators
				isOpen={editValidatorModalOpen}
				close={closeEditValidatorsModal}
				validators={validators}
				validatorsLoading={validatorsLoading}
				currentValidators={allNominationsData}
				onChill={() => {
					closeEditValidatorsModal();
					setTimeout(() => toggleChillAlert(), 500);
				}}
				networkInfo={networkInfo}
			/> */}
			{/* <ChillAlert isOpen={chillAlertOpen} close={closeChillAlert} /> */}
			<div className="flex-col">
				<div className="flex">
					<OverviewCards
						stats={isNil(userData) ? null : userData.stats}
						bondedAmount={bondedAmount}
						address={stashAccount.address}
						activeStake={activeStake}
						validators={isNil(userData) ? null : userData.validatorsInfo}
						unlockingBalances={unlockingBalances}
						unbondingBalances={unbondingBalances}
						redeemableBalance={redeemableBalance}
						bondFunds={() => openFundsUpdateModal("bond")}
						unbondFunds={() => openFundsUpdateModal("unbond")}
						rebondFunds={() => openFundsUpdateModal("rebond")}
						toggleRedeemUnbonded={toggleRedeemUnbonded}
						openUnbondingListModal={openUnbondingListModal}
						openRewardDestinationModal={toggleRewardDestinationModal}
						networkInfo={networkInfo}
					/>
					<div className="flex ml-20 w-1/2">
						<EarningsOutput
							networkInfo={networkInfo}
							validators={
								isNil(userData)
									? []
									: userData.validatorsInfo.filter(
											(validator) => validator.isElected
									  )
							}
							inputValue={activeStake}
							address={stashAccount.address}
						/>
					</div>
				</div>
				<div className="w-full">
					<div className="flex flex-col h-full mb-2">
						<button
							onClick={handleValToggle}
							className="flex text-gray-600 text-xs mt-12"
						>
							<ChevronRight
								size={16}
								className={`transition ease-in-out duration-500 mr-2 ${
									showValidators && "transform rotate-90"
								}`}
							/>
							{showValidators ? "Hide" : "See your"} validators
						</button>
						<Collapse isOpen={showValidators}>
							{/* <div className="flex items-center">
									<h3 className="text-2xl">
										My validators
									</h3>
									{selectedTab === Tabs.NOMINATIONS && (
										<button
											className="flex items-center text-gray-600 mr-5 p-1"
											onClick={toggleEditValidatorsModal}
										>
											<Edit2 size="20px" className="ml-2" />
										</button>
									)}
								</div> */}
							<div className="flex items-center mt-4 mb-2">
								<button
									className={
										selectedTab === Tabs.NOMINATIONS
											? "text-gray-900 mx-2"
											: "text-gray-500 mx-2"
									}
									onClick={() => setSelectedTab(Tabs.NOMINATIONS)}
								>
									Selected
								</button>
								<button
									className={
										selectedTab === Tabs.ACTIVE_VALIDATORS
											? "text-gray-900 mx-2"
											: "text-gray-500 mx-2"
									}
									onClick={() => setSelectedTab(Tabs.ACTIVE_VALIDATORS)}
								>
									Active
								</button>
							</div>
							{selectedTab === Tabs.ACTIVE_VALIDATORS ? (
								<NominationsTable
									validators={isNil(userData) ? [] : userData.validatorsInfo}
									networkInfo={networkInfo}
								/>
							) : (
								allNominationsData && (
									<AllNominations
										nominations={allNominationsData}
										networkInfo={networkInfo}
									/>
								)
							)}
						</Collapse>
					</div>
					{/* <div className="w-4/12">
						<ExpectedReturns
							stats={userData.stats}
							validators={userData.validatorsInfo}
							networkInfo={networkInfo}
						/>
					</div> */}
				</div>
			</div>
		</div>
	);
};

export default Overview;

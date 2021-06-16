import React from "react";
import { InputGroup, Spinner, Input, InputRightElement } from "@chakra-ui/core";
import formatCurrency from "@lib/format-currency";
import { useAccounts } from "@lib/store";
import { get } from "lodash";
import { useState, useEffect } from "react";

const AmountInputDefault = ({
	bonded,
	value,
	onChange,
	networkInfo,
	trackRewardCalculatedEvent,
}) => {
	const { freeAmount, stashAccount } = useAccounts();
	const initiallyEditable =
		bonded === undefined ? true : bonded == 0 ? true : false;
	const [isEditable, setIsEditable] = React.useState(initiallyEditable);
	const [inputValue, setInputValue] = useState(value.currency);
	const maxAmount = Math.max(
		get(freeAmount, "currency") <= networkInfo.minAmount
			? bonded
			: bonded + get(freeAmount, "currency") - networkInfo.minAmount,
		0
	);

	useEffect(() => {
		if (bonded) {
			onChange(bonded);
			setInputValue(Number(Math.max(bonded, 0)));
		}
	}, [bonded]);

	const handleChange = (value) => {
		onChange(value);
		setInputValue(value);
		trackRewardCalculatedEvent({
			investmentAmount: `${value} ${networkInfo.denom}`,
		});
	};

	return (
		<div>
			<div className="flex items-center justify-between w-2/3">
				<InputGroup className="border border-gray-200 rounded-full">
					<Input
						type="number"
						rounded="full"
						pt={6}
						pb={10}
						px={4}
						pr={inputValue === maxAmount ? 8 : 24}
						textOverflow="ellipsis"
						placeholder="0"
						value={inputValue}
						onChange={(e) => {
							const { value } = e.target;
							handleChange(value);
						}}
						border="none"
						fontSize="lg"
						isDisabled={!isEditable}
						backgroundColor={!isEditable && "gray.200"}
						color="gray.600"
					/>
					<h6
						className={`absolute z-20 bottom-0 left-0 ml-4 mb-3 text-xs text-gray-600 cursor-not-allowed ${
							isEditable ? "opacity-1" : "opacity-25"
						}`}
					>
						${formatCurrency.methods.formatNumber(value.subCurrency.toFixed(2))}
					</h6>
					<InputRightElement
						opacity={isEditable ? "1" : "0.4"}
						children={
							<span className="flex min-w-fit-content">
								{stashAccount && inputValue !== maxAmount && (
									<button
										className={`bg-teal-200 text-black rounded-full text-xs px-2 ${
											!isEditable && "opacity-0 cursor-not-allowed"
										}`}
										disabled={!isEditable}
										onClick={() => {
											handleChange(maxAmount);
										}}
									>
										max
									</button>
								)}
								<span className="ml-2 text-sm font-medium cursor-not-allowed text-gray-700">
									{networkInfo.denom}
								</span>
							</span>
						}
						h="full"
						rounded="full"
						fontSize="xl"
						w="fit-content"
						px={4}
					/>
				</InputGroup>
			</div>
			{(bonded && (
				<button
					className="mt-2 py-2 px-4 shadow-custom rounded-full text-xs border border-gray-200"
					onClick={() => {
						if (isEditable) {
							handleChange(bonded);
						}
						setIsEditable(!isEditable);
					}}
				>
					{isEditable ? "Use Currently Bonded Amount" : "Use Custom Amount"}
				</button>
			)) ||
				""}
		</div>
	);
};

const AmountInputAccountInfoLoading = ({
	bonded,
	value,
	onChange,
	networkInfo,
	trackRewardCalculatedEvent,
}) => {
	const [inputValue, setInputValue] = useState(value.currency);

	const handleChange = (value) => {
		onChange(value);
		setInputValue(value);
		trackRewardCalculatedEvent({
			investmentAmount: `${value} ${networkInfo.denom}`,
		});
	};

	return (
		<div>
			<div className="flex items-center justify-between w-full">
				<InputGroup className="border border-gray-200 rounded-full">
					<Input
						type="number"
						rounded="full"
						pt={6}
						pb={10}
						px={4}
						pr={24}
						textOverflow="ellipsis"
						placeholder="0"
						value={inputValue}
						onChange={(e) => {
							const { value } = e.target;
							handleChange(value);
						}}
						border="none"
						fontSize="lg"
						isDisabled={true}
						backgroundColor={"gray.200"}
						color="gray.600"
					/>
					<h6
						className={`absolute z-20 bottom-0 left-0 ml-4 mb-3 text-xs text-gray-600 cursor-not-allowed opacity-25`}
					>
						${formatCurrency.methods.formatNumber(value.subCurrency.toFixed(2))}
					</h6>
					<InputRightElement
						opacity="0.4"
						children={
							<span className="flex min-w-fit-content">
								<span className="ml-2 text-sm font-medium cursor-not-allowed text-gray-700">
									{networkInfo.denom}
								</span>
							</span>
						}
						h="full"
						rounded="full"
						fontSize="xl"
						w="fit-content"
						px={4}
					/>
				</InputGroup>
				<div className="ml-4 text-gray text-xs flex inline">
					Loading...
					<div className="ml-2">
						<Spinner
							thickness="2px"
							speed="0.65s"
							emptyColor="gray.200"
							color="blue.500"
							size="sm"
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

// TODO: handle `subCurrency` properly
const AmountInputAlreadyBonded = ({ value, bonded, total, onChange }) => (
	<div className="flex flex-col">
		<div className="flex justify-between bg-gray-200 p-3 rounded-xl">
			<div className="flex flex-col ml-4 rounded-lg py-1">
				<span className="text-gray-700 text-sm">Currently Bonded</span>
				<h3 className="text-xl">{bonded.currency} KSM</h3>
				<span hidden className="text-gray-500 text-xs">
					${bonded.subCurrency}
				</span>
			</div>
			<div className="flex flex-col bg-white px-6 rounded-lg py-1">
				<span className="text-gray-700 text-sm">Bond Additional Funds</span>
				<div className="flex">
					<input
						type="number"
						placeholder="0"
						defaultValue={value.currency === 0 ? "" : value.currency}
						className="outline-none w-24 mr-2"
						onChange={(e) => {
							const { value } = e.target;
							onChange(value === "" ? 0 : Number(value));
						}}
					/>
					<h3 hidden className="">
						KSM
					</h3>
				</div>
				<span hidden className="text-gray-500">
					${value.subCurrency}
				</span>
			</div>
		</div>
		<div className="bg-gray-800 mt-2 p-3 px-6 flex flex-col rounded-xl">
			<span className="text-black text-sm">Total Staking Amount</span>
			<h3 className="text-xl text-white">{total.currency} KSM</h3>
			<span hidden className="text-gray-500 text-xs">
				${total.subCurrency}
			</span>
		</div>
		<style jsx>{`
			/* hides number input controls */
			input[type="number"]::-webkit-inner-spin-button,
			input[type="number"]::-webkit-outer-spin-button {
				-webkit-appearance: none;
				margin: 0;
			}
		`}</style>
	</div>
);

const AmountInput = ({
	value,
	bonded,
	networkInfo,
	onChange,
	trackRewardCalculatedEvent,
	accountInfoLoading,
}) => {
	return (
		<div className="w-4/5">
			{/* {get(bonded, 'currency') ? (
				<AmountInputAlreadyBonded
					value={value}
					bonded={bonded}
					total={{
						currency: Number(((value.currency || 0) + bonded.currency).toFixed(4)),
						subCurrency: Number((value.subCurrency + bonded.subCurrency).toFixed(4)),
					}}
					onChange={onChange}
				/>
			): ( */}
			{accountInfoLoading ? (
				<AmountInputAccountInfoLoading
					value={value}
					bonded={bonded}
					onChange={onChange}
					networkInfo={networkInfo}
					trackRewardCalculatedEvent={trackRewardCalculatedEvent}
				/>
			) : (
				<AmountInputDefault
					value={value}
					bonded={bonded}
					onChange={onChange}
					networkInfo={networkInfo}
					trackRewardCalculatedEvent={trackRewardCalculatedEvent}
				/>
			)}
		</div>
	);
};

export default AmountInput;

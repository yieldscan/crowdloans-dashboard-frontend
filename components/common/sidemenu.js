import {
	Home,
	UserCheck,
	Users,
	Sliders,
	Globe,
	ChevronRight,
} from "react-feather";
import { useRouter } from "next/router";
import Link from "next/link";
import Routes from "@lib/routes";
import { Badge, Collapse } from "@chakra-ui/core";
import { useState } from "react";

const MenuOption = ({
	label,
	Icon,
	selected = false,
	href,
	isExternal = false,
}) => {
	return (
		<Link href={href}>
			<a
				target={isExternal ? "_blank" : "_self"}
				className={`
					block
					${!selected && "hover:ml-2"}
					rounded 
					px-5
					py-2
					mb-2 
					transition-all
					duration-300 ease-in-out
					text-sm min-w-fit-content
					hover:bg-gray-400 hover:bg-opacity-22
					${selected ? "text-teal-500" : "text-gray-600"}
				`}
			>
				{Icon && <Icon className="mr-2 mb-px inline" size="16px" />}
				<span>{label}</span>
			</a>
		</Link>
	);
};

const SideMenu = () => {
	const router = useRouter();
	const [showPortfolioTabs, setShowPortfolioTabs] = useState(true);
	const [showExploreTabs, setShowExploreTabs] = useState(true);

	return (
		<div className="px-4">
			<button
				className="flex items-center text-gray-600 text-xs mt-2 text-transform uppercase tracking-widest"
				onClick={() => setShowPortfolioTabs(!showPortfolioTabs)}
			>
				<ChevronRight
					size={16}
					className={`transition ease-in-out duration-500 mr-2 ${
						showPortfolioTabs && "transform rotate-90"
					}`}
				/>
				Portfolio
			</button>
			<Collapse mt={4} mb={8} isOpen={showPortfolioTabs}>
				<MenuOption
					label="Overview"
					Icon={Home}
					selected={router.pathname === Routes.OVERVIEW}
					href={Routes.OVERVIEW}
				/>
				<MenuOption
					label="Calculator"
					Icon={Sliders}
					selected={router.pathname === Routes.CALCULATOR}
					href={Routes.CALCULATOR}
				/>
			</Collapse>
			<button
				className="flex items-center text-gray-600 text-xs mt-2 text-transform uppercase tracking-widest"
				onClick={() => setShowExploreTabs(!showExploreTabs)}
			>
				<ChevronRight
					size={16}
					className={`transition ease-in-out duration-500 mr-2 ${
						showExploreTabs && "transform rotate-90"
					}`}
				/>
				Explore
				{/* <Badge
					ml={2}
					textTransform="lowercase"
					fontWeight="normal"
					color="white"
					bg="red.400"
					fontSize="10px"
					rounded="full"
					px={2}
				>
					unaudited
				</Badge> */}
			</button>
			<Collapse mt={4} mb={8} isOpen={showExploreTabs}>
				<MenuOption
					label="Validators"
					Icon={UserCheck}
					selected={router.pathname === Routes.VALIDATORS}
					href={Routes.VALIDATORS}
				/>
				<MenuOption
					label="Nominators"
					Icon={Users}
					selected={router.pathname === Routes.NOMINATORS}
					href={Routes.NOMINATORS}
				/>
				<MenuOption
					label="Governance"
					Icon={Globe}
					selected={router.pathname === Routes.GOVERNANCE}
					href={Routes.GOVERNANCE}
				/>
			</Collapse>
		</div>
	);
};

export default SideMenu;

export { MenuOption };

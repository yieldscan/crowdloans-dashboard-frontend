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
			<MenuOption
				label="Overview"
				Icon={Home}
				selected={router.pathname === Routes.OVERVIEW}
				href={Routes.OVERVIEW}
			/>
			<MenuOption
				label="Validators"
				Icon={UserCheck}
				selected={router.pathname === Routes.VALIDATORS}
				href={Routes.VALIDATORS}
			/>
		</div>
	);
};

export default SideMenu;

export { MenuOption };

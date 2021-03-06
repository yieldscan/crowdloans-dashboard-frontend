import { Home, Search } from "react-feather";
import { useRouter } from "next/router";
import Link from "next/link";
import Routes from "@lib/routes";

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
				className={`flex items-center ${
					!selected && "hover:ml-2"
				} px-6 py-2 mb-2 transition-all duration-300 ease-in-out text-sm min-w-fit-content hover:bg-gray-400 hover:bg-opacity-90 ${
					selected
						? "bg-black text-white rounded-none hover:text-black"
						: "text-gray-600 rounded"
				}`}
			>
				{Icon && <Icon className="mr-2 mb-px inline" size="16px" />}
				<span>{label}</span>
			</a>
		</Link>
	);
};

const SideMenu = () => {
	const router = useRouter();

	return (
		<div className="">
			<MenuOption
				label="Dashboard"
				Icon={Home}
				selected={router.pathname === Routes.DASHBOARD}
				href={Routes.DASHBOARD}
			/>
			<MenuOption
				label="Discover Crowdloans"
				Icon={Search}
				selected={router.pathname === Routes.DISCOVER}
				href={Routes.DISCOVER}
			/>
		</div>
	);
};

export default SideMenu;

export { MenuOption };

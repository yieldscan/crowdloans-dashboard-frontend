import { FaDiscord, FaTelegram } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { Settings, ArrowUpRight } from "react-feather";
import { MenuOption } from "@components/common/sidemenu";
import { useRouter } from "next/router";
import Routes from "@lib/routes";

const SideMenuFooter = () => {
	const router = useRouter();

	return (
		<div className="text-gray-600  w-full">
			{/* <MenuOption
				label="Request Features"
				href="https://yieldscan.upvoty.com/b/yieldscan/"
				isExternal
			/> */}
			<MenuOption
				label="Settings"
				Icon={Settings}
				selected={router.pathname === Routes.SETTINGS}
				href={Routes.SETTINGS}
			/>
			<div className="flex px-5 mt-4">
				<a
					href="https://yieldscan.app"
					className="flex item-center rounded-lg border border-gray-300 px-4 py-2 font-medium text-black bg-gray-400"
				>
					<ArrowUpRight className="inline mr-2 mt-px h-5 w-5" />
					<span className="text-base hover:underline">Go to staking app</span>
				</a>
			</div>
		</div>
	);
};

export default SideMenuFooter;

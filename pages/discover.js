import dynamic from "next/dynamic";
import withDashboardLayout from "@components/common/layouts/dashboard";

const Page = dynamic(
	() => import("@components/common/page").then((mod) => mod.default),
	{ ssr: false }
);

const DiscoverComponent = dynamic(
	() => import("@components/discover").then((mod) => mod.default),
	{ ssr: false }
);

const Settings = () => (
	<Page title="Settings" layoutProvider={withDashboardLayout}>
		{() => <DiscoverComponent />}
	</Page>
);

export default Settings;

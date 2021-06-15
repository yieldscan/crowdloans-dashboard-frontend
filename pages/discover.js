import dynamic from "next/dynamic";
import withDashboardLayout from "@components/common/layouts/dashboard";

const Page = dynamic(
	() => import("@components/common/page").then((mod) => mod.default),
	{ ssr: false }
);

// const SettingsComponent = dynamic(
// 	() => import("@components/settings").then((mod) => mod.default),
// 	{ ssr: false }
// );

const Settings = () => (
	<Page title="Settings" layoutProvider={withDashboardLayout}>
		{() => "soon"}
	</Page>
);

export default Settings;

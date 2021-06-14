import dynamic from "next/dynamic";
import withDashboardLayout from "@components/common/layouts/Dashboard";

const Page = dynamic(
	() => import("@components/common/Page").then((mod) => mod.default),
	{ ssr: false }
);

// const OverviewComponent = dynamic(
// 	() => import("@components/overview").then((mod) => mod.default),
// 	{ ssr: false }
// );

const Payment = () => (
	<Page title="Overview" layoutProvider={withDashboardLayout}>
		{() => <div />}
	</Page>
);

export default Payment;

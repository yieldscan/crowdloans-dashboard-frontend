import dynamic from "next/dynamic";
import withDashboardLayout from "@components/common/layouts/dashboard";

const Page = dynamic(
	() => import("@components/common/page").then((mod) => mod.default),
	{ ssr: false }
);

const DashboardComponent = dynamic(
	() => import("@components/overview").then((mod) => mod.default),
	{ ssr: false }
);

const Payment = () => (
	<Page title="Crowdloans" layoutProvider={withDashboardLayout}>
		{() => <DashboardComponent />}
	</Page>
);

export default Payment;

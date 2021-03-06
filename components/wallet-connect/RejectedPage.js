const RejectedPage = ({ handleRecoveryAuth }) => (
	<div className="pb-12 flex flex-col text-center items-center">
		<img src="/images/polkadot-wallet-connect.png" width="200px" />
		<h3 className="mt-4 text-xl font-semibold px-20 text-gray-700">
			Connect to the PolkadotJS browser extension
		</h3>
		<span className="mt-4 px-4 text-xs text-gray-600">
			PolkadotJS extension is a simple browser extension for managing your
			accounts. It allows you to securely sign transactions using these accounts
			while maintaining complete control over your funds.
		</span>
		<a
			className="mt-12 px-16 py-3 bg-black text-white rounded-full"
			href="https://github.com/polkadot-js/extension#installation"
			target="_blank"
		>
			Install extension
		</a>
		<span
			className="mt-2 px-4 text-xs text-gray-600 underline cursor-pointer"
			onClick={handleRecoveryAuth}
		>
			Accidently rejected the permission request?
		</span>
		<span className="mt-6 text-sm text-gray-600">
			Using a different wallet?{" "}
			<a
				className="text-gray-700 font-semibold"
				href="https://yieldscan.upvoty.com/b/yieldscan/"
				target="_blank"
			>
				Request feature
			</a>
		</span>
	</div>
);

export default RejectedPage;

import { StrictMode } from "react";
import { KindeProvider } from "@kinde-oss/kinde-auth-react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

ReactDOM.render(
	<StrictMode>
		<ConvexProvider client={convex}>
			<KindeProvider
				clientId='1ba52231d11245628a745c35d061a630'
				domain='https://aichat.kinde.com'
				logoutUri={window.location.origin}
				redirectUri={window.location.origin}>
				<App />
			</KindeProvider>
		</ConvexProvider>
	</StrictMode>,
	document.getElementById("root")
);

import React, { useEffect } from "react";
import { useAuthUser, useSignOut } from "react-auth-kit";
import { useLocation } from "react-router-dom";

type Props = {
	children: JSX.Element;
};

const TokenWatcher: React.FC<Props> = ({ children }) => {
	const authState = useAuthUser() as any;
	const location = useLocation();
	const signOut = useSignOut();
	useEffect(() => {
		const interval = setInterval(() => {
			const expiresat = authState().expiresat * 1000;
			const now = new Date().getTime();

			if (expiresat < now) {
				setTimeout(() => {
					clearInterval(interval);
					signOut();
				}, 3000);
				return;
			}
			return;
		}, 5000);
	}, [location]);

	return <>{children}</>;
};

export default TokenWatcher;

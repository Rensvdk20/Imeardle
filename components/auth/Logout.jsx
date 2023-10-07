"use client";

import { signOut } from "next-auth/react";

export default function Logout() {
	return (
		<span className="nav-link" onClick={() => signOut()}>
			Logout
		</span>
	);
}

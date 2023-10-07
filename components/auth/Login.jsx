"use client";

import { signIn } from "next-auth/react";

export default function Login() {
	return (
		<span className="nav-link" onClick={() => signIn()}>
			Login
		</span>
	);
}

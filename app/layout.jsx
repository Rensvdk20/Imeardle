import { getServerSession } from "next-auth/next";
import { authOptions } from "../pages/api/auth/[...nextauth]";

import Link from "next/link";
import Login from "../components/auth/Login";

import "bootstrap/dist/css/bootstrap.min.css";
import "../shared/styles/global.scss";
import { Fragment } from "react";
import Image from "next/image.js";
import Logout from "../components/auth/Logout";
import Provider from "../components/auth/Provider";
import BootstrapClient from "../components/bootstrap/BootstrapClient";

export const metadata = {
	title: "Imeardle",
};

export default async function RootLayout({ children }) {
	const session = await getServerSession(authOptions);

	return (
		<html lang="en">
			<body>
				<nav className="navbar navbar-expand-lg navbar-dark">
					<div className="container-fluid">
						<Link className="navbar-brand" href="/">
							<svg
								viewBox="0 0 16 16"
								height="1.5em"
								width="1.5em"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path d="M9 13c0 1.105-1.12 2-2.5 2S4 14.105 4 13s1.12-2 2.5-2 2.5.895 2.5 2z"></path>
								<path
									fillRule="evenodd"
									d="M9 3v10H8V3h1z"
								></path>
								<path d="M8 2.82a1 1 0 0 1 .804-.98l3-.6A1 1 0 0 1 13 2.22V4L8 5V2.82z"></path>
							</svg>
							Imeardle
						</Link>
						<button
							className="navbar-toggler"
							type="button"
							data-bs-toggle="collapse"
							data-bs-target="#navbarNav"
							aria-controls="navbarNav"
							aria-expanded="false"
							aria-label="Toggle navigation"
						>
							<span className="navbar-toggler-icon"></span>
						</button>
						<div
							className="collapse navbar-collapse"
							id="navbarNav"
						>
							<ul className="navbar-nav">
								<li className="nav-item">
									<Link className="nav-link" href="/playlist">
										Playlists
									</Link>
								</li>
								<li className="nav-item">
									<Link className="nav-link" href="/about">
										About
									</Link>
								</li>
							</ul>

							<ul className="navbar-nav nav-right">
								{session && session.user ? (
									<Fragment>
										<li className="nav-item">
											<Image
												className="profile-pic"
												src={session.user.image}
												width={25}
												height={25}
											/>
										</li>
										<li className="nav-item">
											<Link
												className="nav-link"
												href="/manager"
											>
												My playlists
											</Link>
										</li>
										<li className="nav-item">
											<Logout />
										</li>
									</Fragment>
								) : (
									<li className="nav-item">
										<Login />
									</li>
								)}
							</ul>
						</div>
					</div>
				</nav>
				<Provider>{children}</Provider>
				<BootstrapClient />
			</body>
		</html>
	);
}

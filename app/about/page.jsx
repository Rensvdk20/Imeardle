import "./page.scss";

function About() {
	return (
		<div className="about">
			<div className="about-content">
				<h1>About</h1>
				<p>
					Imeardle challenges players to guess a song within 5
					attempts. You can craft your own playlists, share them with
					friends or explore playlists crafted by other people. The
					length of each song snippet increases with every incorrect
					guess.
				</p>
				<p>
					We value your privacy and only collect essential user data,
					including your username, email, and profile picture. Your
					username and profile picture are visible to other users for
					a personalized experience, while your email is solely used
					for account identification purposes. This data is stored on
					a secure MySQL database.
				</p>
				<p></p>
				<p>
					<a href="/privacy-policy.html" target="_blank">
						Privacy Policy
					</a>
				</p>
				<h2>Copyright</h2>
				<p>
					If you have a copyright complaint, please let me know and
					include the page that contains the alleged content,
					identification of the work claimed to have been infringed,
					including the name and reply email address of the copyright
					holder/representative, an assertion that the use of the
					material is not authorized, and an assertion that you are
					the copyright holder/representative. You can reach me at
					imeardle@gmail.com.
				</p>
			</div>
		</div>
	);
}

export default About;

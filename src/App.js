import { Fragment } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import ImeardlePlayer from "./components/music/ImeardlePlayer";
import "./global.scss";

const App = () => {
	return (
		<Fragment>
			<ImeardlePlayer />
		</Fragment>
	);
};

export default App;

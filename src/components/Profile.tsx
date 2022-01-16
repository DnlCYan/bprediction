import jwtDecode from 'jwt-decode';
import React, { useState, useEffect, useRef} from 'react';
import UserService from '../services/User.service';
import {User} from '../models';

import { Auth } from '../types';

interface Props {
	auth: Auth;
	onLoggedOut: () => void;
	onLoad: (user: User) => void;
}

interface State {
	loading: boolean;
	user?: User;
}

interface JwtDecoded {
	payload: {
		id: string;
		publicAddress: string;
	};
}

const Profile = ({ auth, onLoggedOut, onLoad }: Props): JSX.Element => {
	const [state, setState] = useState<State>({
		loading: false,
		user: undefined,
	});

	useEffect(() => {
		const { accessToken } = auth;
		const {
			payload: { publicAddress },
		} = jwtDecode<JwtDecoded>(accessToken);

		UserService.get(publicAddress)
			.then((response) => response[0])
			.then((user) => {
				setState({ ...state, user });
				onLoad(user);
			})
			.catch(window.alert);
	}, []);


	const { accessToken } = auth;

	const {
		payload: { publicAddress },
	} = jwtDecode<JwtDecoded>(accessToken);

	return (
		<div className="Profile">
			<div>
				My publicAddress is <pre>{publicAddress}</pre>
			</div>
			<p>
				<button onClick={onLoggedOut}>Logout</button>
			</p>
		</div>
	);
};

export default Profile;
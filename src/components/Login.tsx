
import React, { useState } from 'react';
import Web3 from 'web3';

import AuthService from '../services/Auth.service';
import UserService from '../services/User.service';
import { Auth } from '../types';
import { User } from '../models';

interface Props {
	currentPoints: number;
	onLoggedIn: (auth: Auth) => void;
}

let web3: Web3 | undefined = undefined; // Will hold the web3 instance

const Login = ({ currentPoints, onLoggedIn }: Props): JSX.Element => {
	const [loading, setLoading] = useState(false); // Loading button state

	const handleAuthenticate = ({
		publicAddress,
		signature,
	}: {
		publicAddress: string;
		signature: string;
	}) =>
		AuthService.create(publicAddress, signature );

	const handleSignMessage = async (user: User) => {
		try {
			const signature = await web3!.eth.personal.sign(
				`I am signing my one-time nonce: ${user.nonce}`,
				user.publicAddress,
				'' // MetaMask will ignore the password argument here
			);

			return { publicAddress: user.publicAddress, signature };
		} catch (err) {
			throw new Error(
				'You need to sign the message to be able to log in.'
			);
		}
	};

	const handleSignup = (publicAddress: string) =>
		UserService.save(new User({ publicAddress: publicAddress, nonce: Math.floor(Math.random() * 10000), points: currentPoints }));

	const handleLogin = async () => {
		// Check if MetaMask is installed
		if (!(window as any).ethereum) {
			window.alert('Please install MetaMask first.');
			return;
		}

		if (!web3) {
			try {
				// Request account access if needed
				await (window as any).ethereum.enable();

				// We don't know window.web3 version, so we use our own instance of Web3
				// with the injected provider given by MetaMask
				web3 = new Web3((window as any).ethereum);
			} catch (error) {
				window.alert('You need to allow MetaMask.');
				return;
			}
		}

		const coinbase = await web3.eth.getCoinbase();
		if (!coinbase) {
			window.alert('Please activate MetaMask first.');
			return;
		}

		const publicAddress = coinbase.toLowerCase();
		setLoading(true);

		// Look if user with current publicAddress is already present on backend
		UserService.get(publicAddress)
			.then((users: User[]) =>
				// If yes, retrieve it. If no, create it.
				users.length ? users[0] : handleSignup(publicAddress))

			// Popup MetaMask confirmation modal to sign message
			.then(handleSignMessage)
			// Send signature to backend on the /auth route
			.then(handleAuthenticate)
			// Pass accessToken back to parent component (to save it in localStorage)
			.then(onLoggedIn)
			.catch((err: any) => {
				window.alert(err);
				setLoading(false);
			});
	};

	return (
		<div>
			<h4>If you what to save your points please Sign in below</h4>
			<button className="Login-button Login-mm" onClick={handleLogin}>
				{loading ? 'Loading...' : 'Login with MetaMask'}
			</button>
		</div>
	);
};

export default Login;
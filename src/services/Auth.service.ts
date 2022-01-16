import { recoverPersonalSignature } from 'eth-sig-util';
import { bufferToHex } from 'ethereumjs-util';
import jwt from 'jsonwebtoken';

import userService from './User.service';
import { User } from './../models';
import { config } from './config';
import { Auth } from '../types';

export default class AuthService {
	public static async create(publicAddress: string, signature: string) {

		return new Promise<Auth>((resolve, reject) => {
			if (!signature || !publicAddress) {
				reject('Request should have signature and publicAddress');
				return null;
			}

			////////////////////////////////////////////////////
			// Step 1: Get the user with the given publicAddress
			////////////////////////////////////////////////////
			return userService.get(publicAddress)
				.then((users: User[]) => {
					if (!users || !users.length) {
						reject(`User with publicAddress ${publicAddress} is not found in database`)
						return null;
					}

					return users[0];
				})
				////////////////////////////////////////////////////
				// Step 2: Verify digital signature
				////////////////////////////////////////////////////
				.then((user: User | null) => {
					if (!(user instanceof User)) {
						// Should not happen, we should have already sent the response
						reject('User is not defined in "Verify digital signature".' + publicAddress);
						return null;
					}

					const msg = `I am signing my one-time nonce: ${user?.nonce}`;

					// We now are in possession of msg, publicAddress and signature. We
					// will use a helper from eth-sig-util to extract the address from the signature
					const msgBufferHex = bufferToHex(Buffer.from(msg, 'utf8'));
					const address = recoverPersonalSignature({
						data: msgBufferHex,
						sig: signature,
					});

					// The signature verification is successful if the address found with
					// sigUtil.recoverPersonalSignature matches the initial publicAddress
					if (address.toLowerCase() === publicAddress.toLowerCase()) {
						return user;
					} else {
						reject('Signature verification failed');
						return null;
					}
				})
				////////////////////////////////////////////////////
				// Step 3: Generate a new nonce for the user
				////////////////////////////////////////////////////
				.then((user: User | null) => {
					if (!user || !(user instanceof User)) {
						// Should not happen, we should have already sent the response

						reject('User is not defined in "Generate a new nonce for the user".');
						return null;
					}

					return userService.save(User.copyOf(user, updated => {
						updated.nonce = Math.floor(Math.random() * 10000);
					}));
				})
				////////////////////////////////////////////////////
				// Step 4: Create JWT
				////////////////////////////////////////////////////
				.then((user: User | null) => {
					return new Promise<string>((resolve, reject) =>
						// https://github.com/auth0/node-jsonwebtoken
						jwt.sign(
							{
								payload: {
									id: user?.id,
									publicAddress,
								},
							},
							config.secret,
							{
								algorithm: config.algorithms[0],
							},
							(err: any, token: any) => {
								if (err) {
									return reject(err);
								}
								if (!token) {
									return new Error('Empty token');
								}
								return resolve(token);
							}
						)
					);
				})
				.then((accessToken: string) => {
					resolve({ accessToken });
				})
				.catch((ex) => reject(ex))
		});
	};
}
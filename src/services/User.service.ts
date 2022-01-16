import { DataStore } from '@aws-amplify/datastore';
import { User } from './../models';

export default class UserService {
	public static async get(publicAddress: string): Promise<User[]> {
		return DataStore.query(User, u => u.publicAddress("eq", publicAddress));
	};

	public static async getAll(): Promise<User[]> {
		return DataStore.query(User);
	};

	public static async save(user: User): Promise<User> {
		return DataStore.save(user);
	}

	public static async updatePoints(publicAddress: string, points: number): Promise<User | null> {
		return this.get(publicAddress)
			.then((users: User[]) => {
				// If yes, retrieve it. If no, create it.
				let user = users.length ? users[0] : null;
				if (!user)
					return null;

				return this.save(User.copyOf(user, updated => {
					updated.points = points;
				}));
			})
	}
}

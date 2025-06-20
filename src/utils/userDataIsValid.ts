import { User } from '../data/users.js';

const hasOwnProperty = <T, K extends PropertyKey>(
    obj: T,
    prop: K,
): obj is T & Record<K, unknown> =>
    Object.prototype.hasOwnProperty.call(obj, prop);

const userDataIsValid = (userData: unknown): userData is Omit<User, 'id'> => {
    return (
        typeof userData === 'object' &&
        userData != null &&
        hasOwnProperty(userData, 'username') &&
        typeof userData.username === 'string' &&
        hasOwnProperty(userData, 'age') &&
        typeof userData.age === 'number' &&
        userData.age > 0 &&
        hasOwnProperty(userData, 'hobbies') &&
        Array.isArray(userData.hobbies) &&
        userData.hobbies.some((value: unknown) => typeof value !== 'string')
    );
};

export default userDataIsValid;

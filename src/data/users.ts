import { randomUUID } from 'crypto';

type User = {
    id: string;
    username: string;
    age: number;
    hobbies: string[];
};

const users: User[] = [
    {
        id: randomUUID(),
        username: 'skywalker92',
        age: 31,
        hobbies: ['reading', 'cycling', 'chess'],
    },
    {
        id: randomUUID(),
        username: 'pixelFox',
        age: 24,
        hobbies: ['gaming', 'drawing', 'streaming'],
    },
    {
        id: randomUUID(),
        username: 'byteHunter',
        age: 28,
        hobbies: ['coding', 'hiking', 'photography'],
    },
    {
        id: randomUUID(),
        username: 'novaPulse',
        age: 22,
        hobbies: ['music', 'writing', 'traveling'],
    },
    {
        id: randomUUID(),
        username: 'codeCactus',
        age: 35,
        hobbies: ['gardening', 'blogging', 'puzzles'],
    },
];

const getUsers = () => users;
const getUser = (idToFind: string) => users.find(({ id }) => id === idToFind);
const addUser = (newUser: User) => {
    users.push(newUser);
    return { ...newUser };
};
const updateUser = (userToUpdate: User) => {
    for (let i = 0; i < users.length; i++) {
        if (users[i]?.id === userToUpdate.id) {
            users[i] = userToUpdate;
            return { ...users[i] };
        }
    }

    addUser(userToUpdate);
};
const deleteUser = (idToDelete: string) => {
    for (let i = 0; i < users.length; i++) {
        if (users[i]?.id === idToDelete) {
            users.splice(i, 1);
            return [...users];
        }
    }
};

export { getUsers, getUser, addUser, updateUser, deleteUser };

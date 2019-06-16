'use strict';

import {AsyncStorage} from 'react-native';
const kStorageUser = 'kStorageUser';
export const getUser = () => {
    return AsyncStorage.getItem(kStorageUser)
        .then((user) => {
            if (user) {
                return JSON.parse(user);
            } else {
                return {};
            }
        })
        .catch(error => {            
        });
};
export const setUser = (user) => {
    AsyncStorage.setItem(kStorageUser, JSON.stringify(user));
};
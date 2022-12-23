import { auth } from './FirebaseConfig';

function curUserAbbr() {
    return getShortenedID(auth.currentUser.uid);
}

function getShortenedID(id) {
    return id.substring(0, 6);
}

export { getShortenedID, curUserAbbr };
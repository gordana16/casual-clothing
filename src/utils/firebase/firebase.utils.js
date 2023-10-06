import { initializeApp } from 'firebase/app';
import {
	getAuth,
	signInWithPopup,
	signInWithRedirect,
	GoogleAuthProvider,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword
} from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
	apiKey: 'AIzaSyBlSKJC2sPerv8lF64STWWnqPKSQqHcMMM',
	authDomain: 'casual-clothing-db-6caea.firebaseapp.com',
	projectId: 'casual-clothing-db-6caea',
	storageBucket: 'casual-clothing-db-6caea.appspot.com',
	messagingSenderId: '1036116883841',
	appId: '1:1036116883841:web:6eed13a151dadfcafcd080'
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
	prompt: 'select_account'
});

export const auth = getAuth();
export const signInWithGooglePopup = () =>
	signInWithPopup(auth, googleProvider);
export const signInWithGoogleRedirect = () =>
	signInWithRedirect(auth, googleProvider);

export const db = getFirestore();

export const createUserDocumentFromAuth = async (
	userAuth,
	additionalInformation = {}
) => {
	console.log('userAuth.uid', userAuth.uid);
	const userDocRef = doc(db, 'users', userAuth.uid);
	console.log(userDocRef);

	const userSnapshot = await getDoc(userDocRef);
	console.log('userSnapshot', userSnapshot);
	console.log('exists', userSnapshot.exists());
	if (!userSnapshot.exists()) {
		const { displayName, email } = userAuth;
		const createdAt = new Date();

		try {
			await setDoc(userDocRef, {
				displayName,
				email,
				createdAt,
				...additionalInformation
			});
		} catch (error) {
			console.log('Error creating a user', error.message);
		}
	}
	return userDocRef;
};

export const createAuthUserWithEmailAndPassword = async (email, password) => {
	if (!email || !password) return;

	return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
	if (!email || !password) return;

	return await signInWithEmailAndPassword(auth, email, password);
};

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  deleteUser,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  EmailAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase";

const googleProvider = new GoogleAuthProvider();

export const signUp = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

export const signIn = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

export const signInWithGoogle = () =>
    signInWithPopup(auth, googleProvider);

export const logOut = () => signOut(auth);

export const getAuthToken = async () => {
  const user = auth.currentUser;
  if (!user) return null;
  return await user.getIdToken();
};

export const deleteAccount = async (password = null) => {
  const user = auth.currentUser;
  if (!user) throw new Error("No user is signed in.");

  try {
    await deleteUser(user);
  } catch (err) {
    if (err.code === "auth/requires-recent-login") {
      const providerIds = user.providerData.map((p) => p.providerId);

      if (providerIds.includes("google.com")) {
        await reauthenticateWithPopup(user, googleProvider);
      } else if (providerIds.includes("password") && password) {
        const credential = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, credential);
      } else {
        throw new Error(
            "Your session has expired. Please sign out, sign in again, and then delete your account."
        );
      }

      await deleteUser(auth.currentUser);
    } else {
      throw err;
    }
  }

  localStorage.removeItem("token");
  localStorage.removeItem("userGoal");
};
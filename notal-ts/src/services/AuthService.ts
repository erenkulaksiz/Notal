import {
  getAuth,
  getIdToken,
  GoogleAuthProvider,
  signInWithRedirect,
} from "firebase/auth";

const AuthService = {
  login: {
    google: async function () {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      await signInWithRedirect(auth, provider);
    },
  },
  user: {
    logout: async function () {
      const auth = getAuth();
      await auth.signOut();
    },
    getIdToken: async function () {
      const auth = getAuth();
      if (!auth.currentUser) return null;
      const res = await getIdToken(auth.currentUser);
      return { res };
    },
  },
};

export default AuthService;

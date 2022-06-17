import {
  getAuth,
  getIdToken,
  GoogleAuthProvider,
  signInWithRedirect,
} from "firebase/auth";

const AuthService = {
  login: {
    google: async () => {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      await signInWithRedirect(auth, provider);
    },
  },
  user: {
    logout: async () => {
      const auth = getAuth();
      await auth.signOut();
    },
    getIdToken: async () => {
      const auth = getAuth();
      if (!auth.currentUser) return;
      const res = await getIdToken(auth.currentUser);
      return { res };
    },
  },
};

export default AuthService;

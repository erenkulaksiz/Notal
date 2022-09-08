import {
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from "firebase/auth";

interface AuthServiceReturnType {
  user?: User;
  token?: string | undefined;
  error?: {
    errorCode: number;
    errorMessage: string;
  };
}

export const AuthService = {
  login: {
    google: async function (): Promise<AuthServiceReturnType> {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const signin = await signInWithPopup(auth, provider)
        .then(async (result) => {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential?.accessToken;
          const { user } = result;

          window.gtag("event", "login", { login: "type:google/" + user.email });

          //Router.replace(Router.asPath);

          return { user, token };
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          const email = error.email;
          const credential = GoogleAuthProvider.credentialFromError(error);

          return { error: { errorCode, errorMessage } };
        });
      return signin;
    },
    github: async function(): Promise<AuthServiceReturnType>{
      const auth = getAuth();
      const provider = new GithubAuthProvider();
      const signin = await signInWithPopup(auth, provider)
      .then(async (result) => {
        const credential = GithubAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        const {user}=result;
  
        window.gtag("event", "login", { login: "type:github/" + user.email });
  
        return {user,token};
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = GoogleAuthProvider.credentialFromError(error);

        return { error: { errorCode, errorMessage } };
      });
  
      return signin;
    },
  },
  user: {
    logout: async function () {
      const auth = getAuth();
      await auth.signOut();
    },
  },
};

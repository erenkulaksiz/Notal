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
    errorCode: number | string;
    errorMessage: string;
  };
}

interface loginPlatforms {
  google: () => void;
  github: () => void;
}

export const AuthService = {
  login: {
    platform: async function(type: string): Promise<AuthServiceReturnType> {
      const auth = getAuth();
      let provider = null;
      const loginType = {
        google: async () => {
          provider = new GoogleAuthProvider();
        },
        github: async () => {
          provider = new GithubAuthProvider()
        }
      } as loginPlatforms;
      loginType[type as keyof loginPlatforms]();
      if(!provider) return { 
        error: {
          errorMessage: "no-auth", 
          errorCode: "no-auth"
        } 
      };
      const signin = await signInWithPopup(auth, provider)
        .then(async (result) => {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential?.accessToken;
          const { user } = result;

          window.gtag("event", "login", { login: `type:${type}/` + user.email });

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
    }
  },
  user: {
    logout: async function () {
      const auth = getAuth();
      await auth.signOut();
    },
  },
};

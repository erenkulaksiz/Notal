import {
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from "firebase/auth";
import type { PlatformLogins } from "@types";
import { Log } from "@utils/logger";

interface AuthServiceReturnType {
  user?: User;
  token?: string | undefined;
  error?: {
    errorCode: number | string;
    errorMessage: string;
  };
}

interface AuthServiceTypes {
  login: {
    platform: (platform: string) => Promise<AuthServiceReturnType>;
  };
  user: {
    logout: () => Promise<void>;
  };
}

export const AuthService = {
  login: {
    platform: async function (type: string): Promise<AuthServiceReturnType> {
      const auth = getAuth();
      let provider = null;
      const loginType = {
        google: function () {
          provider = new GoogleAuthProvider();
        },
        github: function () {
          provider = new GithubAuthProvider();
        },
        email: function () {},
      } as PlatformLogins;
      loginType[type as keyof PlatformLogins]();
      if (!provider)
        return {
          error: {
            errorMessage: "no-auth",
            errorCode: "no-auth",
          },
        };
      const signin = await signInWithPopup(auth, provider)
        .then(async (result) => {
          let credential;
          switch (type) {
            case "google":
              credential = GoogleAuthProvider.credentialFromResult(result);
              break;
            case "github":
              credential = GithubAuthProvider.credentialFromResult(result);
              break;
          }
          const token = credential?.accessToken;
          const { user } = result;

          window.gtag("event", "login", {
            login: `type:${type}/` + user.email,
          });

          return { user, token };
        })
        .catch((error) => {
          let credential;
          switch (type) {
            case "google":
              credential = GoogleAuthProvider.credentialFromError(error);
              break;
            case "github":
              credential = GithubAuthProvider.credentialFromError(error);
              break;
          }
          const errorCode = error.code;
          const errorMessage = error.message;
          const email = error.email;

          Log.error(
            "Login auth error, AuthService.ts",
            errorCode,
            errorMessage
          );

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
} as AuthServiceTypes;

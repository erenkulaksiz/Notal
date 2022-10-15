import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  getAuth,
  onIdTokenChanged,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import Cookies from "js-cookie";

import { AuthService } from "@services/AuthService";
import { NotifyLogin } from "@utils/api/notifyLogin";
import { useNotalUI } from "@hooks";
import { InfoIcon } from "@icons";

interface LoginTypes {
  platform: (platform: string) => Promise<{
    authUser: AuthContextProps["authUser"];
    authError: AuthContextProps["authError"];
  }>;
  logout: () => Promise<void>;
  reload: () => Promise<void>;
}

interface UsersTypes {
  getIdToken: () => Promise<{ success: boolean; res?: string; error?: any }>;
}

export interface AuthContextProps {
  authUser: null | User;
  authError?: string | null | undefined;
  setUser: Dispatch<SetStateAction<User | null>> | null;
  login: LoginTypes;
  user: UsersTypes;
  authLoading: boolean | null;
  validatedUser: {
    fullname: string;
    uid: string;
    username: string;
    avatar: string;
    email: string;
  } | null;
  setValidatedUser: Dispatch<SetStateAction<Object | any>>;
}

const AuthContext = createContext<AuthContextProps | null>(null);

export default function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider(props: PropsWithChildren) {
  const auth = getAuth();
  const NotalUI = useNotalUI();

  const [validatedUser, setValidatedUser] = useState(null);

  const [user, setUser] = useState<null | User>(null);
  const [error, setError] = useState<null | undefined | string>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tokenChange = onIdTokenChanged(auth, async (user) => {
      if (!user) {
        setUser(null);
        setError(null);
        setValidatedUser(null); // remove user
        Cookies.remove("auth");
        return;
      } else {
        const token = await user.getIdToken();
        setUser(user);
        Cookies.set("auth", token, { expires: 365 });
      }
    });

    const tokenCheck = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (!user) {
        setLoading(false);
        setUser(null);
        setError(null);
        setValidatedUser(null); // remove user
        Cookies.remove("auth");
      } else {
        const token = await user.getIdToken();
        Cookies.set("auth", token, { expires: 365 });
        setLoading(false);
        setUser(user ?? null);
        setError(null);
      }
    });

    return () => {
      tokenChange();
      tokenCheck();
    };
  }, []);

  const login = {
    platform: async function (platform: string) {
      setLoading(true);
      const res = await AuthService.login.platform(platform);

      const { user, error } = res;
      setUser(user ?? null);
      setError(error?.errorMessage ?? null);

      setLoading(false);

      if (!error) {
        const token = await user?.getIdToken();
        await NotifyLogin(token);
        NotalUI.Toast.show({
          desc: `Logged in as ${user?.email}`,
          icon: <InfoIcon size={24} fill="currentColor" />,
          className: "dark:bg-green-600 bg-green-500 text-white",
          duration: 4500,
          timeEnabled: true,
          closeable: true,
        });
        NotalUI.Alert.show({
          title: "Welcome to Notal!",
          desc: "This is an experimental application and growing fast day by day. If you find any bugs or have any suggestions, please let me know!",
          showCloseButton: true,
          notCloseable: false,
          animate: true,
        });
      }

      return { authError: error ?? null, authUser: user ?? null };
    },
    logout: async function () {
      await AuthService.user.logout();
      Cookies.remove("auth");
      setUser(null);
      setError(null);
      setValidatedUser(null);
    },
    reload: async function () {
      const auth = getAuth();
      setLoading(true);
      if (!auth.currentUser) {
        setLoading(false);
        setUser(null);
        setError(null);
        setValidatedUser(null);
        Cookies.remove("auth");
      } else {
        const token = await auth.currentUser.getIdToken();
        Cookies.set("auth", token, { expires: 365 });
        setLoading(false);
        setUser(user ?? null);
        setError(null);
      }
    },
  } as LoginTypes;

  const users = {
    getIdToken: async function () {
      try {
        const res = await user?.getIdToken();
        return { success: true, res };
      } catch (error) {
        return { success: false, error };
      }
    },
  } as UsersTypes;

  const value = {
    authUser: user,
    authError: error,
    setUser,
    login,
    user: users,
    authLoading: loading,
    setValidatedUser,
    validatedUser,
  };

  return <AuthContext.Provider value={value} {...props} />;
}

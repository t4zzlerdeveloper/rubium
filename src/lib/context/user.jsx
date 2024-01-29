import { createContext, useContext, useEffect, useState } from "react";
import { ID, account } from "../appwrite";

const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider(props) {
  const [user, setUser] = useState(null);

  async function login(email, password) {
    const loggedIn = await account.createEmailSession(email, password);
    setUser(await account.get());
  }

  async function loginWithGoogle() {
    const loggedIn = await account.createOAuth2Session("google","http://localhost:5173/auth/oauth2/success","http://localhost:5173/login",["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile", "openid"]);
    setUser(await account.get());
  }

  async function logout() {
    await account.deleteSession("current");
    setUser(null);
  }

  async function register(name,email, password) {
    await account.create(ID.unique(),email, password,name);
    await login(email, password);
    await sendVerification();
  }

  async function sendVerification(){
    await account.createVerification("https://rubium.vercel.app/verify");
  }


  async function init() {
    try {
      const loggedIn = await account.get();
      const session = await account.getSession("current");
      setUser({...loggedIn,sessionId:session.$id});
    } catch (err) {
      setUser(null);
    }
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <UserContext.Provider value={{ current: user, login,loginWithGoogle, logout, register,sendVerification }}>
      {props.children}
    </UserContext.Provider>
  );
}

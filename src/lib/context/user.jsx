import { createContext, useContext, useEffect, useState } from "react";
import { ID, account, locale } from "../appwrite";

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

  async function loginWith(provider) {
    //await account.createAnonymousSession();
    const host = window.location.origin;
    const loggedIn = await account.createOAuth2Session(provider,host + "/auth/oauth2/success", host + "/login",["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile", "openid"]);
  }

  async function logout() {
    await account.deleteSession("current");
    setUser(null);
  }

  async function register(name,email, password) {
    await account.create(ID.unique(),email, password,name);
    await login(email, password);
    const locale = await locale.get();
    await updatePrefs({"locale":locale ? locale : 'en'})
    await sendVerification();
  }

  async function sendVerification(){
    await account.createVerification("https://rubium.vercel.app/verify");
  }

  async function updateUserSettings(newName,newPrefs){
    await account.updateName(newName);
    await account.updatePrefs(newPrefs);
    await init();
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
    <UserContext.Provider value={{ current: user, login,loginWith, logout, register,sendVerification,updateUserSettings}}>
      {props.children}
    </UserContext.Provider>
  );
}

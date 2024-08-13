import { createContext } from "react";
import { eraseCookie, getCookie, setCookie } from "../../components/cookies";
import { cookieName_access_token, cookieName_name, cookieName_sub } from "../..";
import { RetrieveUserInfo_PostBody, RetrieveUserInfo_Response } from "../../../src/interfaces";

export interface UserInfo {
    sub: string;
    picture: string;
    name: string;
    token?: string;
    isAdmin: boolean
  }
  
export interface UserInfoContextType {
    userInfo: UserInfo;
    setUserInfo: (newUserInfo: Partial<UserInfo>) => void;
}

export const defaultUserInfo: UserInfo = {
    sub: '',
    picture: '',
    name: 'User Name',
    token: undefined,
    isAdmin: false
}

export const UserInfoContext = createContext<UserInfoContextType>({
    userInfo: defaultUserInfo,
    setUserInfo: () => {},
});

export const updateUserInfo = async (context: UserInfoContextType, access_token: string) =>
{
    const { setUserInfo } = context;

    console.log(`Updating user, token: `, access_token);

    try {
        const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
            Authorization: `Bearer ${access_token}`,
            },
        });
        const userInfoJson = await response.json();

        if(userInfoJson.error)
        {
            setUserInfo({token: undefined});
            eraseCookie(cookieName_access_token);
            return;
        }

        const name: string = userInfoJson.name;
        const sub: string = userInfoJson.sub;

        console.log("userInfoJson:", userInfoJson);

        setCookie(cookieName_name, name, 10);
        setCookie(cookieName_sub, sub, 10);

        setUserInfo({
            name: name,
            token: access_token,
            sub: sub
        });

    } catch (error) {
        console.error('Failed to fetch user info:', error);
    }
}

export const retrieveUserInfo = async (context: UserInfoContextType, sub: string) =>
{
    console.log("retrieveUserInfo", sub);

    const body: RetrieveUserInfo_PostBody = {
        sub: sub
    }

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      };

    console.log('/update', requestOptions)

    fetch('/api/suggestions/userInfo', requestOptions)
    .then(response => response.json())
    .then((data: RetrieveUserInfo_Response) => {

        if(data.isAdmin)
        {
            context.setUserInfo({isAdmin: true});
        }
    });
}
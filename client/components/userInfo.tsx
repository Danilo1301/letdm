import { Context, createContext, useContext } from "react";


/*
const fodase = () => {
    const { name, setName, access_token, setAccessToken } = useContext(UserInfoContext);

    useEffect(() => {
        async function run()
        {
            console.log("getting token...");
            
            const access_token = getCookie(cookieName_access_token);

            console.log(access_token);

            if(access_token != null)
            {
                setAccessToken(access_token);
            }

            try {
                const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: {
                    Authorization: `Bearer ${access_token}`,
                    },
                });
                const userInfo = await response.json();
            
                console.log("userInfo:", userInfo);
            
                if(userInfo.error)
                {
                    eraseCookie(cookieName_access_token);
                    setAccessToken("");
                } else {
                    const name: string = userInfo.name;
                
                    setName(name);
                }
            
            } catch (error) {
                console.error('Failed to fetch user info:', error);
            }
        }
      
        run()
    }, []);
};
*/

/*
export const updateUserInfo = async () => {
  
  const { name, setName, access_token } = useContext(UserInfoContext);

  try {
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
        Authorization: `Bearer ${access_token}`,
        },
    });
    const userInfo = await response.json();

    console.log("userInfo:", userInfo);

    const name: string = userInfo.name;

    setName(name);

  } catch (error) {
      console.error('Failed to fetch user info:', error);
  }
};
*/
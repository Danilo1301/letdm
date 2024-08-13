import React, { useContext, useEffect } from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { eraseCookie, getCookie, setCookie } from '../../components/cookies';
import { cookieName_access_token, cookieName_name, cookieName_sub } from '../..';
import { retrieveUserInfo, updateUserInfo, UserInfo, UserInfoContext } from './UserInfo';

const UserButton: React.FC = () =>
{
    const userInfoContext = useContext(UserInfoContext);
    const { userInfo, setUserInfo } = userInfoContext;

    const login = useGoogleLogin({
        onSuccess: async tokenResponse => {
            console.log("tokenResponse:", tokenResponse);

            const access_token = tokenResponse.access_token;

            setCookie(cookieName_access_token, access_token, 100);
            
            updateUserInfo(userInfoContext, access_token).then(() =>{
               //Do other things on success
            }).catch((error) => {
                //Do other things on fail
            })
        }, 
        onError: (error) => {
            console.log("error")
            // Do other things on fail
        },
        flow: 'implicit'
    });

    const logout = () => {
        googleLogout();
        eraseCookie(cookieName_access_token);
        eraseCookie(cookieName_name);
        eraseCookie(cookieName_sub);
        setUserInfo({token: undefined, sub: '', name: ''})
    };

    const change = () => {
        setUserInfo({name: "Change()"});
    };

    if(!userInfo.token)
    {
        return (
            <>
                <button onClick={() => login()}>Login with Google</button>
            </>
        );
    }

    return (
        <>
            <i className="fa fa-user"></i>
            <span>{userInfo.isAdmin ? "[A]" : ""}</span>
            <span>{userInfo.name} | </span>
            <span>{userInfo.token.slice(0, 6)}</span>
            <button onClick={() => logout()}>Logout</button>
        </>
    );
}

const MainNavbar: React.FC = () => {
    
    const userInfoContext = useContext(UserInfoContext);
    const { setUserInfo } = userInfoContext;

    React.useEffect(() => {
        async function run()
        {
            const access_token = getCookie(cookieName_access_token);
            const name = getCookie(cookieName_name);
            const sub = getCookie(cookieName_sub);

            const editData: Partial<UserInfo> = {}

            if(access_token) editData.token = access_token;
            if(name) editData.name = name;
            if(sub) editData.sub = sub;
            
            setUserInfo(editData);

            if(sub) retrieveUserInfo(userInfoContext, sub);

            /*
            if(access_token)
            {
                updateUserInfo(userInfoContext, access_token).then(() =>{
                    //Do other things on success
                }).catch((error) => {
                    //Do other things on fail
                })
            }
            */
        }

        run();
    }, []);

    return (
        <>
            <nav className="navbar navbar-expand-lg" style={{background: "#becbff"}}>
                <div className="container">
                    {/*<a className="navbar-brand" href="/">LetDM</a>*/}
                    <img style={{width: "50px", marginRight: "50px"}} src="/logo.png" alt="Logo" />
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto">
                            <li className="nav-item">
                                <a className="nav-link" aria-current="page" href="/">Home</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" aria-current="page" href="https://github.com/Danilo1301">Github</a>
                            </li>
                            <li className="nav-item flex">
                                <a className="nav-link" aria-current="page">
                                    <UserButton></UserButton>
                                </a>                                
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default MainNavbar;

/*
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <a className="navbar-brand" href="/">LetDM</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="/">Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Link</a>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Dropdown
                            </a>
                            <ul className="dropdown-menu">
                                <li><a className="dropdown-item" href="#">Action</a></li>
                                <li><a className="dropdown-item" href="#">Another action</a></li>
                                <li><hr className="dropdown-divider"/></li>
                                <li><a className="dropdown-item" href="#">Something else here</a></li>
                            </ul>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link disabled" aria-disabled="true">Disabled</a>
                        </li>
                    </ul>
                    <form className="d-flex" role="search">
                        <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"></input>
                        <button className="btn btn-outline-success" type="submit">Search</button>
                    </form>
                </div>
            </div>
        </nav>
*/
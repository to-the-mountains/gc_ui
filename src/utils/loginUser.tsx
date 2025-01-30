import { PublicClientApplication, type AccountInfo } from '@azure/msal-browser';
import { checkUser } from './apiService.tsx';

const msalConfig = {
    auth: {
        clientId: "15416e7f-0986-48a4-a727-7c868b92a475",
        authority: `https://login.microsoftonline.com/f3017b2f-b522-40dc-9641-a3cf1664413f`,
        redirectUri: 'https://192.168.229.99:3000/tour',
    },
    cache: {
        cacheLocation: 'sessionStorage',
        storeAuthStateInCookie: false,
    },
};

export async function loginUser(location: string,selectedAccount?: AccountInfo): Promise<AccountInfo | null> {
    try {
        // Initialize PublicClientApplication
        const publicClientApplication = new PublicClientApplication(msalConfig);
        await publicClientApplication.initialize();  // Initialize MSAL

        const loginRequest = {
            scopes: ['User.Read'], // Include necessary scopes
            loginHint: selectedAccount ? selectedAccount.username : undefined,
            prompt: 'select_account',
        };

        const response = await publicClientApplication.loginPopup(loginRequest);

        // Decode the ID token to check group claims
        const decodedToken: any = jwtDecode(response.idToken);
        const userEmail = decodedToken.email || decodedToken.preferred_username;

        // Check user groups
        const userGroups: string[] = decodedToken.groups || [];

        if (
            !userGroups.includes('48175477-2fb0-493b-9089-d5677dd5e1d5') && // GC Admin
            !userGroups.includes('ef1ca496-ddc6-431f-bb0d-b7ac3410acaf')    // GC Users
        ) {
            alert('You do not have access to this application.');
            return null; // Block access
        }

        const apiResponse = await checkUser(userEmail)
        const userData = apiResponse;

        if(userGroups.includes('48175477-2fb0-493b-9089-d5677dd5e1d5')){
            localStorage.setItem('role', 'admin')
        }
        if(userGroups.includes('ef1ca496-ddc6-431f-bb0d-b7ac3410acaf')){
            localStorage.setItem('role', 'user')
        }
        if(location){
            localStorage.setItem('location', location)
        }

        // If user is allowed, save their access token and return their account info
        localStorage.setItem('username', userData.UserName || "");
        localStorage.setItem('access_token', response.accessToken);
        
        return response.account;
    } catch (error) {
        console.error('Login failed:', error);
        return null;
    }
}

function jwtDecode(idToken: string): any {
    const base64Url = idToken.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
        atob(base64)
            .split('')
            .map((c) => {
                return `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`;
            })
            .join('')
    );
    return JSON.parse(jsonPayload);
}

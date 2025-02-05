import { BrowserAuthError, BrowserUtils, PublicClientApplication, type AccountInfo } from '@azure/msal-browser';
import { checkUser } from './apiService.tsx';

let redirectURI = process.env.REACT_APP_REDIRECT_URI || '';
const azureClientId = process.env.REACT_APP_AZURE_CLIENT_ID || '';
const azureDirectoryId = process.env.REACT_APP_AZURE_DIRECTORY_ID || '';

const url = window.location.href

if (url === 'https://192.168.229.99/') {
    console.log(redirectURI);
}
else if (url === 'https://localhost:3000/') {
    redirectURI = 'https://localhost:3000/tour'
}
else if (url === 'https://gca.massresort.com/') {
    redirectURI = 'https://gca.massresort.com/tour'
}

const locationMapping: { [key: string]: string } = {
    "Main Line": "22",
    "In House": "23",
    "Massanutten": "24",
};


const msalConfig = {
    auth: {
        clientId: azureClientId,
        authority: `https://login.microsoftonline.com/${azureDirectoryId}`,
        redirectUri: redirectURI,
        postLogoutRedirectUri: 'https://gca.massresort.com'
    },
    cache: {
        cacheLocation: 'sessionStorage',
        storeAuthStateInCookie: false,
    },
};

const publicClientApplication = new PublicClientApplication(msalConfig);

function trimTourFromURL(url) {
    // Check if the URL ends with '/tour' and remove it
    return url.endsWith('/tour') ? url.slice(0, -4) : url;
}

let logoutURI = trimTourFromURL(redirectURI) || '';

// Inactivity timeout (15 minutes)
const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes in milliseconds

// Timer ID
let inactivityTimer: NodeJS.Timeout;

// Function to handle user inactivity
const handleInactivity = async () => {
    await logoutUser();
    window.location.href = logoutURI;
};

// Function to reset inactivity timer
const resetInactivityTimer = () => {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(handleInactivity, INACTIVITY_TIMEOUT);
};

// Attach activity listeners to reset the timer
const addActivityListeners = () => {
    // window.addEventListener('mousemove', resetInactivityTimer);
    window.addEventListener('keydown', resetInactivityTimer);
    window.addEventListener('click', resetInactivityTimer);
};

addActivityListeners();
resetInactivityTimer();

const initializeMSAL = async () => {
    try {
        await publicClientApplication.initialize();
        console.log("MSAL initialized");

        sessionStorage.clear();
    } catch (error) {
        console.error("MSAL initialization failed:", error);
    }
};

initializeMSAL();

export async function loginUser(selectedAccount?: AccountInfo): Promise<AccountInfo | null> {
    try {
        if (publicClientApplication.getAllAccounts().length === 0 && BrowserUtils.isInIframe()) {
            console.warn("Interaction in progress, aborting new login request.");
            return null;
        }

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

        const mappedLocation = locationMapping[userData.Location]
        localStorage.setItem('location', mappedLocation)
        localStorage.setItem('username', userData.UserName)

        if (userGroups.includes('48175477-2fb0-493b-9089-d5677dd5e1d5')) {
            localStorage.setItem('role', 'admin')
        }
        if (userGroups.includes('ef1ca496-ddc6-431f-bb0d-b7ac3410acaf')) {
            localStorage.setItem('role', 'user')
        }


        // If user is allowed, save their access token and return their account info

        //   let  userName = userEmail.split('@')[0]

        // localStorage.setItem('username', userName || "");
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

// Function to handle logout
export async function logoutUser() {
    try {
        const accounts = publicClientApplication.getAllAccounts();
        console.log(accounts)

        if (accounts.length > 0) {

            await publicClientApplication.logoutRedirect({
                idTokenHint: accounts[0].idToken,
                postLogoutRedirectUri: logoutURI,
            });
            sessionStorage.clear();
            localStorage.clear();

        } else {
            console.warn("No accounts available to log out.");
        }
    } catch (error) {
        if (error instanceof BrowserAuthError && error.errorCode === 'interaction_in_progress') {
            console.error('An interaction is already in progress:', error);
        } else {
            console.error('Logout failed:', error);
        }
    }
}

import Axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL || '';
const get = 'get';
const post = 'post';
const put = 'put';

const apiRequest = async (
    method: string,
    url: string,
    callingFunctionName = '',
    data = {},
    headers = {}
) => {
    try {
        const response = await Axios({
            method,
            url,
            data,
            headers
        });
        //devLog(callingFunctionName, response.data);
        return response.data;
    } catch (err) {
        //devLog(`${callingFunctionName} Error: `, err);
        console.log(JSON.stringify(err))
        throw err;
    }
};

// Function to search by SPINumber
export const getUserList = async () => {
    try {
        const url = `${API_URL}/getUserList`;
        const response = await apiRequest(
            get,
            url,
            'getUserList'
        );
        return response;
    } catch (error) {
        console.error('Error fetching data', error);
        throw error;
    }
};

export const getTourList = async (request: any) => {
    try {
        const url = `${API_URL}/getTourList`;
        const response = await apiRequest(
            post,
            url,
            'getTourList',
            request
        );
        return response;
    } catch (error) {
        console.error('Error fetching data', error);
        throw error;
    }
};

export const checkUser = async (email: string) => {
    try {
        const url = `${API_URL}/check-user`;
        const request = { email };
        const response = await apiRequest(
            post,
            url,
            'checkUser',
            request
        );
        return response;
    } catch (error) {
        console.error('Error checking user data', error);
        throw error;
    }
};

export const getFundingList = async (request: any) => {
    try {
        console.log(request)
        request = {
            userName: request.username,
            date: request.date
        }
        const url = `${API_URL}/getFundingList`;
        const response = await apiRequest(
            post,
            url,
            'getFundingList',
            request
        );
        return response;
    } catch (error) {
        console.error('Error checking user data', error);
        throw error;
    }
};

export const fundCard = async (data: any) => {
    try {
        const request = {
            nbATTMID: data.attmid,
            nbTransferAmount: data.amount
        }
        const url = `${API_URL}/fundCard`;
        const response = await apiRequest(
            post,
            url,
            'fundCard',
            request
        );
        return response;
    } catch (error) {
        console.error('Error fetching data', error);
        throw error;
    }
};

export const logFundTransactions = async (data: any) => {
    try {
        const request = {
            data
        }
        const url = `${API_URL}/logFundTransactions`;
        const response = await apiRequest(
            post,
            url,
            'logFundTransactions',
            request
        );
        return response;
    } catch (error) {
        console.error('Error fetching data', error);
        throw error;
    }
};

export const logVoidTransactions = async (data: any) => {
    try {
        const request = {
            data
        }
        console.log("VOID DATA",data)
        const url = `${API_URL}/logVoidTransactions`;
        const response = await apiRequest(
            post,
            url,
            'logVoidTransactions',
            request
        );
        return response;
    } catch (error) {
        console.error('Error fetching data', error);
        throw error;
    }
};

export const voidCard = async (data: any) => {
    try {
        const request = {
            nbCHCardID: data.cardId,
            nbTransferAmount: data.voidAmount
        }
        const url = `${API_URL}/voidCard`;
        const response = await apiRequest(
            post,
            url,
            'voidCard',
            request
        );
        return response;
    } catch (error) {
        console.error('Error fetching data', error);
        throw error;
    }
};

export const updateLocation = async (locationData: any) => {
    try {
        console.log(locationData)
        const url = `${API_URL}/updateLocation`;
        const response = await apiRequest(
            post,
            url,
            'updateLocation',
            locationData
        );
        return response;
    } catch (error) {
        console.error('Error updating location', error);
        throw error;
    }
};

export const getTransactionList = async (gc: any) => {
    try {
        const url = `${API_URL}/getTransactions`;
        const response = await apiRequest(
            post,
            url,
            'getTransactionList',
            gc
        );
        return response;
    } catch (error) {
        console.error('Error pulling transactions', error);
        throw error;
    }
};

export const addUser = async (userData: any) => {
    try {
        const url = `${API_URL}/addUser`;
        const response = await apiRequest(
            post,
            url,
            'addUser',
            userData
        );
        return response;
    } catch (error) {
        console.error('Error adding user', error);
        throw error;
    }
};

export const getFundedAmount = async (gc: any) => {
    try {
        const url = `${API_URL}/getFundedAmount`;
        const response = await apiRequest(
            post,
            url,
            'getFundedAmount',
            gc
        );
        return response;
    } catch (error) {
        console.error('Error pulling Funded Amount', error);
        throw error;
    }
};
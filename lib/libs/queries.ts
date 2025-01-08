import Cookies from 'js-cookie';


const jwtToken = Cookies.get('accessToken');
const refreshToken = Cookies.get('refreshToken');

const APP_BASE_URL = "http://localhost:8080";


const isValidJwtFormat = (token: string): boolean => {
  const parts = token.split('.');
  return parts.length === 3;
};

const isTokenExpired = async (token: string): Promise<boolean> => {
  try {
  if (!token || !isValidJwtFormat(token)) {
    console.error("Invalid JWT token format:", token);
    return true; // Treat as expired if invalid format
  }else{

    const decoded = await fetch(`${APP_BASE_URL}/api/users/verify-token?token=${token}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const res = decoded.json();
    return res;
  }
  } catch (error) {
    console.error("Error decoding token:", error);
  }

  return true; // Treat as expired if decoding fails
};


// Refresh token function
const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const response = await fetch(`${APP_BASE_URL}/api/users/refresh-token?refreshToken=${refreshToken}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      const data = await response.json();
      Cookies.set('accessToken', data.accessToken); // Update the new access token in cookies
      return data.accessToken;
    } else {
      console.error("Failed to refresh access token:", await response.text());
    }
  } catch (error) {
    console.error("Error refreshing access token:", error);
  }
  return null;
};

 export const getApplicationByUUId = async (applicationId: string | undefined) => {
    let token: string | null | undefined = jwtToken;
  
    if (typeof token === 'string' && await isTokenExpired(token)) {
      token = await refreshAccessToken();
      if (!token) {
        console.error('Unable to refresh token. User may need to log in again.');
        return null;
      }
    }
  
    try {
      const response = await fetch(`${APP_BASE_URL}/api/applications/get/${applicationId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching application by UUID:', error);
      return null;
    }
  };
  

 export const getCustomFields = async (id: any) => {
    let token: string | null | undefined = jwtToken;
  
    if (typeof token === 'string' && await isTokenExpired(token)) {
      token = await refreshAccessToken();
      if (!token) {
        console.error('Unable to refresh token. User may need to log in again.');
        return null;
      }
    }
  
    try {
      const response = await fetch(`${APP_BASE_URL}/api/custom-fields?userId=${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching custom fields:', error);
      return null;
    }
  };

 export const getFields = async () => {
    let token: string | null | undefined = jwtToken;

    if (typeof token === 'string' && await isTokenExpired(token)) {
      token = await refreshAccessToken();
      if (!token) {
        console.error('Unable to refresh token. User may need to log in again.');
        return null;
      }
    }

    try {
      const response = await fetch(`${APP_BASE_URL}/api/fields`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching fields:', error);
      return null;
    }
  };

   export const getOAuths = async () => {
    let token: string | null | undefined = jwtToken;

    if (typeof token === 'string' && await isTokenExpired(token)) {
      token = await refreshAccessToken();
      if (!token) {
        console.error('Unable to refresh token. User may need to log in again.');
        return null;
      }
    }

    try {
      const response = await fetch(`${APP_BASE_URL}/api/oauth-login`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching OAuth details:', error);
      return null;
    }
  };
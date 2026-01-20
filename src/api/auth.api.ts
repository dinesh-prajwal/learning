// For React Native Android/iOS:
// - Use your computer's IP address instead of localhost
// - Example: 'http://192.168.1.100:3000/api'
// - Find your IP: macOS/Linux: `ifconfig` or `ip addr`, Windows: `ipconfig`
// - Make sure your device/emulator is on the same network
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api' // Change to your computer's IP for physical devices
  : 'https://your-production-api.com/api'; // Production backend URL

export interface GoogleLoginResponse {
  success: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
    picture?: string;
  };
  token?: string;
  message?: string;
}

export interface UsernamePasswordLoginResponse {
  success: boolean;
  user?: {
    id: string;
    username: string;
    email?: string;
    name?: string;
  };
  token?: string;
  message?: string;
}

export const usernamePasswordLogin = async (
  username: string,
  password: string
): Promise<UsernamePasswordLoginResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Username/Password login API error:', error);
    throw error;
  }
};

export const googleLogin = async (idToken: string): Promise<GoogleLoginResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Google login API error:', error);
    throw error;
  }
};

import axiosInstance from '../utils/axiosInstance';

export async function signup(firstName: string, lastName: string, email: string, password: string) {
  try {
    const response = await axiosInstance.post('/api/signup/', {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
    });
    return response.data;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
}

export const login = async (username: string, password: string) => {
  const response = await axiosInstance.post('/api/auth/login/', { username, password });
  if (response.data.access && response.data.refresh) {
    const user = {
      token: response.data.access,
      refreshToken: response.data.refresh,
    };
    localStorage.setItem('user', JSON.stringify(user));
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  //console.log(JSON.parse(localStorage.getItem('user')));
  return JSON.parse(localStorage.getItem('user') || '{}');
};
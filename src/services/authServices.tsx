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

export async function login(email: string, password: string) {
  try {
    await axiosInstance.post('/api/token/', { email, password });
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function logout() {
  try {
    await axiosInstance.post('/api/logout/');
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}
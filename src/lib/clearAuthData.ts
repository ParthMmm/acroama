import Cookies from 'js-cookie';

const clearAuthData = () => {
  Cookies.remove('accessToken');
  Cookies.remove('refreshToken');
  localStorage.removeItem('acroama.store');
};

export default clearAuthData;

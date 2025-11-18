export const isAuthenticated = (): boolean => {
  try {
    // Check both storages for cross-browser compatibility
    let userStr = null;
    
    // Try sessionStorage first
    try {
      userStr = sessionStorage.getItem('partyoria_user');
    } catch (e) {
      console.warn('SessionStorage not available:', e);
    }
    
    // Fallback to localStorage
    if (!userStr) {
      try {
        userStr = localStorage.getItem('partyoria_user');
      } catch (e) {
        console.warn('LocalStorage not available:', e);
      }
    }
    
    if (userStr) {
      const userData = JSON.parse(userStr);
      return !!(userData && (userData.id || userData.username));
    }
    
    return false;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

export const getUserData = () => {
  try {
    // Check both storages for cross-browser compatibility
    let userStr = null;
    
    // Try sessionStorage first
    try {
      userStr = sessionStorage.getItem('partyoria_user');
    } catch (e) {
      console.warn('SessionStorage not available:', e);
    }
    
    // Fallback to localStorage
    if (!userStr) {
      try {
        userStr = localStorage.getItem('partyoria_user');
      } catch (e) {
        console.warn('LocalStorage not available:', e);
      }
    }
    
    if (userStr) {
      return JSON.parse(userStr);
    }
  } catch (error) {
    console.error('Error parsing user data:', error);
  }
  return null;
};

export const clearAuthData = () => {
  try {
    sessionStorage.removeItem('partyoria_user');
    localStorage.removeItem('partyoria_user');
  } catch (error) {
    console.warn('Error clearing auth data:', error);
  }
};

export const setAuthData = (userData: any) => {
  try {
    const userDataStr = JSON.stringify(userData);
    
    // Store in both for maximum compatibility
    try {
      sessionStorage.setItem('partyoria_user', userDataStr);
    } catch (e) {
      console.warn('SessionStorage not available:', e);
    }
    
    try {
      localStorage.setItem('partyoria_user', userDataStr);
    } catch (e) {
      console.warn('LocalStorage not available:', e);
    }
  } catch (error) {
    console.error('Error setting auth data:', error);
  }
};
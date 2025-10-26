interface ErrorDetails {
  message: string;
  stack?: string;
  component?: string;
  timestamp: string;
  url: string;
  userAgent: string;
  props?: any;
  state?: any;
}

class ErrorLogger {
  private static instance: ErrorLogger;
  private errors: ErrorDetails[] = [];

  static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }

  private constructor() {
    this.setupGlobalErrorHandlers();
  }

  private setupGlobalErrorHandlers() {
    // Catch unhandled JavaScript errors
    window.addEventListener('error', (event) => {
      this.logError({
        message: event.message,
        stack: event.error?.stack,
        component: 'Global',
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      });
    });

    // Catch unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.logError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        component: 'Promise',
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      });
    });

    // Override console.error to capture React errors
    const originalError = console.error;
    console.error = (...args) => {
      if (args[0]?.includes?.('React') || args[0]?.includes?.('Warning')) {
        this.logError({
          message: args.join(' '),
          component: 'React',
          timestamp: new Date().toISOString(),
          url: window.location.href,
          userAgent: navigator.userAgent,
        });
      }
      originalError.apply(console, args);
    };
  }

  logError(error: Partial<ErrorDetails>) {
    const errorDetails: ErrorDetails = {
      message: error.message || 'Unknown error',
      stack: error.stack,
      component: error.component || 'Unknown',
      timestamp: error.timestamp || new Date().toISOString(),
      url: error.url || window.location.href,
      userAgent: error.userAgent || navigator.userAgent,
      props: error.props,
      state: error.state,
    };

    this.errors.push(errorDetails);
    this.displayError(errorDetails);
  }

  private displayError(error: ErrorDetails) {
    console.group(`🚨 ERROR in ${error.component} - ${error.timestamp}`);
    console.error('Message:', error.message);
    console.error('URL:', error.url);
    console.error('User Agent:', error.userAgent);
    
    if (error.stack) {
      console.error('Stack Trace:', error.stack);
    }
    
    if (error.props) {
      console.error('Component Props:', error.props);
    }
    
    if (error.state) {
      console.error('Component State:', error.state);
    }

    console.error('Full Error Object:', error);
    console.groupEnd();

    // Also display in a more visible way
    this.showVisualError(error);
  }

  private showVisualError(error: ErrorDetails) {
    // Create a visual error display
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: #ff4444;
      color: white;
      padding: 15px;
      border-radius: 5px;
      max-width: 400px;
      z-index: 10000;
      font-family: monospace;
      font-size: 12px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    `;
    
    errorDiv.innerHTML = `
      <strong>Error in ${error.component}</strong><br>
      <div style="margin: 5px 0;">${error.message}</div>
      <div style="font-size: 10px; opacity: 0.8;">${error.timestamp}</div>
      <button onclick="this.parentElement.remove()" style="
        position: absolute;
        top: 5px;
        right: 5px;
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 16px;
      ">×</button>
    `;

    document.body.appendChild(errorDiv);

    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (errorDiv.parentElement) {
        errorDiv.remove();
      }
    }, 10000);
  }

  getAllErrors(): ErrorDetails[] {
    return [...this.errors];
  }

  clearErrors() {
    this.errors = [];
    console.clear();
  }

  // Method to log component-specific errors
  logComponentError(componentName: string, error: Error, props?: any, state?: any) {
    this.logError({
      message: error.message,
      stack: error.stack,
      component: componentName,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      props,
      state,
    });
  }

  // Method to log network errors
  logNetworkError(url: string, status: number, statusText: string, response?: any) {
    this.logError({
      message: `Network Error: ${status} ${statusText} - ${url}`,
      component: 'Network',
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      props: { requestUrl: url, status, statusText, response },
    });
  }

  // Method to display system information
  displaySystemInfo() {
    console.group('🔧 System Information');
    console.log('URL:', window.location.href);
    console.log('User Agent:', navigator.userAgent);
    console.log('Screen Resolution:', `${screen.width}x${screen.height}`);
    console.log('Viewport Size:', `${window.innerWidth}x${window.innerHeight}`);
    console.log('Local Storage Available:', typeof Storage !== 'undefined');
    console.log('Cookies Enabled:', navigator.cookieEnabled);
    console.log('Online Status:', navigator.onLine);
    console.log('Language:', navigator.language);
    console.log('Platform:', navigator.platform);
    console.log('React Version:', (window as any).React?.version || 'Not detected');
    console.groupEnd();
  }
}

// Initialize the error logger
const errorLogger = ErrorLogger.getInstance();

// Export for use in components
export default errorLogger;

// Global function for manual error logging
(window as any).logError = (message: string, component?: string) => {
  errorLogger.logError({ message, component });
};

// Global function to display system info
(window as any).showSystemInfo = () => {
  errorLogger.displaySystemInfo();
};

// Global function to clear errors
(window as any).clearErrors = () => {
  errorLogger.clearErrors();
};
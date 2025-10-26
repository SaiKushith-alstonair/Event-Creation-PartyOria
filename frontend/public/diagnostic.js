// PartyOria Diagnostic Script
// Run this in the browser console to get detailed error information

(function() {
  console.clear();
  console.log('%c🔍 PartyOria Diagnostic Script', 'font-size: 20px; color: #4CAF50; font-weight: bold;');
  console.log('='.repeat(50));

  // 1. Check if page loaded
  console.group('📄 Page Load Status');
  console.log('Document Ready State:', document.readyState);
  console.log('Page URL:', window.location.href);
  console.log('Page Title:', document.title);
  console.groupEnd();

  // 2. Check React
  console.group('⚛️ React Status');
  if (window.React) {
    console.log('✅ React is loaded, version:', window.React.version);
  } else {
    console.log('❌ React is not detected in global scope');
  }
  
  const reactRoot = document.getElementById('root');
  if (reactRoot) {
    console.log('✅ React root element found');
    console.log('Root element content length:', reactRoot.innerHTML.length);
    if (reactRoot.innerHTML.length === 0) {
      console.log('⚠️ Root element is empty - React may not have rendered');
    }
  } else {
    console.log('❌ React root element (#root) not found');
  }
  console.groupEnd();

  // 3. Check for JavaScript errors
  console.group('🚨 Error Detection');
  const errors = [];
  
  // Override console.error to catch errors
  const originalError = console.error;
  console.error = function(...args) {
    errors.push({
      type: 'console.error',
      message: args.join(' '),
      timestamp: new Date().toISOString()
    });
    originalError.apply(console, args);
  };

  // Check for existing errors in our error logger
  if (window.errorLogger) {
    const loggedErrors = window.errorLogger.getAllErrors();
    console.log('Errors from error logger:', loggedErrors.length);
    loggedErrors.forEach((error, index) => {
      console.log(`Error ${index + 1}:`, error);
    });
  } else {
    console.log('Error logger not initialized');
  }
  console.groupEnd();

  // 4. Check network requests
  console.group('🌐 Network Status');
  console.log('Online status:', navigator.onLine);
  
  // Test localhost connection
  fetch('http://localhost:3000/')
    .then(response => {
      console.log('✅ Localhost:3000 is reachable, status:', response.status);
    })
    .catch(error => {
      console.log('❌ Cannot reach localhost:3000:', error.message);
    });

  // Test backend connection
  fetch('http://localhost:8000/')
    .then(response => {
      console.log('✅ Backend (localhost:8000) is reachable, status:', response.status);
    })
    .catch(error => {
      console.log('❌ Cannot reach backend (localhost:8000):', error.message);
    });
  console.groupEnd();

  // 5. Check browser compatibility
  console.group('🌍 Browser Compatibility');
  console.log('User Agent:', navigator.userAgent);
  console.log('ES6 Support (const):', typeof const !== 'undefined');
  console.log('ES6 Support (arrow functions):', (() => true)());
  console.log('Fetch API:', typeof fetch !== 'undefined');
  console.log('Local Storage:', typeof localStorage !== 'undefined');
  console.log('Session Storage:', typeof sessionStorage !== 'undefined');
  console.groupEnd();

  // 6. Check resources
  console.group('📦 Resource Loading');
  const scripts = Array.from(document.scripts);
  const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
  
  console.log('Scripts loaded:', scripts.length);
  scripts.forEach((script, index) => {
    console.log(`Script ${index + 1}:`, script.src || 'inline');
  });
  
  console.log('Stylesheets loaded:', stylesheets.length);
  stylesheets.forEach((link, index) => {
    console.log(`Stylesheet ${index + 1}:`, link.href);
  });
  console.groupEnd();

  // 7. Performance metrics
  console.group('⚡ Performance');
  if (performance.timing) {
    const timing = performance.timing;
    console.log('Page load time:', timing.loadEventEnd - timing.navigationStart, 'ms');
    console.log('DOM ready time:', timing.domContentLoadedEventEnd - timing.navigationStart, 'ms');
  }
  console.groupEnd();

  // 8. Console commands
  console.group('🛠️ Available Commands');
  console.log('Run these commands in the console:');
  console.log('- showSystemInfo() - Display system information');
  console.log('- clearErrors() - Clear all logged errors');
  console.log('- logError("message", "component") - Log a custom error');
  console.log('- location.reload() - Reload the page');
  console.groupEnd();

  console.log('='.repeat(50));
  console.log('%c✅ Diagnostic complete! Check the groups above for details.', 'color: #4CAF50; font-weight: bold;');
})();
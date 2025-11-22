export const environment = {
    production: false,
    backendUrl: 'http://localhost:3000/',
    apiUrl: 'http://localhost:3000/api',
    apiTimeout: 30000, // 30 seconds
    retryAttempts: 3,
    retryDelay: 1000, // 1 second
    enableAnalytics: false,
    enableLogging: true,
    cacheExpiry: 300000, // 5 minutes
    featureFlags: {
        enableDarkMode: true,
        enableNotifications: true,
        enableShare: true
    }
};

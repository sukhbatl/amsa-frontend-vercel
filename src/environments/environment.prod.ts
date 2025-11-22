export const environment = {
    production: true,
    backendUrl: 'https://amsa-backend-vercel.vercel.app/',
    apiUrl: 'https://amsa-backend-vercel.vercel.app/api',
    apiTimeout: 30000, // 30 seconds
    retryAttempts: 2,
    retryDelay: 1000, // 1 second
    enableAnalytics: true,
    enableLogging: false,
    cacheExpiry: 300000, // 5 minutes
    featureFlags: {
        enableDarkMode: true,
        enableNotifications: true,
        enableShare: true
    }
};

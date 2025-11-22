module.exports = {
  apps : [{
    name: 'AMSA Backend',
    script: '/root/amsa/amsa-backend/server.js',
    autorestart: true,
    watch: false,
    max_memory_restart: '512M',
    node_args: '--max-old-space-size=450',
    env: {
		AMSA_FRONTEND_ADDRESS: "http://localhost:4200",
		AMSA_JWT_KEY: "123nfo1ihf12o34i1234o214h213kj41h43iu",
		AMSA_MYSQL_USER: "amsamn_website_admin",
		AMSA_MYSQL_PASSWORD: "AmsaIT2019db$Password",
		AMSA_MYSQL_DATABASE: "amsamn_website_db",
		AMSA_MYSQL_HOST: "164.92.104.38",
		NODE_ENV: "development",
		AMSA_NODE_ENV: "development",
		AMSA_MAILJET_API_KEY: "f624add0bd5c1a94c6e4ac2bb5adf999",
		AMSA_MAILJET_SECRET_KEY: "6609cfd9ded0b133335f0b6e9b146dcb",
		AMSA_BACKEND_PORT: "61008",
		AMSA_FRONTEND_PORT: "61009"
    },
    env_production: {
		AMSA_FRONTEND_ADDRESS: "https://amsa.mn",
		AMSA_JWT_KEY: "123nfo1ihf12o34i1234o214h213kj41h43iu",
		AMSA_MYSQL_USER: "amsamn_website_admin",
		AMSA_MYSQL_PASSWORD: "AmsaIT2019db$Password",
		AMSA_MYSQL_DATABASE: "amsamn_website_db",
		AMSA_MYSQL_HOST: "164.92.104.38",
		AMSA_MAILJET_API_KEY: "f624add0bd5c1a94c6e4ac2bb5adf999",
		AMSA_MAILJET_SECRET_KEY: "6609cfd9ded0b133335f0b6e9b146dcb",
		NODE_ENV: "production",
		AMSA_NODE_ENV: "production",
		AMSA_BACKEND_PORT: "61008",
		AMSA_FRONTEND_PORT: "61009"
    }
  }, {
    name: 'AMSA Frontend',
    script: '/root/amsa/test/amsa-frontend/dist/amsa-frontend/server/server.mjs',
    cwd: '/root/amsa/test/amsa-frontend',
    autorestart: true,
    watch: false,
    max_memory_restart: '512M',
    node_args: '--max-old-space-size=450',
    env: {
		NODE_ENV: "development",
		AMSA_BACKEND_PORT: "61008",
		AMSA_FRONTEND_PORT: "61009",
	        AMSA_FRONTEND_FOLDER: ""
    },
    env_production: {
		NODE_ENV: "production",
		AMSA_NODE_ENV: "production",
		AMSA_BACKEND_PORT: "61008",
		AMSA_FRONTEND_PORT: "61009",
	        AMSA_FRONTEND_FOLDER: ""
    }
  }]
};
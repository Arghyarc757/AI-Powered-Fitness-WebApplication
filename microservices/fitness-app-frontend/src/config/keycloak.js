import Keycloak from 'keycloak-js';

// Keycloak configuration
const keycloakConfig = {
  url: 'http://localhost:8181',
  realm: 'fitness-oauth2',
  clientId: 'oauth2-pkce-client' // Using existing PKCE client - change to 'fitness-oauth2-realm' if you create it
};

// Initialize Keycloak instance
const keycloak = new Keycloak(keycloakConfig);

export default keycloak;


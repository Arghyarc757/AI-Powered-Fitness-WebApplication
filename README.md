# AI-Powered Fitness Tracker

An ongoing microservices-based fitness tracking application that leverages AI to provide personalized workout recommendations and insights.

## 📋 About This Project

This AI-Powered Fitness Tracker is a comprehensive fitness management system designed to help users track their physical activities and receive intelligent, personalized recommendations powered by Google's Gemini AI. The application allows users to log various fitness activities such as running, walking, and cycling, capturing essential metrics like duration, calories burned, and additional performance data. What sets this application apart is its intelligent backend that automatically processes each activity through an AI service, generating detailed recommendations including performance improvements, personalized suggestions, and important safety guidelines. 

The project is built using a modern microservices architecture, which provides several key advantages: **scalability** - each service can be scaled independently based on demand; **maintainability** - services are loosely coupled and can be developed, deployed, and updated independently; **resilience** - if one service fails, others continue to operate; and **technology flexibility** - different services can use different databases and technologies best suited for their specific needs (PostgreSQL for structured user data, MongoDB for flexible activity and recommendation storage). The use of message queues (RabbitMQ) enables asynchronous processing, ensuring that AI recommendations are generated in the background without blocking user interactions. Additionally, the integration with Keycloak provides enterprise-grade authentication and authorization, making the system secure and ready for production use. This architecture makes the system not only robust and performant but also demonstrates best practices in modern cloud-native application development.

## 🏗️ Architecture

This project follows a **microservices architecture** pattern with the following components:

- **Service Discovery**: Netflix Eureka Server
- **API Gateway**: Spring Cloud Gateway (with OAuth2/OIDC authentication)
- **Configuration Server**: Spring Cloud Config Server
- **Backend Services**: 
  - User Service (PostgreSQL)
  - Activity Service (MongoDB)
  - AI Service (MongoDB)
- **Frontend**: React + Vite
- **Message Queue**: RabbitMQ (Docker)
- **Authentication**: Keycloak (Docker)

## 📦 Services Overview

### 1. **Eureka Server** (Port: 8761)
- Service discovery and registration server
- All microservices register themselves with Eureka
- Located at: `microservices/eureka`

### 2. **Config Server** (Port: 8888)
- Centralized configuration management
- Stores service-specific configurations
- Located at: `microservices/configserver`
- Configuration files:
  - `activity-service.yml`
  - `ai-service.yml`
  - `api-gateway.yml`
  - `user-service.yml`

### 3. **API Gateway** (Port: 8080)
- Single entry point for all client requests
- OAuth2 Resource Server with JWT validation (Keycloak integration)
- Routes requests to appropriate microservices:
  - `/api/users/**` → User Service
  - `/api/activities/**` → Activity Service
  - `/api/recommendations/**` → AI Service
- Features:
  - Keycloak user synchronization
  - CORS configuration
  - JWT token validation
- Located at: `microservices/gateway`

### 4. **User Service** (Port: 8081)
- Manages user registration and profiles
- **Database**: PostgreSQL (`fitness_user_db`)
- **Endpoints**:
  - `GET /api/users/{userId}` - Get user profile
  - `POST /api/users/register` - Register new user
  - `GET /api/users/{userId}/validate` - Validate user existence
- **Key Features**:
  - Integration with Keycloak (stores `keyCloakId`)
  - User role management (USER role by default)
- Located at: `microservices/userservice`

### 5. **Activity Service** (Port: 8082)
- Tracks fitness activities (running, walking, cycling)
- **Database**: MongoDB (`fitnessactivity`)
- **Endpoints**:
  - `POST /api/activities` - Track new activity
  - `GET /api/activities` - Get user activities (requires `X-User-ID` header)
  - `GET /api/activities/{activityId}` - Get activity details
- **Key Features**:
  - Validates user existence via User Service
  - Publishes activities to RabbitMQ for AI processing
  - Stores activity metrics (duration, calories, type, etc.)
- Located at: `microservices/activityservice`

### 6. **AI Service** (Port: 8083)
- Generates AI-powered fitness recommendations
- **Database**: MongoDB (`fitnessrecommendation`)
- **AI Provider**: Google Gemini API
- **Endpoints**:
  - `GET /api/recommendations/user/{userId}` - Get user recommendations
  - `GET /api/recommendations/activity/{activityId}` - Get activity-specific recommendation
- **Key Features**:
  - Listens to RabbitMQ for new activities
  - Generates recommendations using Gemini AI
  - Provides improvements, suggestions, and safety guidelines
- Located at: `microservices/aiservice`

### 7. **Frontend** (Port: 5173)
- React application with Material-UI
- **Features**:
  - OAuth2 PKCE authentication with Keycloak
  - Activity tracking form
  - Activity list view
  - Activity detail view with AI recommendations
  - Redux for state management
- Located at: `microservices/frontend`

## 🛠️ Technology Stack

### Backend
- **Java**: Version 25 (some services), Version 21 (Gateway)
- **Spring Boot**: 3.4.3 - 4.0.1
- **Spring Cloud**: 2024.0.1 - 2025.1.0
- **Spring Cloud Gateway**: API Gateway
- **Spring Cloud Config**: Configuration management
- **Netflix Eureka**: Service discovery
- **Spring Data JPA**: PostgreSQL persistence
- **Spring Data MongoDB**: MongoDB persistence
- **Spring AMQP**: RabbitMQ integration
- **Spring Security OAuth2**: JWT validation
- **Lombok**: Code generation
- **WebFlux**: Reactive programming

### Frontend
- **React**: 19.0.0
- **Vite**: 6.2.0
- **Material-UI**: 7.3.6
- **Redux Toolkit**: 2.11.2
- **React Router**: 7.11.0
- **Axios**: 1.13.2
- **react-oauth2-code-pkce**: OAuth2 authentication

### Infrastructure
- **Keycloak**: Authentication & Authorization (Docker)
- **RabbitMQ**: Message queue (Docker)
- **PostgreSQL**: User data storage
- **MongoDB**: Activity and recommendation storage

## 🚀 Setup Instructions

### Prerequisites
- Java 21+ (or Java 25 for most services)
- Maven 3.6+
- Node.js 18+ and npm
- Docker and Docker Compose
- PostgreSQL
- MongoDB

### Infrastructure Setup

1. **Start Keycloak** (Docker):
   ```bash
   docker run -p 8181:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:latest start-dev
   ```
   - Configure realm: `fitness-oauth2`
   - Create client: `oauth2-pkce-client`
   - Set redirect URI: `http://localhost:5173`

2. **Start RabbitMQ** (Docker):
   ```bash
   docker run -d --hostname my-rabbit --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
   ```
   - Default credentials: `guest/guest`
   - Management UI: `http://localhost:15672`

3. **Start PostgreSQL**:
   - Create database: `fitness_user_db`
   - Default connection: `localhost:5432`
   - Username: `postgres`, Password: `12345`

4. **Start MongoDB**:
   - Create databases: `fitnessactivity` and `fitnessrecommendation`
   - Default connection: `localhost:27017`

### Backend Services Setup

1. **Start services in order**:
   ```bash
   # 1. Eureka Server
   cd microservices/eureka
   mvn spring-boot:run

   # 2. Config Server
   cd microservices/configserver
   mvn spring-boot:run

   # 3. User Service
   cd microservices/userservice
   mvn spring-boot:run

   # 4. Activity Service
   cd microservices/activityservice
   mvn spring-boot:run

   # 5. AI Service
   cd microservices/aiservice
   mvn spring-boot:run
   # Note: Set GEMINI_API_KEY environment variable (see geminiapi.env)

   # 6. API Gateway
   cd microservices/gateway
   mvn spring-boot:run
   ```

2. **AI Service Configuration**:
   - Copy `microservices/aiservice/geminiapi.env` and set environment variables:
     - `GEMINI_API_URL`: Gemini API endpoint
     - `GEMINI_API_KEY`: Your Gemini API key

### Frontend Setup

```bash
cd microservices/frontend
npm install
npm run dev
```

Frontend will be available at `http://localhost:5173`

## 📡 API Endpoints

All endpoints are accessed through the API Gateway at `http://localhost:8080`

### User Service
- `GET /api/users/{userId}` - Get user profile
- `POST /api/users/register` - Register user
- `GET /api/users/{userId}/validate` - Validate user

### Activity Service
- `POST /api/activities` - Create activity
  ```json
  {
    "userId": "string",
    "type": "RUNNING|WALKING|CYCLING",
    "duration": 30,
    "caloriesBurned": 250,
    "startTime": "2024-01-01T10:00:00",
    "additionalMetrics": {}
  }
  ```
- `GET /api/activities` - Get user activities (requires `X-User-ID` header)
- `GET /api/activities/{activityId}` - Get activity details

### AI Service
- `GET /api/recommendations/user/{userId}` - Get user recommendations
- `GET /api/recommendations/activity/{activityId}` - Get activity recommendation

## 🔐 Authentication Flow

1. User logs in via frontend using OAuth2 PKCE
2. Keycloak issues JWT token
3. Frontend stores token and includes in `Authorization: Bearer <token>` header
4. API Gateway validates JWT with Keycloak
5. Gateway extracts user info and syncs with User Service
6. Gateway adds `X-User-ID` header to downstream requests

## 🔄 Message Flow

1. User creates activity via Activity Service
2. Activity Service validates user via User Service
3. Activity is saved to MongoDB
4. Activity is published to RabbitMQ exchange (`fitness.exchange`)
5. AI Service consumes message from queue (`activity.queue`)
6. AI Service generates recommendation using Gemini API
7. Recommendation is saved to MongoDB
8. User can view recommendation via API

## 📁 Project Structure

```
AIPoweredFitness/
├── microservices/
│   ├── eureka/              # Service Discovery
│   ├── configserver/        # Configuration Server
│   ├── gateway/             # API Gateway
│   ├── userservice/         # User Management
│   ├── activityservice/     # Activity Tracking
│   ├── aiservice/           # AI Recommendations
│   └── frontend/            # React Frontend
```

## ⚠️ Important Notes

- **This is an ongoing project and not the final version**
- Some services use Java 25 (experimental), Gateway uses Java 21
- Keycloak and RabbitMQ are run via Docker
- Database credentials are in config files (change for production)
- Gemini API key is exposed in `geminiapi.env` (use environment variables in production)

## 🔍 What Needs Clarification

1. **Docker Compose**: No `docker-compose.yml` file found. Are Keycloak and RabbitMQ started manually or is there a compose file elsewhere?

2. **Keycloak Configuration**: 
   - Exact realm configuration details
   - Client configuration specifics
   - User roles and permissions setup

3. **Database Setup**:
   - Are databases created automatically or manually?
   - Any initialization scripts?

4. **Environment Variables**:
   - How are environment variables managed across services?
   - Production configuration strategy?

5. **Service Ports**: All services use fixed ports - any load balancing or scaling strategy?

6. **Error Handling**: Error handling and logging strategy across services

7. **Testing**: Test coverage and testing strategy

8. **Deployment**: Deployment strategy and CI/CD pipeline (if any)

## 🐛 Known Issues / TODO

- Frontend `ActivityDetail.jsx` has a bug: uses `activity.improvements` instead of `improvement` in map function (line 52)
- Missing error boundaries in frontend
- No health check endpoints documented
- API Gateway security config has commented actuator endpoint

## 📝 License

[Add your license here]

## 👥 Contributors

[Add contributors here]


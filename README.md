# Services Repository Analysis

`services/` is a Maven parent (`Eca-Project-Services`) that groups the business microservices.

## Modules

- `customer-service`
  - Artifact: `Customer-Service`
  - Stack: Spring Web MVC, JPA, Validation, MapStruct, Eureka Client, Config Client
  - Runtime DB driver: PostgreSQL
  - Main API base: `/api/v1/customers`

- `product-service`
  - Artifact: `Product-Service`
  - Stack: Spring Web MVC, MongoDB, Validation, MapStruct, Eureka Client, Config Client
  - Main API base: `/api/v1/products`

- `order-service`
  - Artifact: `Order-Service`
  - Stack: Spring Web MVC, JPA, Validation, RestClient, Eureka Client, Config Client
  - Runtime DB driver: MySQL
  - Main API base: `/api/v1/orders`
  - Calls `CUSTOMER-SERVICE` and `PRODUCT-SERVICE` using load-balanced `RestClient`

## Technology baseline

- Java `25`
- Spring Boot `4.0.3`
- Spring Cloud `2025.1.0`

## Configuration behavior

All three services load configuration through Config Server:

- `spring.config.import: "configserver:"`
- `spring.cloud.config.uri: http://config.platform:9000`

That means ports, database credentials, and environment-specific values are expected to come from central config.

## API snapshot

### Customer Service (`/api/v1/customers`)

- `POST /` (multipart form data)
- `PUT /{nic}` (multipart form data)
- `DELETE /{nic}`
- `GET /{nic}`
- `GET /`
- `GET /{nic}/picture`

### Product Service (`/api/v1/products`)

- `POST /` (JSON)
- `GET /{productId}`
- `GET /`
- `PUT /{productId}` (JSON)
- `DELETE /{productId}`

### Order Service (`/api/v1/orders`)

- `POST /` (JSON)
- `GET /{id}`
- `GET /`
- `GET /?productId=...`
- `PUT /{id}` (JSON)
- `DELETE /{id}`

## Build and test

```bash
mvn -f services/pom.xml clean package
mvn -f services/pom.xml test
```

## Run options

### Option 1: Run each service directly

```bash
mvn -f services/customer-service/pom.xml spring-boot:run
mvn -f services/product-service/pom.xml spring-boot:run
mvn -f services/order-service/pom.xml spring-boot:run
```

### Option 2: Run packaged jars with PM2

`services/ecosystem.config.js` defines:

- `cloud-sql-auth-proxy`
- `customer-service` (2 instances)
- `product-service` (2 instances)
- `order-service` (2 instances)

Example:

```bash
pm2 start services/ecosystem.config.js
```

## Notes and risks

- Service startup requires platform services (`config-server`, `service-registry`) to be reachable first.
- `cloud-sql-auth-proxy` command is environment-specific and requires that binary/path to exist.


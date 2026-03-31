module.exports = {
  apps: [
    {
      name: "cloud-sql-auth-proxy",
      script: "./cloud-sql-proxy eca-project-491914:asia-southeast1:mysql-vm eca-project-491914:asia-southeast1:postgres-vm --private-ip",
      log_file: "./logs/cloud-sql-auth-proxy.log",
    },
    {
      name: "customer-service",
      script: "java -jar ./customer-service/target/Customer-Service-1.0.0.jar",
      log_file: "./logs/customer-service.log",
      instances:2
    },
    {
      name: "product-service",
      script: "java -jar ./product-service/target/Product-Service-1.0.0.jar",
      log_file: "./logs/product-service.log",
      instances:2
    },
    {
      name: "order-service",
      script: "java -jar ./order-service/target/Order-Service-1.0.0.jar",
      log_file: "./logs/order-service.log",
      instances:2
    }
  ]
}
# Build stage for Java application
FROM maven:3.8.6-amazoncorretto-17 as build
WORKDIR /build
COPY pom.xml /build/
RUN mvn dependency:go-offline
COPY src /build/src/
RUN mvn package -DskipTests

# Run stage for Java application
FROM openjdk:22-jdk as app
WORKDIR /opt/wolfram-absolute
COPY --from=build /build/target/WolframAbsolute-0.0.1-SNAPSHOT.jar /opt/wolfram-absolute/WolframAbsolute-0.0.1-SNAPSHOT.jar

# Install MySQL
FROM mysql:latest as mysql
ENV MYSQL_DATABASE=wolframabsolute
ENV MYSQL_ROOT_USERNAME=root
ENV MYSQL_ROOT_PASSWORD=12345678
COPY ./init.sql /docker-entrypoint-initdb.d/

# Combine stage
FROM app
COPY --from=mysql /var/lib/mysql /var/lib/mysql
EXPOSE 8080 3306
ENV SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/wolframabsolute
ENV SPRING_DATASOURCE_USERNAME=root
ENV SPRING_DATASOURCE_PASSWORD=12345678
ENTRYPOINT ["java", "-jar", "WolframAbsolute-0.0.1-SNAPSHOT.jar"]
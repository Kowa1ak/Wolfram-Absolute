# Build stage
FROM maven:3.8.6-amazoncorretto-17 as build
WORKDIR /build/
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src/ src/
RUN mvn package -DskipTests

# Run stage
FROM openjdk:17-alpine
ARG JAR_FILE=/build/target/*.jar
COPY --from=build ${JAR_FILE} /opt/wolfram-absolute/wolfram.jar
ENTRYPOINT ["java", "-jar", "/opt/wolfram-absolute/wolfram.jar"]

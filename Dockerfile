FROM maven:3.8.6-amazoncorretto-17 as build
COPY pom.xml /build/
RUN mvn dependency:go-offline
COPY src /build/src/
RUN mvn package -DskipTests

#Run stage
FROM openjdk:17-alpine
ARG JAR_FILE=/build/target/*.jar
COPY --from=build $JAR_FILE /opt/wolfram-absolute/wolfram.jar
ENTRYPOINT ["java", "-jar", "/opt/wolfram-absolute/wolfram.jar"]
FROM maven:3.8.6-amazoncorretto-17 as build
WORKDIR /build/
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src/ src/
RUN mvn package -DskipTests



FROM openjdk:22-jdk

COPY target/WolframAbsolute-0.0.1-SNAPSHOT.jar .

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "WolframAbsolute-0.0.1-SNAPSHOT.jar"]
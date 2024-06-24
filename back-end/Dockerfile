# Стадия сборки
FROM maven:3.8.6-amazoncorretto-17 AS build
WORKDIR /build
COPY pom.xml /build/
RUN mvn dependency:go-offline
COPY src /build/src/
RUN mvn package -DskipTests

# Стадия запуска
FROM openjdk:22-jdk
WORKDIR /opt/wolfram-absolute
COPY --from=build /build/target/WolframAbsolute-0.0.1-SNAPSHOT.jar /opt/wolfram-absolute/WolframAbsolute-0.0.1-SNAPSHOT.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "WolframAbsolute-0.0.1-SNAPSHOT.jar"]

FROM openjdk:22-jdk

COPY target/WolframAbsolute-0.0.1-SNAPSHOT.jar .

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "WolframAbsolute-0.0.1-SNAPSHOT.jar"]
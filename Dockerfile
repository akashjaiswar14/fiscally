# --- Stage 1: Build the Application ---
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copy the project files
COPY . .

# Build the application (skipping tests to avoid environment errors)
RUN mvn clean package -DskipTests

# --- Stage 2: Run the Application ---
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy the JAR file from the build stage to the run stage
# We use a wildcard (*) to match the jar name automatically
COPY --from=build /app/target/*.jar app.jar

# Expose port 8080 (Render's default)
EXPOSE 8080

# Command to run the app
ENTRYPOINT ["java", "-jar", "app.jar"]
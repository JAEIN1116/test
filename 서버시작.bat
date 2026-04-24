@echo off
echo ==========================================
echo   Gemini AI Chatbot Server Starting...
echo ==========================================
set JAVA_HOME=C:\Program Files\Java\jdk-17
set PATH=%JAVA_HOME%\bin;%PATH%

cd /d %~dp0

echo [1/2] Checking build...
call gradlew.bat bootJar

echo [2/2] Starting server on http://localhost:18080
echo (Using local application.properties for configuration)
java -jar build\libs\test-1.0.jar

pause

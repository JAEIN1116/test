@echo off
echo ==========================================
echo   Gemini AI Chatbot Server Starting...
echo ==========================================
set JAVA_HOME=C:\Program Files\Java\jdk-17
set PATH=%JAVA_HOME%\bin;%PATH%

:: 로컬 실행용 API Key 설정 (보안을 위해 여기에 직접 적어둡니다.)
set GEMINI_API_KEY=AIzaSyAixG-Wn8mQzIq5Ub03sjn0NwpwdCk2x8Q
set GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent

cd /d %~dp0

echo [1/2] Checking build...
call gradlew.bat bootJar

echo [2/2] Starting server on http://localhost:18080
java -DGEMINI_API_KEY=%GEMINI_API_KEY% -DGEMINI_API_URL=%GEMINI_API_URL% -jar build\libs\test-1.0.jar

pause

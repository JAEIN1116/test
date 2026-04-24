<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
    <% String serverStatus="Tomcat Server is Running!" ; java.text.SimpleDateFormat sdf=new
        java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss"); String currentTime=sdf.format(new java.util.Date()); %>
        <!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Tomcat Dynamic Page</title>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap"
                rel="stylesheet">
            <link rel="stylesheet" href="style.css">
        </head>

        <body>
            <div class="background-elements">
                <div class="blob blob-1"></div>
                <div class="blob blob-2"></div>
            </div>

            <div class="container">
                <div class="glass-card">
                    <h1>😎 내가 직접 성공한 자동 배포!!</h1>
                    <p>This page is now powered by Java and Tomcat.</p>

                    <div style="margin: 20px 0; padding: 15px; background: rgba(0,0,0,0.1); border-radius: 8px;">
                        <strong>Server Status:</strong> <span style="color: #4ade80;">
                            <%= serverStatus %>
                        </span><br>
                        <strong>Server Time:</strong>
                        <%= currentTime %>
                    </div>

                    <p id="api-result" style="font-size: 0.9em; color: #facc15; margin-bottom: 15px;"></p>

                    <button id="action-btn" class="glow-btn">Call Tomcat API</button>
                </div>
            </div>

            <script src="script.js"></script>
        </body>

        </html>
<%@ page language="java" contentType="application/json; charset=UTF-8" pageEncoding="UTF-8"%>
<%
    // 간단한 백엔드 API 시뮬레이션
    // 브라우저에서 직접 이 파일을 열면 이 코드가 그대로 보이지만,
    // 톰캣을 통하면 올바른 JSON 데이터를 반환합니다.
    response.setHeader("Access-Control-Allow-Origin", "*");
    
    String serverTime = new java.util.Date().toString();
    String message = "Hello from Tomcat Backend!";
%>
{
    "status": "success",
    "message": "<%= message %>",
    "serverTime": "<%= serverTime %>"
}

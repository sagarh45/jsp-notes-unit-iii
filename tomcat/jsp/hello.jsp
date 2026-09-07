<%@ page language="java" contentType="text/html; charset=UTF-8" %>
<html>
<head><title>Hello JSP</title></head>
<body>
<h2>Welcome to Java Server Pages</h2>
<%
  String name = request.getParameter("name");
  if (name == null) {
    name = "Guest";
  }
%>
<p>Hello <b><%= name %></b>!</p>
<p>Server time: <%= new java.util.Date() %></p>
</body>
</html>
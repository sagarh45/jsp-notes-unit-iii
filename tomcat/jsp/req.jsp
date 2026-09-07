<%@ page language="java" %>
<html>
<body>
<h3>Student Request</h3>
<p>Roll: <%= request.getParameter("roll") %></p>
<p>Course: <%= request.getParameter("course") %></p>
<p>URI: <%= request.getRequestURI() %></p>
<p>IP: <%= request.getRemoteAddr() %></p>
<p>Method: <%= request.getMethod() %></p>
</body>
</html>
<%@ page language="java" %>
<html>
<body>
<%
  Integer c = application.getAttribute("visitors");
  if (c == null) c = 0;
  c = c + 1;
  application.setAttribute("visitors", c);
%>
<h3>College Website Counter</h3>
<p>Total visitors (all sessions): <b><%= c %></b></p>
<p>This JVM/container: <%= application.getServerInfo() %></p>
</body>
</html>
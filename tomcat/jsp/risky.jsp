<%@ page language="java" errorPage="error.jsp" %>
<html>
<body>
<%
  int age = Integer.parseInt(request.getParameter("age"));
  out.println("Age next year: " + (age + 1));
%>
</body>
</html>
<%@ page language="java" %>
<html>
<body>
<h3>Multiplication Table</h3>
<%
  String ns = request.getParameter("n");
  if (ns == null) ns = "5";
  int n = Integer.parseInt(ns);
  int i;
  for (i = 1; i <= 10; i++) {
    out.println(n + " x " + i + " = " + (n * i));
    out.println("<br>");
  }
%>
</body>
</html>
<%@ page language="java" %>
<html>
<body>
<%
  int a = Integer.parseInt(request.getParameter("a"));
  int b = Integer.parseInt(request.getParameter("b"));
%>
<h3>Expression Demo</h3>
<p>a = <%= a %> , b = <%= b %></p>
<p>Sum = <%= a + b %></p>
<p>Product = <%= a * b %></p>
<p>Power a^b = <%= Math.pow(a, b) %></p>
<p>Upper name = <%= "java server pages".toUpperCase() %></p>
</body>
</html>
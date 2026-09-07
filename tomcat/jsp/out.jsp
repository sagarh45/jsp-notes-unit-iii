<%@ page language="java" %>
<html>
<body>
<%
  out.println("<h3>JspWriter Demo</h3>");
  out.print("City = ");
  out.println(request.getParameter("city"));
  out.println("<p>Buffering is handled by the container.</p>");
%>
</body>
</html>
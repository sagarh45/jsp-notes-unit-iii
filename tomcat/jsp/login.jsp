<%@ page language="java" session="true" %>
<html>
<body>
<%
  String u = request.getParameter("uname");
  String p = request.getParameter("pass");
  if (u != null && p != null) {
    if (u.equals("admin") && p.equals("admin123")) {
      session.setAttribute("user", u);
      session.setAttribute("role", "HOD");
    } else {
      out.println("<p style='color:red'>Invalid credentials</p>");
    }
  }
  String user = session.getAttribute("user");
%>
<h3>Faculty Login</h3>
<% if (user != null) { %>
  <p>Welcome <b><%= user %></b> (<%= session.getAttribute("role") %>)</p>
  <p>Session ID: <%= session.getId() %></p>
<% } else { %>
  <p>Please submit uname=admin and pass=admin123</p>
<% } %>
</body>
</html>
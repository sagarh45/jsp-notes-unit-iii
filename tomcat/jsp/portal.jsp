<%@ page language="java" session="true" %>
<html>
<body>
<%
  String id = request.getParameter("userid");
  String pwd = request.getParameter("pwd");
  if (id != null && pwd != null && pwd.equals("wit@123")) {
    session.setAttribute("userid", id);
    out.println("<h2>ERP Dashboard</h2>");
    out.println("<p>PRN: " + id + "</p>");
    out.println("<p>Modules: Attendance | ICA | Feedback | Hall ticket</p>");
  } else {
    out.println("<h2>Login failed</h2>");
    out.println("<p>Use any userid and password wit@123 for this demo.</p>");
  }
%>
</body>
</html>
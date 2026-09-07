<%@ page language="java" session="true" contentType="text/html" %>
<html>
<head><title>Employee Dashboard</title></head>
<body>
<h2>Industry Problem: Employee Self-Service Portal</h2>
<%
  Object empId = session.getAttribute("empId");
  if (empId == null) {
    out.println("<p style='color:#c0392b'>No session found. Register first:</p>");
    out.println("<p><code>http://localhost:8080/jsp/employee_register.jsp?empId=E1024&name=Rahul&dept=IT</code></p>");
  } else {
%>
<p>Welcome, <b><%= session.getAttribute("empName") %></b></p>
<p>Employee ID: <%= empId %></p>
<p>Department: <%= session.getAttribute("dept") %></p>
<p>Quick links: Payslip | Leave | Timesheet | ICA Marks</p>
<% } %>
</body>
</html>
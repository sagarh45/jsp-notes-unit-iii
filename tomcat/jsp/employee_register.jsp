<%@ page language="java" session="true" contentType="text/html" %>
<html>
<head><title>Employee Onboarding</title></head>
<body>
<h2>Industry Problem: HR Employee Registration</h2>
<p><b>Company:</b> GlobalTech Solutions</p>
<%
  String empId = request.getParameter("empId");
  String name = request.getParameter("name");
  String dept = request.getParameter("dept");
  if (empId != null && name != null) {
    session.setAttribute("empId", empId);
    session.setAttribute("empName", name);
    session.setAttribute("dept", dept);
    Integer hires = application.getAttribute("totalHires");
    if (hires == null) hires = 0;
    hires = hires + 1;
    application.setAttribute("totalHires", hires);
  }
%>
<h3>Onboarding Receipt</h3>
<p>Employee ID: <b><%= session.getAttribute("empId") %></b></p>
<p>Name: <%= session.getAttribute("empName") %></p>
<p>Department: <%= session.getAttribute("dept") %></p>
<p>Session ID: <%= session.getId() %></p>
<p>Total hires (company-wide): <%= application.getAttribute("totalHires") %></p>
</body>
</html>
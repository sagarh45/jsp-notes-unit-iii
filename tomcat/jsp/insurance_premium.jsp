<%@ page language="java" errorPage="error.jsp" contentType="text/html" %>
<html>
<head><title>Insurance Premium</title></head>
<body>
<h2>Industry Problem: Life Insurance Premium Calculator</h2>
<p><b>Company:</b> SecureLife Insurance</p>
<%
  int age = Integer.parseInt(request.getParameter("age"));
  int sum = Integer.parseInt(request.getParameter("sum"));
  int term = Integer.parseInt(request.getParameter("term"));
  if (age < 18 || age > 65) throw new Exception("Age must be between 18 and 65");
  if (sum <= 0 || term <= 0) throw new Exception("Sum assured and term must be positive");
  double rate = (age < 30) ? 0.008 : (age < 45) ? 0.012 : 0.018;
  int annualPremium = (int)(sum * rate / term);
  int totalPremium = annualPremium * term;
%>
<table border="1" cellpadding="8">
<tr><td>Age</td><td><%= age %></td></tr>
<tr><td>Sum assured</td><td>Rs. <%= sum %></td></tr>
<tr><td>Policy term</td><td><%= term %> years</td></tr>
<tr><td>Annual premium</td><td><b>Rs. <%= annualPremium %></b></td></tr>
<tr><td>Total over term</td><td>Rs. <%= totalPremium %></td></tr>
</table>
</body>
</html>
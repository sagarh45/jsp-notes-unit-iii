<%@ page language="java" import="java.util.Date" contentType="text/html" %>
<html>
<head><title>Sales Forecast</title></head>
<body>
<h2>Industry Problem: Sales Growth Forecast</h2>
<p><b>Company:</b> TechSales Analytics | <b>Report date:</b> <%= new Date() %></p>
<%
  int months = Integer.parseInt(request.getParameter("months"));
  double revenue = 100000;
  double growth = 1.08;
  int m;
  out.println("<table border='1' cellpadding='6'><tr><th>Month</th><th>Revenue (Rs.)</th></tr>");
  for (m = 1; m <= months; m++) {
    revenue = revenue * growth;
    out.println("<tr><td>Month " + m + "</td><td>" + (int) revenue + "</td></tr>");
  }
  out.println("</table>");
%>
<p>Assumption: 8% month-on-month growth from base Rs. 1,00,000</p>
</body>
</html>
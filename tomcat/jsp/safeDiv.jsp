<%@ page language="java" %>
<html>
<body>
<h3>Result Percentage Helper</h3>
<%
  try {
    int num = Integer.parseInt(request.getParameter("num"));
    int den = Integer.parseInt(request.getParameter("den"));
    int pct = num / den;
    out.println("<p>Value = " + pct + "</p>");
  } catch (Exception e) {
    out.println("<p style='color:#c0392b'>Handled in JSP: " + e + "</p>");
    out.println("<p>Hint: denominator must be a non-zero integer.</p>");
  }
%>
</body>
</html>
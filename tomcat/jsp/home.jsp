<%@ page language="java" %>
<%@ include file="header.jsp" %>
<html>
<body>
<h3>Department Dashboard</h3>
<p>Logged in: <%= request.getParameter("user") %></p>
<p>This body plus header/footer become ONE servlet.</p>
<%@ include file="footer.jsp" %>
</body>
</html>
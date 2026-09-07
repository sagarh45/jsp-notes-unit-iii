<%@ page language="java" import="java.util.Date" session="true" info="Unit-III demo page" contentType="text/html" %>
<html>
<body>
<h3>page directive</h3>
<p>Today: <%= new Date() %></p>
<p>Session id: <%= session.getId() %></p>
<p>Content type is set to text/html by the page directive.</p>
</body>
</html>
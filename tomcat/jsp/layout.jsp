<%@ page language="java" %>
<html>
<body>
<jsp:include page="nav.jsp" />
<h3><%= request.getParameter("pageTitle") %></h3>
<p>Main content is in layout.jsp. Navigation is included at runtime.</p>
</body>
</html>
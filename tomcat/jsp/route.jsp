<%@ page language="java" %>
<%
  String role = request.getParameter("role");
  if (role == null) role = "student";
  if (role.equals("admin")) {
%>
<jsp:include page="adminHome.jsp" />
<% } else { %>
<jsp:include page="studentHome.jsp" />
<% } %>
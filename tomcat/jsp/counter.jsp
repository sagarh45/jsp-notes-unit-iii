<%@ page language="java" %>
<%!
  int hits = 0;
  String greet(String who) {
    return "Namaste, " + who;
  }
%>
<html>
<body>
<% hits = hits + 1; %>
<h3><%= greet("Student") %></h3>
<p>This JSP instance has been requested <b><%= hits %></b> time(s).</p>
<p>Application hits: <%= application.getAttribute("hitCount") %></p>
</body>
</html>
<%@ page language="java" %>
<jsp:useBean id="st" class="Student" scope="session" />
<jsp:setProperty name="st" property="name" param="name" />
<jsp:setProperty name="st" property="marks" param="marks" />
<html>
<body>
<h3>Student JavaBean</h3>
<p>Name: <jsp:getProperty name="st" property="name" /></p>
<p>Marks: <jsp:getProperty name="st" property="marks" /></p>
<p>After setProperty the bean lives in session scope.</p>
</body>
</html>
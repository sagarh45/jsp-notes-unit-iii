<%@ page isErrorPage="true" %>
<html><body style="font-family:sans-serif">
<h3 style="color:#c0392b">Application Error Page</h3>
<p>Something went wrong while processing your JSP.</p>
<p><b>Exception:</b> <%= exception %></p>
<p>This page has isErrorPage="true" so the exception implicit object is available.</p>
</body></html>
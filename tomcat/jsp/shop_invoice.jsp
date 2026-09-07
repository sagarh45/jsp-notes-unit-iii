<%@ page language="java" contentType="text/html" %>
<%@ include file="invoice_header.jsp" %>
<html>
<body>
<h2>Industry Problem: GST Invoice Generation</h2>
<%
  Object bill = session.getAttribute("bill");
  Object sku = session.getAttribute("sku");
  if (bill == null) {
    out.println("<p>Cart empty. Add items first:</p>");
    out.println("<p><code>http://localhost:8080/jsp/shop_cart.jsp?sku=BOOK101&price=450&qty=2</code></p>");
  } else {
    int amt = Integer.parseInt(String.valueOf(bill));
    int gst = amt * 18 / 100;
    int payable = amt + gst;
%>
<p>SKU: <%= sku %></p>
<p>Taxable amount: Rs. <%= amt %></p>
<p>GST 18%: Rs. <%= gst %></p>
<p><b>Total payable: Rs. <%= payable %></b></p>
<p>Payment status: <span style='color:green'>Confirmed</span></p>
<% } %>
</body>
</html>
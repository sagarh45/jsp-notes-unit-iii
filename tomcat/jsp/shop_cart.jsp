<%@ page language="java" contentType="text/html" %>
<jsp:useBean id="cart" class="Cart" scope="session" />
<jsp:setProperty name="cart" property="item" param="sku" />
<jsp:setProperty name="cart" property="price" param="price" />
<jsp:setProperty name="cart" property="qty" param="qty" />
<html>
<head><title>Shopping Cart</title></head>
<body>
<h2>Industry Problem: E-commerce Cart Checkout</h2>
<p><b>Store:</b> ShopMart Online</p>
<table border="1" cellpadding="8">
<tr><th>SKU</th><th>Item</th><th>Price</th><th>Qty</th><th>Line total</th></tr>
<tr>
<td><%= request.getParameter("sku") %></td>
<td><jsp:getProperty name="cart" property="item" /></td>
<td>Rs. <jsp:getProperty name="cart" property="price" /></td>
<td><jsp:getProperty name="cart" property="qty" /></td>
<%
  int price = Integer.parseInt(request.getParameter("price"));
  int qty = Integer.parseInt(request.getParameter("qty"));
  int total = price * qty;
  session.setAttribute("bill", total);
  session.setAttribute("sku", request.getParameter("sku"));
%>
<td>Rs. <%= total %></td>
</tr>
</table>
<h3>Cart total: Rs. <%= total %></h3>
<jsp:include page="cart_nav.jsp" />
</body>
</html>
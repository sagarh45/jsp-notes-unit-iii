<%@ page language="java" contentType="text/html" info="E-commerce Pricing Engine" %>
<%!
  static final double GST_RATE = 18.0;
  double applyDiscount(double price, int pct) { return price - (price * pct / 100.0); }
  double addGst(double amount) { return amount + (amount * GST_RATE / 100.0); }
%>
<html>
<head><title>Product Pricing</title></head>
<body>
<h2>Industry Problem: E-commerce Price Calculator</h2>
<p><b>Company:</b> RetailMart Pvt Ltd | <b>Module:</b> Warehouse Pricing</p>
<%-- Internal: GST slab 18% for books and electronics --%>
<%
  int price = Integer.parseInt(request.getParameter("price"));
  int discount = Integer.parseInt(request.getParameter("discount"));
  double afterDisc = applyDiscount(price, discount);
  double net = addGst(afterDisc);
  double discAmt = price - afterDisc;
%>
<table border="1" cellpadding="8">
<tr><td>MRP (Rs.)</td><td><%= price %></td></tr>
<tr><td>Discount (<%= discount %>%)</td><td>- Rs. <%= discAmt %></td></tr>
<tr><td>After discount</td><td>Rs. <%= afterDisc %></td></tr>
<tr><td>GST @ <%= GST_RATE %>%</td><td>Rs. <%= (net - afterDisc) %></td></tr>
<tr><td><b>Net payable</b></td><td><b>Rs. <%= net %></b></td></tr>
</table>
</body>
</html>
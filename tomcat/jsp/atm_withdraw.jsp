<%@ page language="java" contentType="text/html" %>
<html>
<head><title>ATM Withdrawal</title></head>
<body>
<h2>Industry Problem: ATM Cash Withdrawal</h2>
<p><b>Bank:</b> National Trust Bank | <b>ATM ID:</b> ATM-SOL-042</p>
<%
  try {
    int balance = Integer.parseInt(request.getParameter("balance"));
    int amount = Integer.parseInt(request.getParameter("amount"));
    if (amount <= 0) throw new Exception("Withdrawal amount must be positive");
    if (amount % 100 != 0) throw new Exception("Amount must be in multiples of Rs. 100");
    if (amount > balance) throw new Exception("Insufficient balance");
    if (amount > 10000) throw new Exception("Daily limit exceeded (max Rs. 10,000)");
    int remaining = balance - amount;
    out.println("<p style='color:green'><b>Transaction successful</b></p>");
    out.println("<p>Withdrawn: Rs. " + amount + "</p>");
    out.println("<p>Remaining balance: Rs. " + remaining + "</p>");
    out.println("<p>Receipt #: TXN" + System.currentTimeMillis() + "</p>");
  } catch (Exception e) {
    out.println("<p style='color:#c0392b'><b>Transaction declined:</b> " + e.getMessage() + "</p>");
    out.println("<p>No amount has been deducted from your account.</p>");
  }
%>
</body>
</html>
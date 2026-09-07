/* Complete ICA practicals — problem statements + full source code */
window.ICA_PRACTICALS = [
  {
    id: "ica1",
    number: "ICA Practical 1",
    title: "E-commerce Product Pricing & Sales Analytics",
    industry: "RetailMart Pvt Ltd / TechSales Analytics",
    aim: "To implement JSP elements (page directive, declaration, scriptlet, expression, comment) in industry-based e-commerce pricing and sales forecast modules.",
    problemStatement: `RetailMart Pvt Ltd operates an online warehouse system. When a product is scanned, the backend receives MRP and discount percentage as URL parameters (no HTML form). The JSP page must:
1. Read price and discount from the URL using request.getParameter().
2. Calculate discount amount, price after discount, GST @ 18%, and net payable.
3. Display results in an HTML table using JSP expressions.

TechSales Analytics needs a second JSP that accepts "months" from the URL and prints a month-wise revenue forecast table with the server date on top, assuming 8% month-on-month growth from a base revenue of Rs. 1,00,000.`,
    given: [
      "Tomcat 11.0.24, JDK 17+, folder webapps/jsp/",
      "Input passed via browser URL query string only",
      "GST rate fixed at 18%"
    ],
    requirements: [
      "Use <%@ page %> directive with contentType and info",
      "Use <%! %> declaration for GST rate and helper methods",
      "Use <% %> scriptlet to read parameters and compute values",
      "Use <%= %> expression to print results",
      "Use <%-- --%> JSP comment for internal notes"
    ],
    programs: [
      {
        name: "Program A — product_pricing.jsp",
        file: "product_pricing.jsp",
        runUrl: "http://localhost:8080/jsp/product_pricing.jsp?price=999&discount=15",
        sampleInput: "price=999, discount=15",
        sampleOutput: "MRP 999, Discount 15%, After discount 849.15, GST 152.85, Net payable 1002.0",
        code: `<%@ page language="java" contentType="text/html; charset=UTF-8" info="E-commerce Pricing Engine" %>
<%!
  static final double GST_RATE = 18.0;
  double applyDiscount(double price, int pct) {
    return price - (price * pct / 100.0);
  }
  double addGst(double amount) {
    return amount + (amount * GST_RATE / 100.0);
  }
%>
<html>
<head><title>Product Pricing</title></head>
<body>
<h2>Industry Problem: E-commerce Price Calculator</h2>
<p><b>Company:</b> RetailMart Pvt Ltd | <b>Module:</b> Warehouse Pricing</p>
<%-- Internal note: GST slab 18% for books and electronics --%>
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
</html>`
      },
      {
        name: "Program B — sales_forecast.jsp",
        file: "sales_forecast.jsp",
        runUrl: "http://localhost:8080/jsp/sales_forecast.jsp?months=6",
        sampleInput: "months=6",
        sampleOutput: "Table with Month 1 to 6 revenue values; report date shown",
        code: `<%@ page language="java" import="java.util.Date" contentType="text/html; charset=UTF-8" %>
<html>
<head><title>Sales Forecast</title></head>
<body>
<h2>Industry Problem: Sales Growth Forecast</h2>
<p><b>Company:</b> TechSales Analytics | <b>Report date:</b> <%= new Date() %></p>
<%
  int months = Integer.parseInt(request.getParameter("months"));
  double revenue = 100000;
  double growth = 1.08;
  int m;
  out.println("<table border='1' cellpadding='6'>");
  out.println("<tr><th>Month</th><th>Revenue (Rs.)</th></tr>");
  for (m = 1; m <= months; m++) {
    revenue = revenue * growth;
    out.println("<tr><td>Month " + m + "</td><td>" + (int) revenue + "</td></tr>");
  }
  out.println("</table>");
%>
<p>Assumption: 8% month-on-month growth from base Rs. 1,00,000</p>
</body>
</html>`
      }
    ],
    algorithm: [
      "Create webapps/jsp/ folder in Tomcat",
      "Save product_pricing.jsp and sales_forecast.jsp",
      "Start Tomcat (startup.bat)",
      "Open URL with parameters in browser address bar",
      "Tomcat Jasper auto-compiles JSP — no manual javac needed"
    ],
    viva: [
      "Why is GST_RATE in declaration and not in scriptlet?",
      "How does request.getParameter read URL values?",
      "Difference between <%-- comment --%> and <!-- HTML comment -->?"
    ]
  },
  {
    id: "ica2",
    number: "ICA Practical 2",
    title: "HR Employee Onboarding Portal",
    industry: "GlobalTech Solutions — Human Resources",
    aim: "To implement implicit objects request, session, and application for an HR onboarding system that stores employee data across requests.",
    problemStatement: `GlobalTech Solutions receives new employee details from the recruitment portal as URL parameters: empId, name, and dept. The HR JSP must:
1. Read parameters using the request implicit object.
2. Store employee profile in session scope so the employee stays logged in across pages.
3. Maintain a company-wide hire counter (totalHires) in application scope shared by all users.

A second JSP (employee dashboard) must display the employee profile from session without requiring URL parameters again — simulating an intranet self-service portal.`,
    given: [
      "Tomcat 11.0.24, webapps/jsp/",
      "Employee data arrives as URL query parameters",
      "session=\"true\" on registration page"
    ],
    requirements: [
      "Use request.getParameter() for empId, name, dept",
      "Use session.setAttribute() / getAttribute()",
      "Use application.setAttribute() for totalHires counter",
      "Dashboard reads session only — no form, no URL params"
    ],
    programs: [
      {
        name: "Program A — employee_register.jsp",
        file: "employee_register.jsp",
        runUrl: "http://localhost:8080/jsp/employee_register.jsp?empId=E1024&name=Rahul&dept=IT",
        sampleInput: "empId=E1024, name=Rahul, dept=IT",
        sampleOutput: "Onboarding receipt with session ID and total hires count",
        code: `<%@ page language="java" session="true" contentType="text/html; charset=UTF-8" %>
<html>
<head><title>Employee Onboarding</title></head>
<body>
<h2>Industry Problem: HR Employee Registration</h2>
<p><b>Company:</b> GlobalTech Solutions</p>
<%
  String empId = request.getParameter("empId");
  String name = request.getParameter("name");
  String dept = request.getParameter("dept");
  if (empId != null && name != null) {
    session.setAttribute("empId", empId);
    session.setAttribute("empName", name);
    session.setAttribute("dept", dept);
    Integer hires = (Integer) application.getAttribute("totalHires");
    if (hires == null) hires = 0;
    hires = hires + 1;
    application.setAttribute("totalHires", hires);
  }
%>
<h3>Onboarding Receipt</h3>
<p>Employee ID: <b><%= session.getAttribute("empId") %></b></p>
<p>Name: <%= session.getAttribute("empName") %></p>
<p>Department: <%= session.getAttribute("dept") %></p>
<p>Session ID: <%= session.getId() %></p>
<p>Total hires (company-wide): <%= application.getAttribute("totalHires") %></p>
</body>
</html>`
      },
      {
        name: "Program B — employee_dashboard.jsp",
        file: "employee_dashboard.jsp",
        runUrl: "http://localhost:8080/jsp/employee_dashboard.jsp",
        sampleInput: "No URL params — run after register in same browser session",
        sampleOutput: "Welcome message with empId, name, dept from session",
        code: `<%@ page language="java" session="true" contentType="text/html; charset=UTF-8" %>
<html>
<head><title>Employee Dashboard</title></head>
<body>
<h2>Industry Problem: Employee Self-Service Portal</h2>
<%
  Object empId = session.getAttribute("empId");
  if (empId == null) {
    out.println("<p style='color:#c0392b'>No session found. Register first:</p>");
    out.println("<p><code>http://localhost:8080/jsp/employee_register.jsp?empId=E1024&name=Rahul&dept=IT</code></p>");
  } else {
%>
<p>Welcome, <b><%= session.getAttribute("empName") %></b></p>
<p>Employee ID: <%= empId %></p>
<p>Department: <%= session.getAttribute("dept") %></p>
<p>Quick links: Payslip | Leave | Timesheet | ICA Marks</p>
<% } %>
</body>
</html>`
      }
    ],
    algorithm: [
      "Run employee_register.jsp with URL parameters",
      "Session stores employee; application increments totalHires",
      "Open employee_dashboard.jsp in same browser (same session cookie)",
      "Dashboard reads session attributes without URL input"
    ],
    viva: [
      "Type of session and application implicit objects?",
      "Why totalHires is in application scope?",
      "What happens if session expires before opening dashboard?"
    ]
  },
  {
    id: "ica3",
    number: "ICA Practical 3",
    title: "E-commerce Shopping Cart & GST Invoice",
    industry: "ShopMart Online — E-commerce & Billing",
    aim: "To implement jsp:useBean, setProperty, getProperty, jsp:include, and include directive for a complete checkout and invoice flow.",
    problemStatement: `ShopMart Online allows customers to add products to cart via URL parameters: sku, price, and qty. The system must:
1. Use jsp:useBean to create/locate a Cart JavaBean in session scope.
2. Use jsp:setProperty to bind URL parameters to bean properties.
3. Use jsp:getProperty and scriptlet to compute line total and store bill in session.
4. Use jsp:include for dynamic cart navigation bar.

After checkout, shop_invoice.jsp must read bill amount from session and generate a GST invoice with company header using static include directive (<%@ include file="..." %>).`,
    given: [
      "Tomcat 11.0.24, webapps/jsp/",
      "Cart.java compiled to WEB-INF/classes/Cart.class",
      "Partner files: cart_nav.jsp, invoice_header.jsp"
    ],
    requirements: [
      "JavaBean Cart with item, price, qty + getters/setters",
      "jsp:useBean id=\"cart\" class=\"Cart\" scope=\"session\"",
      "jsp:setProperty with param attribute for URL binding",
      "jsp:include for cart navigation",
      "include directive for invoice company header"
    ],
    programs: [
      {
        name: "JavaBean — Cart.java",
        file: "Cart.java",
        runUrl: "Compile: javac -encoding UTF-8 Cart.java in WEB-INF/classes/",
        sampleInput: "N/A — compile once",
        sampleOutput: "Cart.class generated",
        code: `public class Cart implements java.io.Serializable {
  private String item;
  private int price;
  private int qty;

  public Cart() {}

  public String getItem() { return item; }
  public void setItem(String item) { this.item = item; }

  public int getPrice() { return price; }
  public void setPrice(int price) { this.price = price; }

  public int getQty() { return qty; }
  public void setQty(int qty) { this.qty = qty; }
}`
      },
      {
        name: "Partner — cart_nav.jsp",
        file: "cart_nav.jsp",
        runUrl: "Included by shop_cart.jsp — not run directly",
        sampleInput: "N/A",
        sampleOutput: "Navigation bar HTML",
        code: `<div style="margin-top:12px;padding:8px;background:#0f2744;color:#fff;border-radius:8px;">
  Home | Cart | Checkout | Support
</div>`
      },
      {
        name: "Program A — shop_cart.jsp",
        file: "shop_cart.jsp",
        runUrl: "http://localhost:8080/jsp/shop_cart.jsp?sku=BOOK101&price=450&qty=2",
        sampleInput: "sku=BOOK101, price=450, qty=2",
        sampleOutput: "Cart table, line total Rs. 900, navigation bar",
        code: `<%@ page language="java" contentType="text/html; charset=UTF-8" %>
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
</html>`
      },
      {
        name: "Partner — invoice_header.jsp",
        file: "invoice_header.jsp",
        runUrl: "Static include in shop_invoice.jsp",
        sampleInput: "N/A",
        sampleOutput: "Company GST header",
        code: `<div style="padding:8px;background:#fff3d6;border-radius:8px;margin-bottom:12px;">
  <b>ShopMart Tax Invoice</b> | GSTIN: 27AABCU9603R1ZM | Solapur
</div>`
      },
      {
        name: "Program B — shop_invoice.jsp",
        file: "shop_invoice.jsp",
        runUrl: "http://localhost:8080/jsp/shop_invoice.jsp",
        sampleInput: "Run after shop_cart.jsp in same session",
        sampleOutput: "GST invoice: taxable 900, GST 162, total 1062",
        code: `<%@ page language="java" contentType="text/html; charset=UTF-8" %>
<%@ include file="invoice_header.jsp" %>
<html>
<head><title>Tax Invoice</title></head>
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
<p>Payment status: <span style="color:green">Confirmed</span></p>
<% } %>
</body>
</html>`
      }
    ],
    algorithm: [
      "Compile Cart.java → WEB-INF/classes/Cart.class",
      "Save cart_nav.jsp, invoice_header.jsp, shop_cart.jsp, shop_invoice.jsp",
      "Run shop_cart.jsp with sku, price, qty in URL",
      "Run shop_invoice.jsp in same browser session"
    ],
    viva: [
      "JavaBean rules for jsp:useBean?",
      "Difference between jsp:include and include directive?",
      "Why Cart is session scoped?"
    ]
  },
  {
    id: "ica4",
    number: "ICA Practical 4",
    title: "Insurance Premium Calculator & ATM Withdrawal",
    industry: "SecureLife Insurance / National Trust Bank",
    aim: "To implement exception handling using errorPage, isErrorPage, try-catch, and business-rule validation in industry banking and insurance systems.",
    problemStatement: `SecureLife Insurance agents enter policy details via URL: age, sum assured (sum), and term in years. The JSP must calculate annual premium using age-based rates. If input is invalid (non-numeric age, age out of range 18–65, negative values), the container must forward to a professional error.jsp — not show a stack trace.

National Trust Bank ATM system accepts balance and withdrawal amount via URL. The JSP must validate:
- Amount is positive
- Amount is in multiples of Rs. 100
- Sufficient balance exists
- Daily limit Rs. 10,000 not exceeded
Invalid transactions must show a friendly message using try-catch without exposing technical errors to the customer.`,
    given: [
      "Tomcat 11.0.24, webapps/jsp/",
      "insurance_premium.jsp with errorPage=\"error.jsp\"",
      "error.jsp with isErrorPage=\"true\""
    ],
    requirements: [
      "Insurance: errorPage forwarding for uncaught exceptions",
      "error.jsp uses exception implicit object",
      "ATM: try-catch for business rule violations",
      "All input via URL query parameters"
    ],
    programs: [
      {
        name: "Partner — error.jsp",
        file: "error.jsp",
        runUrl: "Reached automatically when insurance_premium.jsp throws exception",
        sampleInput: "Triggered by invalid age e.g. age=abc",
        sampleOutput: "Friendly error page with exception message",
        code: `<%@ page isErrorPage="true" contentType="text/html; charset=UTF-8" %>
<html>
<head><title>Premium Error</title></head>
<body style="font-family:sans-serif;padding:20px;">
<h3 style="color:#c0392b">Insurance Premium — Error</h3>
<p>We could not calculate your premium. Please verify:</p>
<ul>
  <li>Age is a number between 18 and 65</li>
  <li>Sum assured and term are positive integers</li>
</ul>
<p><b>Technical detail:</b> <%= exception %></p>
<p><a href="insurance_premium.jsp?age=35&sum=500000&term=20">Try with sample values</a></p>
</body>
</html>`
      },
      {
        name: "Program A — insurance_premium.jsp",
        file: "insurance_premium.jsp",
        runUrl: "http://localhost:8080/jsp/insurance_premium.jsp?age=35&sum=500000&term=20",
        sampleInput: "age=35, sum=500000, term=20",
        sampleOutput: "Annual premium Rs. 300, total over term Rs. 6000",
        code: `<%@ page language="java" errorPage="error.jsp" contentType="text/html; charset=UTF-8" %>
<html>
<head><title>Insurance Premium</title></head>
<body>
<h2>Industry Problem: Life Insurance Premium Calculator</h2>
<p><b>Company:</b> SecureLife Insurance</p>
<%
  int age = Integer.parseInt(request.getParameter("age"));
  int sum = Integer.parseInt(request.getParameter("sum"));
  int term = Integer.parseInt(request.getParameter("term"));
  if (age < 18 || age > 65) {
    throw new Exception("Age must be between 18 and 65");
  }
  if (sum <= 0 || term <= 0) {
    throw new Exception("Sum assured and term must be positive");
  }
  double rate = (age < 30) ? 0.008 : (age < 45) ? 0.012 : 0.018;
  int annualPremium = (int)(sum * rate / term);
  int totalPremium = annualPremium * term;
%>
<table border="1" cellpadding="8">
<tr><td>Age</td><td><%= age %></td></tr>
<tr><td>Sum assured</td><td>Rs. <%= sum %></td></tr>
<tr><td>Policy term</td><td><%= term %> years</td></tr>
<tr><td>Annual premium</td><td><b>Rs. <%= annualPremium %></b></td></tr>
<tr><td>Total over term</td><td>Rs. <%= totalPremium %></td></tr>
</table>
</body>
</html>`
      },
      {
        name: "Program B — atm_withdraw.jsp",
        file: "atm_withdraw.jsp",
        runUrl: "http://localhost:8080/jsp/atm_withdraw.jsp?balance=5000&amount=2000",
        sampleInput: "balance=5000, amount=2000 (success) OR amount=12000 (fail)",
        sampleOutput: "Success: receipt with new balance. Fail: Transaction declined message",
        code: `<%@ page language="java" contentType="text/html; charset=UTF-8" %>
<html>
<head><title>ATM Withdrawal</title></head>
<body>
<h2>Industry Problem: ATM Cash Withdrawal</h2>
<p><b>Bank:</b> National Trust Bank | <b>ATM ID:</b> ATM-SOL-042</p>
<%
  try {
    int balance = Integer.parseInt(request.getParameter("balance"));
    int amount = Integer.parseInt(request.getParameter("amount"));
    if (amount <= 0) {
      throw new Exception("Withdrawal amount must be positive");
    }
    if (amount % 100 != 0) {
      throw new Exception("Amount must be in multiples of Rs. 100");
    }
    if (amount > balance) {
      throw new Exception("Insufficient balance");
    }
    if (amount > 10000) {
      throw new Exception("Daily limit exceeded (max Rs. 10,000)");
    }
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
</html>`
      }
    ],
    algorithm: [
      "Save error.jsp and insurance_premium.jsp in webapps/jsp/",
      "Test valid URL — premium table displayed",
      "Test age=abc — forwarded to error.jsp",
      "Save atm_withdraw.jsp and test success/failure URLs"
    ],
    viva: [
      "Why isErrorPage=\"true\" on error.jsp?",
      "errorPage vs try-catch — when to use which?",
      "How to register 404 error page in web.xml?"
    ]
  }
];

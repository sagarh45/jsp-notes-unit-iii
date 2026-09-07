window.JSP_EXAMPLES = {
  hello: {
    title: "Hello JSP — first page",
    file: "hello.jsp",
    level: "Basic",
    desc: "A JSP that mixes HTML with a scriptlet and an expression to greet the user and print server time.",
    params: [{ name: "name", label: "name", value: "Sagar" }],
    jsp: `<%@ page language="java" contentType="text/html; charset=UTF-8" %>
<html>
<head><title>Hello JSP</title></head>
<body>
<h2>Welcome to Java Server Pages</h2>
<%
  String name = request.getParameter("name");
  if (name == null) {
    name = "Guest";
  }
%>
<p>Hello <b><%= name %></b>!</p>
<p>Server time: <%= new java.util.Date() %></p>
</body>
</html>`
  },

  scriptlet_table: {
    title: "Scriptlet — multiplication table",
    file: "table.jsp",
    level: "Basic",
    desc: "Scriptlets (<% %>) contain Java statements. This loop writes a table of a number into the response.",
    params: [{ name: "n", label: "n", value: "12" }],
    jsp: `<%@ page language="java" %>
<html>
<body>
<h3>Multiplication Table</h3>
<%
  String ns = request.getParameter("n");
  if (ns == null) ns = "5";
  int n = Integer.parseInt(ns);
  int i;
  for (i = 1; i <= 10; i++) {
    out.println(n + " x " + i + " = " + (n * i));
    out.println("<br>");
  }
%>
</body>
</html>`
  },

  expression_calc: {
    title: "Expressions — live evaluation",
    file: "expr.jsp",
    level: "Basic",
    desc: "<%= expression %> is converted to out.print(expression). No semicolon inside the tag.",
    params: [{ name: "a", label: "a", value: "25" }, { name: "b", label: "b", value: "4" }],
    jsp: `<%@ page language="java" %>
<html>
<body>
<%
  int a = Integer.parseInt(request.getParameter("a"));
  int b = Integer.parseInt(request.getParameter("b"));
%>
<h3>Expression Demo</h3>
<p>a = <%= a %> , b = <%= b %></p>
<p>Sum = <%= a + b %></p>
<p>Product = <%= a * b %></p>
<p>Power a^b = <%= Math.pow(a, b) %></p>
<p>Upper name = <%= "java server pages".toUpperCase() %></p>
</body>
</html>`
  },

  declaration_counter: {
    title: "Declaration — instance visit counter",
    file: "counter.jsp",
    level: "Basic",
    desc: "<%! %> members live at servlet class level, so the counter survives across requests in this JVM (until reload).",
    params: [],
    jsp: `<%@ page language="java" %>
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
</html>`
  },

  comments_mix: {
    title: "JSP vs HTML comments",
    file: "comments.jsp",
    level: "Basic",
    desc: "<%-- --%> is stripped at translation. <!-- --> is sent to the browser.",
    params: [],
    jsp: `<%@ page language="java" %>
<html>
<body>
<h3>Comment Demo</h3>
<%-- This secret will NEVER appear in HTML or servlet output --%>
<!-- This HTML comment IS visible in View Source -->
<p>Only the visible heading and this line are meant for the user.</p>
</body>
</html>`
  },

  page_import: {
    title: "page directive — import and info",
    file: "pageDir.jsp",
    level: "Intermediate",
    desc: "page directive attributes are applied while Jasper generates the servlet.",
    params: [],
    jsp: `<%@ page language="java" import="java.util.Date" session="true" info="Unit-III demo page" contentType="text/html" %>
<html>
<body>
<h3>page directive</h3>
<p>Today: <%= new Date() %></p>
<p>Session id: <%= session.getId() %></p>
<p>Content type is set to text/html by the page directive.</p>
</body>
</html>`
  },

  include_static: {
    title: "include directive — static include",
    file: "home.jsp",
    level: "Intermediate",
    desc: "<%@ include file=\"header.jsp\" %> pastes the file at translation time (one servlet).",
    params: [{ name: "user", label: "user", value: "WIT Student" }],
    files: {
      "header.jsp": "<div style='background:#0f2744;color:#fff;padding:10px;border-radius:8px;'>WIT | Advanced Java | JSP Notes Portal</div>",
      "footer.jsp": "<hr><small>Static include footer — compiled into the same servlet.</small>"
    },
    jsp: `<%@ page language="java" %>
<%@ include file="header.jsp" %>
<html>
<body>
<h3>Department Dashboard</h3>
<p>Logged in: <%= request.getParameter("user") %></p>
<p>This body plus header/footer become ONE servlet.</p>
<%@ include file="footer.jsp" %>
</body>
</html>`
  },

  implicit_request: {
    title: "Implicit object — request",
    file: "req.jsp",
    level: "Intermediate",
    desc: "request wraps HttpServletRequest. Read form fields, URI and remote address.",
    params: [
      { name: "roll", label: "roll", value: "21IT045" },
      { name: "course", label: "course", value: "Advanced Java" }
    ],
    jsp: `<%@ page language="java" %>
<html>
<body>
<h3>Student Request</h3>
<p>Roll: <%= request.getParameter("roll") %></p>
<p>Course: <%= request.getParameter("course") %></p>
<p>URI: <%= request.getRequestURI() %></p>
<p>IP: <%= request.getRemoteAddr() %></p>
<p>Method: <%= request.getMethod() %></p>
</body>
</html>`
  },

  implicit_session: {
    title: "Implicit object — session login",
    file: "login.jsp",
    level: "Intermediate",
    desc: "session (HttpSession) stores user data across multiple requests from the same browser.",
    params: [
      { name: "uname", label: "uname", value: "admin" },
      { name: "pass", label: "pass", value: "admin123" }
    ],
    jsp: `<%@ page language="java" session="true" %>
<html>
<body>
<%
  String u = request.getParameter("uname");
  String p = request.getParameter("pass");
  if (u != null && p != null) {
    if (u.equals("admin") && p.equals("admin123")) {
      session.setAttribute("user", u);
      session.setAttribute("role", "HOD");
    } else {
      out.println("<p style='color:red'>Invalid credentials</p>");
    }
  }
  String user = session.getAttribute("user");
%>
<h3>Faculty Login</h3>
<% if (user != null) { %>
  <p>Welcome <b><%= user %></b> (<%= session.getAttribute("role") %>)</p>
  <p>Session ID: <%= session.getId() %></p>
<% } else { %>
  <p>Please submit uname=admin and pass=admin123</p>
<% } %>
</body>
</html>`
  },

  implicit_application: {
    title: "Implicit object — application hit counter",
    file: "hits.jsp",
    level: "Intermediate",
    desc: "application is ServletContext — one per web app, shared by all users.",
    params: [],
    jsp: `<%@ page language="java" %>
<html>
<body>
<%
  Integer c = application.getAttribute("visitors");
  if (c == null) c = 0;
  c = c + 1;
  application.setAttribute("visitors", c);
%>
<h3>College Website Counter</h3>
<p>Total visitors (all sessions): <b><%= c %></b></p>
<p>This JVM/container: <%= application.getServerInfo() %></p>
</body>
</html>`
  },

  implicit_out: {
    title: "Implicit object — out (JspWriter)",
    file: "out.jsp",
    level: "Basic",
    desc: "out.print / out.println write into the response buffer.",
    params: [{ name: "city", label: "city", value: "Solapur" }],
    jsp: `<%@ page language="java" %>
<html>
<body>
<%
  out.println("<h3>JspWriter Demo</h3>");
  out.print("City = ");
  out.println(request.getParameter("city"));
  out.println("<p>Buffering is handled by the container.</p>");
%>
</body>
</html>`
  },

  action_forward: {
    title: "jsp:forward — controller style routing",
    file: "route.jsp",
    level: "Intermediate",
    desc: "Server-side forward. The browser URL stays on the original page.",
    params: [{ name: "role", label: "role", value: "student" }],
    files: {
      "studentHome.jsp": "<h3>Student Home</h3><p>Timetable, attendance and ICA marks.</p>",
      "adminHome.jsp": "<h3>Admin Home</h3><p>Manage users, subjects and reports.</p>"
    },
    jsp: `<%@ page language="java" %>
<%
  String role = request.getParameter("role");
  if (role == null) role = "student";
  if (role.equals("admin")) {
%>
<jsp:include page="adminHome.jsp" />
<% } else { %>
<jsp:include page="studentHome.jsp" />
<% } %>`
  },

  action_include: {
    title: "jsp:include — runtime include",
    file: "layout.jsp",
    level: "Intermediate",
    desc: "Dynamic include runs another resource at request time. Good for headers that change per request.",
    params: [{ name: "pageTitle", label: "pageTitle", value: "Results 2026" }],
    files: {
      "nav.jsp": "<nav style='background:#0d7377;color:#fff;padding:8px;border-radius:8px;'>Home | Academics | Results | Contact</nav>"
    },
    jsp: `<%@ page language="java" %>
<html>
<body>
<jsp:include page="nav.jsp" />
<h3><%= request.getParameter("pageTitle") %></h3>
<p>Main content is in layout.jsp. Navigation is included at runtime.</p>
</body>
</html>`
  },

  usebean_student: {
    title: "jsp:useBean / setProperty / getProperty",
    file: "bean.jsp",
    level: "Advanced",
    desc: "JavaBean pattern used in real MVC apps: form → bean properties → display.",
    params: [
      { name: "name", label: "name", value: "Aditi Patil" },
      { name: "marks", label: "marks", value: "88" }
    ],
    jsp: `<%@ page language="java" %>
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
</html>`
  },

  exception_try: {
    title: "try-catch inside a scriptlet",
    file: "safeDiv.jsp",
    level: "Intermediate",
    desc: "Local handling of ArithmeticException / NumberFormatException.",
    params: [
      { name: "num", label: "num", value: "100" },
      { name: "den", label: "den", value: "0" }
    ],
    jsp: `<%@ page language="java" %>
<html>
<body>
<h3>Result Percentage Helper</h3>
<%
  try {
    int num = Integer.parseInt(request.getParameter("num"));
    int den = Integer.parseInt(request.getParameter("den"));
    int pct = num / den;
    out.println("<p>Value = " + pct + "</p>");
  } catch (Exception e) {
    out.println("<p style='color:#c0392b'>Handled in JSP: " + e + "</p>");
    out.println("<p>Hint: denominator must be a non-zero integer.</p>");
  }
%>
</body>
</html>`
  },

  exception_errorpage: {
    title: "errorPage forwarding",
    file: "risky.jsp",
    level: "Advanced",
    desc: "page errorPage=\"error.jsp\" forwards uncaught exceptions to a dedicated error view.",
    params: [{ name: "age", label: "age", value: "abc" }],
    files: {
      "error.jsp": `<%@ page isErrorPage="true" %>
<html><body style="font-family:sans-serif">
<h3 style="color:#c0392b">Application Error Page</h3>
<p>Something went wrong while processing your JSP.</p>
<p><b>Exception:</b> <%= exception %></p>
<p>This page has isErrorPage="true" so the exception implicit object is available.</p>
</body></html>`
    },
    jsp: `<%@ page language="java" errorPage="error.jsp" %>
<html>
<body>
<%
  int age = Integer.parseInt(request.getParameter("age"));
  out.println("Age next year: " + (age + 1));
%>
</body>
</html>`
  },

  error_view: {
    title: "isErrorPage error view",
    file: "error.jsp",
    level: "Advanced",
    desc: "Only error pages may use the exception implicit object.",
    params: [],
    extras: { exceptionMessage: "java.lang.NumberFormatException: For input string 'abc'" },
    jsp: `<%@ page isErrorPage="true" contentType="text/html" %>
<html>
<body>
<h3>Friendly Error</h3>
<p>Dear student, the page you requested could not be completed.</p>
<p>Reason: <%= exception %></p>
<p><a href="hello.jsp">Back to home</a></p>
</body>
</html>`
  },

  ica1_elements: {
    title: "ICA-1 A — E-commerce product pricing engine",
    file: "product_pricing.jsp",
    level: "ICA-1",
    industry: "E-commerce (Amazon / Flipkart pricing module)",
    problem: "Warehouse team enters unit price and discount %. System must compute discount amount, GST 18%, and net payable using JSP elements.",
    solution: "Declaration holds GST rate and calc methods; scriptlet reads URL params; expressions print the price breakdown.",
    params: [
      { name: "price", label: "price", value: "999" },
      { name: "discount", label: "discount %", value: "15" }
    ],
    jsp: `<%@ page language="java" contentType="text/html" info="E-commerce Pricing Engine" %>
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
</html>`
  },

  ica1_datetime: {
    title: "ICA-1 B — Sales growth forecast report",
    file: "sales_forecast.jsp",
    level: "ICA-1",
    industry: "Business Analytics (sales dashboard)",
    problem: "Sales manager needs a monthly revenue growth series printed on the server with today's date for the quarterly board report.",
    solution: "page directive imports Date; scriptlet loop builds compound growth; expression prints timestamp.",
    params: [{ name: "months", label: "months", value: "6" }],
    jsp: `<%@ page language="java" import="java.util.Date" contentType="text/html" %>
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
  out.println("<table border='1' cellpadding='6'><tr><th>Month</th><th>Revenue (Rs.)</th></tr>");
  for (m = 1; m <= months; m++) {
    revenue = revenue * growth;
    out.println("<tr><td>Month " + m + "</td><td>" + (int) revenue + "</td></tr>");
  }
  out.println("</table>");
%>
<p>Assumption: 8% month-on-month growth from base Rs. 1,00,000</p>
</body>
</html>`
  },

  ica2_register: {
    title: "ICA-2 A — HR employee onboarding",
    file: "employee_register.jsp",
    level: "ICA-2",
    industry: "HR Management System (TCS / Infosys onboarding)",
    problem: "New employee data arrives via URL from the recruitment portal. Store profile in session and increment company-wide hire counter in application scope.",
    solution: "request.getParameter reads empId, name, dept; session stores employee; application tracks totalHires.",
    params: [
      { name: "empId", label: "empId", value: "E1024" },
      { name: "name", label: "name", value: "Rahul Deshmukh" },
      { name: "dept", label: "dept", value: "IT" }
    ],
    jsp: `<%@ page language="java" session="true" contentType="text/html" %>
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
    Integer hires = application.getAttribute("totalHires");
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

  ica2_profile: {
    title: "ICA-2 B — Employee self-service dashboard",
    file: "employee_dashboard.jsp",
    level: "ICA-2",
    industry: "Employee portal (intranet dashboard)",
    problem: "After onboarding, employee opens dashboard without re-entering credentials. Session must recall stored profile.",
    solution: "Read empId, empName, dept from session. No URL parameters needed after registration.",
    params: [],
    jsp: `<%@ page language="java" session="true" contentType="text/html" %>
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
  },

  ica3_cart: {
    title: "ICA-3 A — E-commerce shopping cart",
    file: "shop_cart.jsp",
    level: "ICA-3",
    industry: "E-commerce checkout (Myntra / Amazon cart)",
    problem: "Customer adds SKU to cart via URL. Cart bean stores item, price, qty in session and computes line total.",
    solution: "jsp:useBean + setProperty from URL params; scriptlet calculates bill; jsp:include for site navigation.",
    params: [
      { name: "sku", label: "sku", value: "BOOK101" },
      { name: "price", label: "price", value: "450" },
      { name: "qty", label: "qty", value: "2" }
    ],
    files: {
      "cart_nav.jsp": "<div style='margin-top:12px;padding:8px;background:#0f2744;color:#fff;border-radius:8px;'>Home | Cart | Checkout | Support</div>"
    },
    jsp: `<%@ page language="java" contentType="text/html" %>
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

  ica3_bill: {
    title: "ICA-3 B — GST tax invoice",
    file: "shop_invoice.jsp",
    level: "ICA-3",
    industry: "Billing system (GST invoice generation)",
    problem: "After cart checkout, billing module reads session bill and generates GST invoice with static header include.",
    solution: "Static include for company header; session reads bill amount; computes CGST+SGST 18%.",
    params: [],
    files: {
      "invoice_header.jsp": "<div style='padding:8px;background:#fff3d6;border-radius:8px;'><b>ShopMart Tax Invoice</b> | GSTIN: 27AABCU9603R1ZM</div>"
    },
    jsp: `<%@ page language="java" contentType="text/html" %>
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
</html>`
  },

  ica4_result: {
    title: "ICA-4 A — Insurance premium calculator",
    file: "insurance_premium.jsp",
    level: "ICA-4",
    industry: "Insurance (LIC / HDFC Life premium engine)",
    problem: "Agent enters age, sum assured, term via URL. Invalid input must forward to a professional error page, not a stack trace.",
    solution: "errorPage forwards parse/validation errors; scriptlet computes annual premium from industry formula.",
    params: [
      { name: "age", label: "age", value: "35" },
      { name: "sum", label: "sum assured", value: "500000" },
      { name: "term", label: "term (years)", value: "20" }
    ],
    files: {
      "error.jsp": `<%@ page isErrorPage="true" contentType="text/html" %>
<html><body style="font-family:sans-serif">
<h3 style="color:#c0392b">Insurance Premium — Error</h3>
<p>We could not calculate your premium. Please check age, sum assured and term.</p>
<p><b>Technical:</b> <%= exception %></p>
<p><a href="insurance_premium.jsp?age=35&sum=500000&term=20">Try sample values</a></p>
</body></html>`
    },
    jsp: `<%@ page language="java" errorPage="error.jsp" contentType="text/html" %>
<html>
<head><title>Insurance Premium</title></head>
<body>
<h2>Industry Problem: Life Insurance Premium Calculator</h2>
<p><b>Company:</b> SecureLife Insurance</p>
<%
  int age = Integer.parseInt(request.getParameter("age"));
  int sum = Integer.parseInt(request.getParameter("sum"));
  int term = Integer.parseInt(request.getParameter("term"));
  if (age < 18 || age > 65) throw new Exception("Age must be between 18 and 65");
  if (sum <= 0 || term <= 0) throw new Exception("Sum assured and term must be positive");
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

  ica4_bank: {
    title: "ICA-4 B — ATM cash withdrawal system",
    file: "atm_withdraw.jsp",
    level: "ICA-4",
    industry: "Core banking (ATM transaction processing)",
    problem: "Customer withdraws cash via URL-simulated ATM request. System must reject invalid amount, insufficient balance, and show clear business error messages.",
    solution: "try-catch in scriptlet enforces banking rules without exposing stack trace to customer.",
    params: [
      { name: "balance", label: "balance", value: "5000" },
      { name: "amount", label: "amount", value: "12000" }
    ],
    jsp: `<%@ page language="java" contentType="text/html" %>
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
</html>`
  },

  real_login_portal: {
    title: "Real app — college login portal",
    file: "portal.jsp",
    level: "Real-life",
    desc: "Pattern used by result portals and ERP: validate → session → role home.",
    params: [
      { name: "userid", label: "userid", value: "21IT045" },
      { name: "pwd", label: "pwd", value: "wit@123" }
    ],
    jsp: `<%@ page language="java" session="true" %>
<html>
<body>
<%
  String id = request.getParameter("userid");
  String pwd = request.getParameter("pwd");
  if (id != null && pwd != null && pwd.equals("wit@123")) {
    session.setAttribute("userid", id);
    out.println("<h2>ERP Dashboard</h2>");
    out.println("<p>PRN: " + id + "</p>");
    out.println("<p>Modules: Attendance | ICA | Feedback | Hall ticket</p>");
  } else {
    out.println("<h2>Login failed</h2>");
    out.println("<p>Use any userid and password wit@123 for this demo.</p>");
  }
%>
</body>
</html>`
  }
};

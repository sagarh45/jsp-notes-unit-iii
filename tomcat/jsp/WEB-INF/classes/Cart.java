public class Cart implements java.io.Serializable {
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
}
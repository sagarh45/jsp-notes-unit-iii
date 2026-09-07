public class Student implements java.io.Serializable {
  private String name;
  private int marks;

  public Student() {}

  public String getName() { return name; }
  public void setName(String name) { this.name = name; }

  public int getMarks() { return marks; }
  public void setMarks(int marks) { this.marks = marks; }
}
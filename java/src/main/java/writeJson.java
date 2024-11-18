import org.json.JSONStringer;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Objects;

public class writeJson {
    public static void write(Object input, String operation)
    {
        try
        {
            System.out.println(JSONStringer.valueToString(input));
            FileWriter file = new FileWriter("java/src/main/resources/output.json");
            if (input == null)
            {
                file.write("null");
            }
            else if(Objects.equals(operation, "w"))
                file.write(JSONStringer.valueToString(input));
            else if(Objects.equals(operation, "a"))
                file.append(JSONStringer.valueToString(input));
            else{
                System.out.println("Not writing.");
                file.close();
                return;
            }
            file.close();
        }
        catch (IOException e)
        {
            System.out.println(e.getMessage());
        }
}
}

import org.json.JSONStringer;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Objects;

public class writeJSON {
    public static void write(Object input, String operation)
    {

        try
        {

            FileWriter file = new FileWriter("java/src/main/resources/output.json");
            if (input == null)
            {
                file.write("null");
            }
            else if(Objects.equals(operation, "w"))
                file.write(JSONStringer.valueToString(input));
            else
                file.append(JSONStringer.valueToString(input));
            file.close();
        }
        catch (IOException e)
        {
            System.out.println(e.getMessage());
        }
}
}

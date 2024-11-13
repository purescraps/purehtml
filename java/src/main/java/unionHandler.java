import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class unionHandler {
    public static void apply(String html, ConfigSchema config) throws IOException {
        List<Object> jsonList = new ArrayList<>();
        List<ConfigSchema> unions = config.getUnion();
        int opt = 0;
        int counter = 1;
        for (ConfigSchema union: unions)
        {
            if(!genericHandler.apply(html, union).isEmpty())
            {
                opt=1;
                jsonList.add(genericHandler.apply(html, union));
            }
            else {
                continue;
            }
            if(unions.size() == counter)
            {
                System.out.println("Last Iteration");
                if(union.getConstant() != null)
                    writeJSON.write(union.getConstant(),"w");
                return;
            }
            counter++;
        }
        if (opt==0)
        {
            writeJSON.write(null, "w");
        }
    }
}

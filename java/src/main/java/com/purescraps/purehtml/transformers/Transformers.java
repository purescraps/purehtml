package com.purescraps.purehtml.transformers;

import java.util.Arrays;
import java.util.List;

import com.purescraps.purehtml.transformers.types.*;

public class Transformers {

    // List of transformer classes
    private static final List<Class<?>> transformers = Arrays.asList(
            AttributeTransformer.class,
            BooleanTransformer.class,
            CapitalizeTransformer.class,
            ExistsTransformer.class,
            HTMLTransformer.class,
            JoinTransformer.class,
            JSONTransformer.class,
            LengthTransformer.class,
            LowerTransformer.class,
            NumberTransformer.class,
            RemoveLastPathSectionTransformer.class,
            RemoveUrlQueryParamTransformer.class,
            ReplaceTransformer.class,
            ResolveTransformer.class,
            SplitTransformer.class,
            UpperTransformer.class,
            UrlQueryParamTransformer.class,
            TrimTransformer.class);

    public static Transformer getByName(String name) {
        // Search through the transformer classes
        for (Class<?> transformerClass : transformers) {
            try {
                // Attempt to create an instance and check if it has the matching name
                Transformer transformer = (Transformer) transformerClass.getDeclaredConstructor().newInstance();
                if (transformer.getName().equals(name)) {
                    return transformer;
                }
            } catch (Exception e) {
                System.out.println(e.getMessage());
            }
        }
        return null; // Return null if no matching transformer is found
    }
}

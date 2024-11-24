package com.purescraps.purehtml;
import com.purescraps.purehtml.configs.Config;
import com.purescraps.purehtml.configs.ConfigFactory;

public class Main {

    public static void main(String[] args) {
        String yaml =
      """
selector: '#course-details'
type: object
properties:
  # if no other selector was provided, transformers will be executed
  # on the parent element
  courseId: { transform: [attr(data-course-id), number] }
  title: { selector: h1, transform: [trim] }
""";
        String html =
                """
<div id="course-details" data-course-id="9999">
  introduction and table-of-contents of the course...
  <h1>
    Web Scraping Fundamentals
  </h1>
</div>
      """;

        Config config = ConfigFactory.fromYAML(yaml);
        PureHTML.extract(config, html, yaml);
    }
}
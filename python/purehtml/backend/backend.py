from bs4 import BeautifulSoup


class BeautifulSoupBackend:
    """
    A backend implementation using BeautifulSoup.
    """

    @staticmethod
    def load(html):
        """
        Load an HTML string or buffer into a PureHTMLBeautifulSoupDocument.
        """
        return PureHTMLDocument(BeautifulSoup(html, "html5lib"))


class PureHTMLDocument:
    """
    A document implementation using BeautifulSoup.
    """

    def __init__(self, soup):
        self._soup = soup

    def select(self, selector):
        """
        Select elements based on a CSS selector and wrap them in PureHTMLBeautifulSoupNode objects.
        """
        elements = self._soup.select(selector)
        return [PureHTMLNode(self._soup, el) for el in elements]

    def root(self):
        """
        Return the root element of the document.
        """
        return PureHTMLNode(self._soup, self._soup)


class PureHTMLNode:
    """
    A node implementation using BeautifulSoup.
    """

    def __init__(self, soup, element):
        self._soup = soup
        self._element = element

    def attr(self, name=None):
        """
        Get an attribute or all attributes of the node.
        """
        if name:
            return self._element.get(name, None)
        return self._element.attrs

    def find(self, selector):
        """
        Find child elements based on a CSS selector and wrap them in PureHTMLBeautifulSoupNode objects.
        """
        # If `self._element` is the root, use it globally
        if self._element == self._soup:
            elements = self._soup.select(selector)
        else:
            # Otherwise, restrict to children
            elements = self._element.select(selector)
        return [PureHTMLNode(self._soup, el) for el in elements]

    def html(self):
        """
        Get the HTML content of the node.
        """
        return self._element.decode_contents()

    def is_selector(self, selector):
        """
        Check if the node matches the selector.
        """
        matched_elements = self._soup.select(
            selector
        )  # Store the matched elements in a variable
        return (
                self._element in matched_elements
        )  # Check if current element is in the matched list

    def text(self):
        """
        Get the text content of the node.
        """
        return self._element.get_text()

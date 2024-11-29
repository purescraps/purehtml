# setup.py

from setuptools import setup, find_packages

setup(
    name="PureHTML",
    version="0.1",
    packages=find_packages(),
    install_requires=[
        'beautifulsoup4',  # For bs4
        'PyYAML',  # For yaml
    ],
    author="Onur C. Güven",
    author_email="onurcguven09@gmail.com",
    description="HTML Parser using configurations",
    long_description=open("README.md").read(),
    long_description_content_type="text/markdown",  # If using markdown in README
    url="https://github.com/purescraps/purehtml",  # URL to the project
    classifiers=[  # Optional metadata
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    python_requires='>=3.10',  # Minimum Python version
)

# setup.py

from setuptools import find_packages
from setuptools import setup

setup(
    name="PureHTML",
    version="0.1.0",
    packages=find_packages(where="python"),
    package_dir={"": "python"},
    include_package_data=True,
    data_files=[("", ["README.md", "LICENSE", "requirements.txt"])],
    install_requires=[
        'beautifulsoup4',  # For bs4
        'PyYAML',  # For yaml
        'jsonschema',  # For schema validation
    ],
    author="Onur C. Güven",
    author_email="onurcguven09@gmail.com",
    description="HTML Parser using configurations",
    long_description=open("README.md").read(),
    long_description_content_type="text/markdown",
    url="https://github.com/purescraps/purehtml",
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    setup_requires=[
        'setuptools',
    ],
    python_requires='>=3.10',
)

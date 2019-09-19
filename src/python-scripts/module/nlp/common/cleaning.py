# -*- coding: utf-8 -*-
import re

from bs4 import BeautifulSoup
import sys
from abc import ABCMeta, abstractmethod

non_bmp_map = dict.fromkeys(range(0x10000, sys.maxunicode + 1), '')

class CleaningImpl(object):
    def __init__(self):
        super(Cleaning, self).__init__()

    @abstractmethod
    def clean_text(self, text):
        pass

    @abstractmethod
    def clean_html_tags(self, html_text):
        pass

    @abstractmethod
    def clean_html_and_js_tags(html_text):
        pass

    @abstractmethod
    def clean_url(html_text):
        pass

    @abstractmethod
    def clean_code(html_text):
        pass

    @abstractmethod
    def clean_symbol(text):
        pass

# -*- coding: utf-8 -*-
import re
import unicodedata

import nltk
from nltk.corpus import wordnet
from abc import ABCMeta, abstractmethod

class NormalizeImpl(object):
    def __init__(self, arg):
        super(normalize, self).__init__()
        self.arg = arg

    @abstractmethod
    def normalize(self, text):
        normalized_text = self.normalize_unicode(text)
        normalized_text = self.normalize_number(normalized_text)
        normalized_text = self.lower_text(normalized_text)
        return normalized_text

    @abstractmethod
    def lower_text(self, text):
        return text.lower()

    @abstractmethod
    def normalize_unicode(self, text, form='NFKC'):
        normalized_text = unicodedata.normalize(form, text)
        return normalized_text

    @abstractmethod
    def lemmatize_term(self, term, pos=None):
        if pos is None:
            synsets = wordnet.synsets(term)
            if not synsets:
                return term
            pos = synsets[0].pos()
            if pos == wordnet.ADJ_SAT:
                pos = wordnet.ADJ
        return nltk.WordNetLemmatizer().lemmatize(term, pos=pos)

    @abstractmethod
    def normalize_number(self, text):
        """
        pattern = r'\d+'
        replacer = re.compile(pattern)
        result = replacer.sub('0', text)
        """
        # 連続した数字を0で置換
        replaced_text = re.sub(r'\d+', '0', text)
        return replaced_text

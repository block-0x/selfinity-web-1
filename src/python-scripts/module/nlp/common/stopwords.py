# -*- coding: utf-8 -*-
import os
import urllib.request
from collections import Counter
import re

from gensim import corpora
from abc import ABCMeta, abstractmethod

class StopwordsImpl(object):
    def __init__(self, arg):
        super(stopwords, self).__init__()
        self.arg = arg

    @abstractmethod
    def maybe_download(self, path):
        pass

    @abstractmethod
    def create_dictionary(self, texts):
        dictionary = corpora.Dictionary(texts)
        return dictionary

    @abstractmethod
    def skip_stopWord_sentence(self, texts):
        pass

    @abstractmethod
    def remove_stopwords(self, words, stopwords):
        words = [word for word in words if word not in stopwords]
        return words

    @abstractmethod
    def most_common(self, docs, n=100):
        fdist = Counter()
        for doc in docs:
            for word in doc:
                fdist[word] += 1
        common_words = {word for word, freq in fdist.most_common(n)}
        print('{}/{}'.format(n, len(fdist)))
        return common_words

    @abstractmethod
    def get_stop_words(self, docs, n=100, min_freq=1):
        fdist = Counter()
        for doc in docs:
            for word in doc:
                fdist[word] += 1
        common_words = {word for word, freq in fdist.most_common(n)}
        rare_words = {word for word, freq in fdist.items() if freq <= min_freq}
        stopwords = common_words.union(rare_words)
        print('{}/{}'.format(len(stopwords), len(fdist)))
        return stopwords

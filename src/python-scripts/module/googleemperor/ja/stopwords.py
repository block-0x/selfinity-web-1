# -*- coding: utf-8 -*-
import os
import urllib.request
from collections import Counter
import re

from gensim import corpora


def maybe_download(path):
    url = 'http://svn.sourceforge.jp/svnroot/slothlib/CSharp/Version1/SlothLib/NLP/Filter/StopWord/word/Japanese.txt'
    if os.path.exists(path):
        print('File already exists.')
    else:
        print('Downloading...')
        # Download the file from `url` and save it locally under `file_name`:
        urllib.request.urlretrieve(url, path)


def create_dictionary(texts):
    dictionary = corpora.Dictionary(texts)
    return dictionary

def skip_stopWord_sentence(texts):
    f = open("util/ja_stopWord.txt")
    datum = f.read()
    f.close()
    datum = datum.split('\n')
    for data in datum:
        for text in texts:
            if data in text:
                texts.remove(text)
    return texts

def remove_stopwords(words, stopwords):
    words = [word for word in words if word not in stopwords]
    return words


def most_common(docs, n=100):
    fdist = Counter()
    for doc in docs:
        for word in doc:
            fdist[word] += 1
    common_words = {word for word, freq in fdist.most_common(n)}
    print('{}/{}'.format(n, len(fdist)))
    return common_words


def get_stop_words(docs, n=100, min_freq=1):
    fdist = Counter()
    for doc in docs:
        for word in doc:
            fdist[word] += 1
    common_words = {word for word, freq in fdist.most_common(n)}
    rare_words = {word for word, freq in fdist.items() if freq <= min_freq}
    stopwords = common_words.union(rare_words)
    print('{}/{}'.format(len(stopwords), len(fdist)))
    return stopwords

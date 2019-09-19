# -*- coding: utf-8 -*-
import gensim
import MeCab
import numpy as np

from abc import ABCMeta, abstractmethod

class WordEmbeddingsImpl(object):

    @abstractmethod
    def __init__(self):
        super(WordEmbeddingsImpl, self).__init__()

    @abstractmethod
    def train_word_embeddings(self, sentences, save_path, **params):
        model = gensim.models.Word2Vec(sentences, **params)
        model.save(save_path)
        self._model = model

    @abstractmethod
    def load_word_embeddings(self, path):
        model = gensim.models.word2vec.Word2Vec.load(path)
        self._model = model

    @abstractmethod
    def get_word_vector(self, term):
        try:
            vector = self._model.wv[term]
        except KeyError:
            raise KeyError("Term doesn't exists.")
        return vector

    @abstractmethod
    def get_vector(self, text):
        pass

    @abstractmethod
    def cos_sim(self, v1, v2):
        return np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2))

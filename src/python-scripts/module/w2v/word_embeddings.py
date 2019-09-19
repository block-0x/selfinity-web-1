# -*- coding: utf-8 -*-
import gensim
import MeCab
import numpy as np
from cabocha.analyzer import CaboChaAnalyzer
from cabocha.analyzer import EndOfLinkException

class WordEmbeddings(object):

    def __init__(self):
        self._model = None
        self.size = 50
        self.analyzer = CaboChaAnalyzer()

    def train_word_embeddings(self, sentences, save_path, **params):  # paramsが空だとエラーが起きるっぽい
        model = gensim.models.Word2Vec(sentences, **params)
        model.save(save_path)
        self._model = model

    def load_word_embeddings(self, path):
        model = gensim.models.word2vec.Word2Vec.load(path)
        self._model = model

    def get_word_vector(self, term):
        try:
            vector = self._model.wv[term]
        except KeyError:
            raise KeyError("Term doesn't exists.")
        return vector

    def get_vec(self, text):
        mt = MeCab.Tagger('')
        mt.parse('')
        sum_vec = np.zeros(self.size)
        word_count = 0
        node = mt.parseToNode(text)
        while node:
            fields = node.feature.split(",")
            # 限定
            if fields[0] == '名詞' or fields[0] == '動詞' or fields[0] == '形容詞':
                try:
                    sum_vec += self._model.wv[node.surface]
                except:
                    pass
                word_count += 1
            node = node.next
        return sum_vec / word_count

    def get_vector(self, text):
        if text == '' or text is None:
            return np.zeros(self.size)
        tree = self.analyzer.parse(text)
        sum_vec = np.zeros(self.size)
        word_count = 0
        for chunk in tree:
            for token in chunk:
                if token.pos == '名詞' or token.pos == '動詞' or token.pos == '形容詞':
                    try:
                        sum_vec += self._model.wv[token.surface]
                    except:
                        pass
                    word_count += 1
        return (sum_vec / word_count)

    def get_vectors(self, text_array):
        return np.sum(self.get_vector(text) for text in text_array)

    def cos_sim(self, v1, v2):
        return np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2))

    def get_most_similar_word(self, word):
        try:
            results = self._model.wv.most_similar(positive=[word])
            return [word for word, result in results]
        except:
            return []

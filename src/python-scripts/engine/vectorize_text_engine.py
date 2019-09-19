# -*- coding: utf-8 -*-
from engine.engine import Engine
import asyncio
import re
import MeCab
import numpy as np
from collections import defaultdict
from module.w2v.word_embeddings import WordEmbeddings
import os
from datetime import datetime

class VectorizeTextEngine(Engine):
    def __init__(self, builder, model_path=None, save_path=None):
        super().__init__(builder)
        model_path = self.get_models_paths()[0] if model_path is None else model_path
        save_path = self.get_save_path() if save_path is None else save_path
        self.wordEmbedding = WordEmbeddings()
        self.wordEmbedding.load_word_embeddings(model_path)

    def get_models_paths(self):
        return [
        "{0}/src/python-scripts/util/word2vec.gensim.model".format(os.getcwd()),
         "{0}/src/python-scripts/util/w2v-min_count_10_window_1_workers_4_size_150.model".format(os.getcwd()),
        "{0}/src/python-scripts/util/w2v-min_count_10_window_3_workers_4_size_150.model",
        "{0}/src/python-scripts/util/w2v-min_count_10_window_5_workers_4_size_150.model".format(os.getcwd()),
        "{0}/src/python-scripts/util/w2v-min_count_10_window_7_workers_4_size_150.model".format(os.getcwd()),
        "{0}/src/python-scripts/util/w2v-min_count_10_window_10_workers_4_size_150.model".format(os.getcwd()),
        "{0}/src/python-scripts/util/w2v-min_count_10_window_5_workers_4_size_100.model".format(os.getcwd()),
        "{0}/src/python-scripts/util/w2v-min_count_10_window_5_workers_4_size_50.model".format(os.getcwd()),
        "{0}/src/python-scripts/util/w2v-min_count_10_window_1_workers_4_size_10.model".format(os.getcwd()),
        "{0}/src/python-scripts/util/w2v-min_count_10_window_5_workers_4_size_10.model".format(os.getcwd())
        ]

    def get_save_path(self):
        return "{0}/src/python-scripts/util/selfinity_{1}.model".format(os.getcwd(), datetime.now().strftime("%Y%m%d%H%M%S"))

    def inject(self, builder):
        super().inject(builder)

    def run(self, sentences):
        return [self.wordEmbedding.get_vectors(sentence) for index, sentence in enumerate(sentences)]

    def get_most_similar_word(self, word, limit=10):
        return self.wordEmbedding.get_most_similar_word(word)

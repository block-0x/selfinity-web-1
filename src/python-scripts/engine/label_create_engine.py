# -*- coding: utf-8 -*-
from math import sqrt
from engine.engine import Engine
import asyncio
import re
import MeCab
import numpy as np
from math import sqrt
import requests
from bs4 import BeautifulSoup
from janome.tokenizer import Tokenizer
import termextract.mecab
import termextract.core
import collections
from module.w2v.word_embeddings import WordEmbeddings
from .vectorize_text_engine import VectorizeTextEngine

class LabelCreateEngine(VectorizeTextEngine):
    def __init__(self, builder):
        super().__init__(builder)

    def inject(self, builder):
        super().inject(builder)

    def run(self, contents):
        try:
            return { content.id : { term : self.generateSimilarWords(term) for term in self.generateTerm(content.title + " " + content.pure_body)} for content in contents.items}
        except:
            return { content.id : {} for content in contents.items}

    def generateTerm(self, sentence, limit=10):
        parser = MeCab.Tagger()
        analyzed = parser.parse(sentence)
        frequency = termextract.mecab.cmp_noun_dict(analyzed)
        LR = termextract.core.score_lr(frequency,
                                       ignore_words=termextract.mecab.IGNORE_WORDS,
                                       lr_mode=1, average_rate=1
                                       )
        term_imp = termextract.core.term_importance(frequency, LR)
        data_collection = collections.Counter(term_imp)
        #         for cmp_noun, value in data_collection.most_common():
        #             print(termextract.core.modify_agglutinative_lang(cmp_noun), value, sep="\t")
        return [termextract.core.modify_agglutinative_lang(cmp_noun) for cmp_noun, value in
                data_collection.most_common()][:limit]

    def generateSimilarWords(self, word, limit=10):
        return super().get_most_similar_word(word, limit)



# -*- coding: utf-8 -*-
from math import sqrt
from engine.engine import Engine
import asyncio
import re
import MeCab
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
# from __future__ import absolute_import, unicode_literals
from collections import defaultdict
from math import sqrt
import requests
from bs4 import BeautifulSoup
from janome.tokenizer import Tokenizer
import nltk

class ContentBasedRecommendEngine(Engine):
    def __init__(self, builder):
        super().__init__(builder)

    def inject(self, builder):
        super().inject(builder)

    def run(self, contents, target_content):
        tfidfs = [self.gen(content.pure_body) for content in contents if content.body != '' ]
        target_tfidf = self.gen(target_content.pure_body)
        results = { target_tfidf : self.similarity(target_tfidf, tfidf) for tfidf in tfidfs }
        return sorted(results.items(), key=lambda x: x[1], reverse=True)


    # def route(self, content):

    def gen(self, text, enable_one_char=False):
        """
        Get TF-IDF
        :param text: str
        :rtype :list[list[str, float]]
        """
        _text = self.filter(text)
        return self.analysis(_text, enable_one_char=enable_one_char)


    def gen_web(self, url, enable_one_char=False):
        """
        Get TF-IDF from url
        :param url: str
        :rtype: list[list[str, float]]
        """
        # HTTP GET
        response = requests.get(url)

        # filter HTTP Tag
        soup = BeautifulSoup(response.text, "lxml")
        text = soup.title.name + soup.get_text()
        return self.gen(text, enable_one_char=enable_one_char)


    def similarity(self, tfidf1, tfidf2):
        """
        Get TF-IDF and Cosine Similarity
        cosθ = A・B/|A||B|
        :param tfidf1: list[list[str, float]]
        :param tfidf2: list[list[str, float]]
        :rtype : float
        """
        tfidf2_dict = {key: value for key, value in tfidf2}

        ab = sum(float(value * tfidf2_dict.get(key)) for key, value in tfidf1 if tfidf2_dict.get(key))

        # |A| and |B|
        a = sqrt(sum([v ** 2 for k, v in tfidf1]))
        b = sqrt(sum([v ** 2 for k, v in tfidf2]))

        return float(ab / (a * b))


    def some_similarity(self, base_url, data):
        """
        :param base_url: str
        :param data: list[lost[str, str]]
        :rtype : list[lost[str, str, float]]
        """
        base_tfidf = self.gen_web(base_url)
        return [[title, url, self.similarity(base_tfidf, self.gen_web(url))] for title, url in data]


    def analysis(self, text, enable_one_char):
        """
        Calc TF-IDF
        textを形態素解析して名詞の数を返却(Morphological Analysis)
        :param text: str
        :rtype : dict{str: int}
        """
        result = defaultdict(int)
        result2 = {}
        count = 0
        t = self._get_tokenizer()

        # 形態素解析
        for token in t.tokenize(text):
            if '名詞' not in token.part_of_speech:
                continue
            count += 1

            if '非自立' in token.part_of_speech:
                continue

            if '接尾' in token.part_of_speech:
                continue

            if '数' in token.part_of_speech:
                continue

            if not enable_one_char:
                if len(token.surface) == 1:
                    continue

            result[token.surface] += 1
            result2[token.surface] = token

        # TF-IDF計算
        result3 = []
        for key in result:
            result3.append([key, result[key]])

        result3.sort(key=lambda x: x[1], reverse=True)
        result4 = []
        for r in result3[:100]:
            # print r[0], float(float(r[1])/float(count)), result2[r[0]]
            result4.append([str(r[0]), float(float(r[1])/float(count))])
        return result4


    def filter(self, text):
        """
        textをフィルターしてノイズを排除する
        :param text: str
        :rtype : str
        """
        # アルファベットと半角英数と改行とタブを排除
        text = re.sub(r'[a-zA-Z0-9¥"¥.¥,¥@]+', '', text)
        text = re.sub(r'[!"“#$%&()\*\+\-\.,\/:;<=>?@\[\\\]^_`{|}~]', '', text)
        text = re.sub(r'[\n|\r|\t|年|月|日]', '', text)

        # 日本語以外の文字を排除(韓国語とか中国語とかヘブライ語とか)
        jp_chartype_tokenizer = nltk.RegexpTokenizer(u'([ぁ-んー]+|[ァ-ンー]+|[\u4e00-\u9FFF]+|[ぁ-んァ-ンー\u4e00-\u9FFF]+)')
        text = "".join(jp_chartype_tokenizer.tokenize(text))
        return text


    def _get_tokenizer(self):
        if self._t is not None:
            return self._t
        self._t = Tokenizer()
        return self._t

    # @asyncio.coroutine
    # async def similarity(self, tfidf1, tfidf2):
    #     """
    #     Get Cosine Similarity
    #     cosθ = A・B/|A||B|
    #     :param tfidf1: list[list[str, float]]
    #     :param tfidf2: list[list[str, float]]
    #     :rtype : float
    #     """
    #     tfidf2_dict = await {key: value for key, value in tfidf2}

    #     ab = await sum(float(value * tfidf2_dict.get(key)) for key, value in tfidf1 if tfidf2_dict.get(key))

    #     # |A| and |B|
    #     a = await sqrt(sum([v ** 2 for k, v in tfidf1]))
    #     b = await sqrt(sum([v ** 2 for k, v in tfidf2]))

    #     return await float(ab / (a * b))


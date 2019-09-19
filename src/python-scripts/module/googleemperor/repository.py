import re
import numpy as np
from .nlp.ja.word_vector import WordEmbeddings
# from googleemperor import googleemperor
import pandas as pd
import csv
from .scraping import googleScraping
import termextract.mecab
import termextract.core
import collections
import asyncio
import tornado.ioloop
from tornado.iostream import IOStream
import uuid
from datetime import datetime
import MeCab
from enum import Enum

class Crawler(object):
    def __init__(self):
        self.uid = str(uuid.uuid4())
        self.keyword = ""
        self.url = ""
        self.article = ""
        self.causals = []
        self.createdAt = datetime.now().strftime("%Y/%m/%d %H:%M:%S")
        self.updatedAt = datetime.now().strftime("%Y/%m/%d %H:%M:%S")

class Relation(Enum):
    cause = 0
    goal = 1
    equal = 2
    specific = 3
    abstract = 4

    def toJson(self):
        if self == Relation.cause:
            return "cause"
        elif self == Relation.goal:
            return "goal"
        elif self == Relation.equal:
            return "equal"
        elif self == Relation.specific:
            return "specific"
        elif self == Relation.abstract:
            return "abstract"

    def toJaKeyword(self):
        if self == Relation.cause:
            return "なぜ"
        elif self == Relation.goal:
            return "どうやって"
        elif self == Relation.equal:
            return "とは"
        elif self == Relation.specific:
            return ""
        elif self == Relation.abstract:
            return ""


class Repository(object):
    def __init__(self):
        self.save_path = "util/causal.model"
        self.keyword = ""
        self.searcher = googleScraping.google_search
        self.scraper = googleScraping.getMainJAText

    def routineCrawle(self, init_keyword, limit=3, per_limit=20):
        keywords = []
        for i in range(limit):
            print("Epoch:" + str(i + 1))
            if i == 0:
                print("Epoch of search: init" + "\n" + "Keyword: " + init_keyword)
                crawlers = self.syncCrawle(init_keyword, limit=per_limit)
            else:
                crawlers = []
                ex_crawlers = crawlers.extend
                for index, keyword in enumerate(keywords):
                    print("Epoch of search: " + str(index + 1) + " / " + str(
                        len(keywords)) + "\n" + "Keyword: " + keyword)
                    gcrawlers = self.syncCrawle(keyword)
                    self.setCrawlerData(gcrawlers)
                    ex_crawlers(gcrawlers)
            self.setCrawlerData(crawlers)
            print("Saved " + str(len(crawlers)) + " of crawlers")
            loop = asyncio.new_event_loop()
            keywords = loop.run_until_complete(self.generateKeyword(crawlers))
            print("Generated " + str(len(keywords)) + " of keywords")
            loop.close()

    @asyncio.coroutine
    async def generateCrawlerFromURL(self, url, keyword):
        await asyncio.sleep(1)
        text = self.scraper(url)
        crawler = Crawler()
        crawler.keyword = keyword
        crawler.url = url
        crawler.article = text
        print(url, "\n", text)
        return crawler

    @asyncio.coroutine
    async def routeCrawle(self, keyword, limit=10):
        try:
            await asyncio.sleep(1)
            urls = self.searcher(keyword)
        except:
            pass
        tasks = [self.generateCrawlerFromURL(url, keyword) for url in urls if url != ""]
        return await asyncio.gather(*tasks)

    def scraping(self, keyword):
        self.keyword = keyword
        crawlers = []
        try:
            urls = self.searcher(keyword)
        except:
            pass
        for url in urls:
            if url == "":
                break
            try:
                text = self.scraper(url)
                crawler = Crawler()
                crawler.keyword = keyword
                crawler.url = url
                crawler.article = text
                print(url, "\n", text)
                crawlers.append(crawler)
            except:
                return crawlers
        return crawlers

    def syncCrawle(self, keyword, limit=10):
        crawlers = []
        ex_crawlers = crawlers.extend
        loop = asyncio.new_event_loop()
        gcrawlers = loop.run_until_complete(self.routeCrawle(keyword, limit=limit))
        loop.close()
        ex_crawlers(gcrawlers)
        return crawlers

    def generateTerm(self, crawler, limit=5):
        parser = MeCab.Tagger()
        join = "".join
        sentence = join(article for i, article in enumerate(crawler.article) if i < 100)
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

    def termExtract(self, crawlers):
        values = []
        [values.extend(self.generateTerm(crawler)) for crawler in crawlers]
        return values

    @asyncio.coroutine
    async def generateKeyword(self, crawlers):
        save_keywords = pd.read_csv('util/crawlers_data.csv')['Keyword']
        await asyncio.sleep(1)
        values = list(set(self.termExtract(crawlers)))
        keywords = []
        for value in values:
            keywords.append(value + " " + Relation.cause.toJaKeyword())
            keywords.append(value + " " + Relation.goal.toJaKeyword())
            keywords.append(value + " " + Relation.equal.toJaKeyword())
        return list(set(keywords) - (set(keywords) & set(save_keywords)))

    def setListUid(self, proparties):
        uidList = ""
        for proparty in proparties:
            uidList += proparty.uid + "," if proparty != proparties[-1] else proparty.uid
        return uidList

    def setCrawlerData(self, crawlers):
        df = pd.read_csv('util/crawlers_data.csv')
        for crawler in crawlers:
            try:
                df = df.drop(df[df['Article'] == "".join(article + "。" for article in crawler.article)].index.tolist(),
                             axis=0)
                df = df.append(pd.Series(
                    [crawler.uid, crawler.keyword, crawler.url, "".join(article + "。" for article in crawler.article),
                     self.setListUid(crawler.causals), crawler.createdAt, crawler.updatedAt], index=df.columns),
                               ignore_index=True)
            except:
                df = df.append(pd.Series(
                    [crawler.uid, crawler.keyword, crawler.url, crawler.article, self.setListUid(crawler.causals),
                     crawler.createdAt, crawler.updatedAt], index=df.columns), ignore_index=True)
        df.to_csv('util/crawlers_data.csv', index=None)

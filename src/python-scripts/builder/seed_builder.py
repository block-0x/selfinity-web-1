from builder.recommend_builder import RecommendBuilder
from engine.engine import Engine
from engine.content_based_recommend_engine import ContentBasedRecommendEngine
from engine.user_score_based_recommend_engine import UserScoreBasedRecommendEngine
from engine.user_owned_based_recommend_engine import UserOwnedBasedRecommendEngine
from engine.vectorize_text_engine import VectorizeTextEngine
from engine.label_create_engine import LabelCreateEngine
from models.content import Content, Contents
from models.label import Label, Labels
import pandas as pd
import random
import os
import sys
from module.nlp.ja.cleaning import clean_symbol

class SeedBuilder(RecommendBuilder):
    def __init__(self, file_name="crawlers_data"):
        super().__init__()
        self.file_path = "/Users/apple/projects/selfinity-web/src/python-scripts/util/{0}.csv".format(file_name);

    def get_sentence_from_corpus(self, limit=100, min_text_length=10, max_text_length=200):
        df = pd.read_csv(self.file_path).dropna(subset=['Article'])
        sentences = df['Article'].tolist()
        keywords = df['Keyword'].tolist()
        try:
            return random.sample({ keywords[index].replace(' ', '') : clean_symbol(sentence[:max_text_length]) for index, sentence in enumerate(sentences) if len(sentence) > int(min_text_length) }, int(limit))
        except:
            return { keywords[index].replace(' ', '') : clean_symbol(sentence[:max_text_length]) for index, sentence in enumerate(sentences) if len(sentence) > int(min_text_length) }

    def label_create(self, contents):
        for index, content in enumerate(contents):
            content.id = index + 1
        return super().label_create(contents)

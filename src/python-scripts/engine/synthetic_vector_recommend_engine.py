# -*- coding: utf-8 -*-
from math import sqrt
from engine.engine import Engine
import asyncio
import re
import MeCab
from math import sqrt
import requests
from module.w2v.word_embeddings import WordEmbeddings
from engine.vectorize_text_engine import VectorizeTextEngine

class SyntheticVectorRecommendEngine(VectorizeTextEngine):
    def __init__(self, builder, model_path=None, save_path=None):
        super().__init__(builder, model_path, save_path)

    def inject(self, builder):
        super().inject(builder)

    def run(self, vectors, target_vector):
        if len(vectors) == 0 or len(target_vector.vector) == 0:
            return []
        similiarities = { vector : self.wordEmbedding.cos_sim(target_vector.vector, vector.vector) for i, vector in enumerate(vectors) if len(vector.vector) > 0 }
        return { k: v for k, v in sorted(similiarities.items(), key=lambda x: -x[1]) }

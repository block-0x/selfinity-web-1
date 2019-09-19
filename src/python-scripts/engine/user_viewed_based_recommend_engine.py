# -*- coding: utf-8 -*-
from math import sqrt
from engine.engine import Engine
from collections import defaultdict

class UserViewedBasedRecommendEngine(Engine):
    def __init__(self, builder):
        super().__init__(builder)

    def inject(self, builder):
        super().inject(builder)

    def run(self, viewHistories, target_content):
        self.products = viewHistories.toSortArrayWithContent()
        self.target_product = self.products.get(target_content.id)
        if self.target_product == None:
            return { "contents": [{ "id": k } for k in self.products.keys()] }
        data = self.exec_jaccard()
        t_data = sorted(data.items(), key=lambda x: -x[1])
        return { "contents": [{ "id": k } for k, v in t_data if target_content.id != k] }

    def jaccard(self, e1, e2):
        """
        :param e1: list of int
        :param e2: list of int
        :rtype: float
        """
        set_e1 = set(e1)
        set_e2 = set(e2)
        return float(len(set_e1 & set_e2)) / float(len(set_e1 | set_e2))

    def Cooccurrence(self, e1, e2):
        overlap = list(set(e1) & set(e2[key]))
        return len(overlap)

    def exec_jaccard(self):
        results = defaultdict(float)
        for key in self.products:
            results[key] = self.jaccard(self.target_product, self.products[key])
        return results

    def exec_cooccurrence(self):
        results = defaultdict(int)
        for key in self.products:
            results[key] = self.Cooccurrence(self.target_product, self.products[key])
        return results



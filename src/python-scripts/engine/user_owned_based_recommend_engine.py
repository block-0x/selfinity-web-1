# -*- coding: utf-8 -*-
from math import sqrt
from engine.engine import Engine

class UserOwnedBasedRecommendEngine(Engine):
    def __init__(self, builder):
        super().__init__(builder)

    def inject(self, builder):
        super().inject(builder)

    def run(self, contents, target_content):
        self.products = contents.toOwnedBaseDict()
        data = self.exec_jaccard()
        t_data = sorted([item for item in data if item[0] == target_content.id], key=lambda x: -x[2])
        contents.items = [contents.getById(item[0]) for item in t_data]
        return contents

    def jaccard(self, e1, e2):
        """
        :param e1: list of int
        :param e2: list of int
        :rtype: float
        """
        set_e1 = set(e1)
        set_e2 = set(e2)
        return float(len(set_e1 & set_e2)) / float(len(set_e1 | set_e2))

    def exec_jaccard(self):
        results = []
        for key in self.products:
            base_customers = self.products[key]
            for key2 in self.products:
                if key == key2:
                    continue
                target_customers = self.products[key2]
                j = self.jaccard(base_customers, target_customers)
                results.append([(key), key2, j])
        return results


# -*- coding: utf-8 -*-
from math import sqrt
from engine.engine import Engine

class UserScoreBasedRecommendEngine(Engine):
    _t = None
    def __init__(self, builder):
        super().__init__(builder)

    def inject(self, builder):
        super().inject(builder)

    def run(self, users, target_user):
        self.dataset = users.toScoreBaseDict()
        return user_reommendations(target_user.id)

    def similarity_score(self, person1, person2):
        # 戻り値は person1 と person2 のユークリッド距離

        total_of_eclidean_distance = sum(
            pow(self.dataset[person1][item] - self.dataset[person2][item], 2)
            for item in self.dataset[person1]
            if item in self.dataset[person2]
        )

        return 1 / (1 + sqrt(total_of_eclidean_distance))

    def pearson_correlation(self, person1, person2):

        # 両方のアイテムを取得
        both_rated = {}
        for item in self.dataset[person1]:
            if item in self.dataset[person2]:
                both_rated[item] = 1

        number_of_ratings = len(both_rated)

        # 共通のアイテムがあるかチェック、無ければ 0 を返す
        if number_of_ratings == 0:
            return 0

        # 各ユーザーごとのすべての好みを追加
        person1_preferences_sum = sum(
            [self.dataset[person1][item] for item in both_rated])
        person2_preferences_sum = sum(
            [self.dataset[person2][item] for item in both_rated])

        # 各ユーザーの好みの値の二乗を計算
        person1_square_preferences_sum = sum(
            [pow(self.dataset[person1][item], 2) for item in both_rated])
        person2_square_preferences_sum = sum(
            [pow(self.dataset[person2][item], 2) for item in both_rated])

        # アイテムごとのユーザー同士のレーティングを算出して合計
        product_sum_of_both_users = sum(
            [self.dataset[person1][item] * self.dataset[person2][item] for item in both_rated])

        # ピアソンスコアの計算
        numerator_value = product_sum_of_both_users - \
            (person1_preferences_sum * person2_preferences_sum / number_of_ratings)
        denominator_value = sqrt((person1_square_preferences_sum - pow(person1_preferences_sum, 2) / number_of_ratings) * (
            person2_square_preferences_sum - pow(person2_preferences_sum, 2) / number_of_ratings))
        if denominator_value == 0:
            return 0
        else:
            r = numerator_value / denominator_value
            return r

    def most_similar_users(self, person, number_of_users):
        scores = [(self.pearson_correlation(person, other_person), other_person)
                  for other_person in self.dataset if other_person != person]

        scores.sort()
        scores.reverse()
        return scores[0:number_of_users]

    def user_reommendations(person):

        # 他のユーザーの加重平均によるランキングから推薦を求める
        totals = {}
        simSums = {}
        for other in self.dataset:
            # 自分自身は比較しない
            if other == person:
                continue
            sim = pearson_correlation(person, other)

            # ゼロ以下のスコアは無視する
            if sim <= 0:
                continue
            for item in self.dataset[other]:

                # まだ所持していないアイテムのスコア
                if item not in self.dataset[person] or self.dataset[person][item] == 0:

                    # Similrity * スコア
                    totals.setdefault(item, 0)
                    totals[item] += self.dataset[other][item] * sim
                    # 類似度の和
                    simSums.setdefault(item, 0)
                    simSums[item] += sim

            # 正規化されたリストを作成

        rankings = [(total / simSums[item], item)
                    for item, total in list(totals.items())]
        rankings.sort()
        rankings.reverse()
        # 推薦アイテムを返す
        recommendataions_list = [
            recommend_item for score, recommend_item in rankings]
        return recommendataions_list


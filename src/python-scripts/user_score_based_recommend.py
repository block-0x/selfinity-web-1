from builder.recommend_builder import RecommendBuilder
import sys, json

builder = RecommendBuilder()
response = builder.user_score_based_recommend(json.loads(sys.stdin.readline()).get('users'), sys.stdin.readline().get('target_user'))
print(json.dumps(response))

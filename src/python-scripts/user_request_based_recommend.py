from builder.recommend_builder import RecommendBuilder
import sys, json

builder = RecommendBuilder()
request = json.loads(sys.stdin.readline())
response = builder.user_request_based_recommend(request.get('requests'), request.get('target_user'))
print(json.dumps(response))

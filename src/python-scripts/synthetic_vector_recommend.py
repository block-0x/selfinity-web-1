from builder.recommend_builder import RecommendBuilder
import sys, json

builder = RecommendBuilder()
request = json.loads(sys.stdin.readline())
response = builder.synthetic_vector_recommend(request.get('contents'), request.get('target_user'))
print(json.dumps(response))

from builder.w2v_builder import W2vBuilder
import sys, json
from module.numpyEncoder import NumpyEncoder

builder = W2vBuilder()
response = builder.vectorize_labels(json.loads(sys.stdin.readline()).get('labels'))
print(json.dumps(response, cls=NumpyEncoder))

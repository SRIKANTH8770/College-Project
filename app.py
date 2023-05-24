from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
from joblib import load
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)
@cross_origin()
@app.route('/predict', methods=['POST'])
def predict():
    
    symptoms = request.json
    print(symptoms)
    
    
    df_test = pd.DataFrame([symptoms])
    
    
    clf = load("random_forest.joblib")
    result = clf.predict(df_test)
    print(result)
    
    
    response = {
        'prediction': result.tolist()
    }
    
    
    return jsonify(response)

if __name__ == '__main__':
    app.run()

# This code should go into your server.py
import flask
import json
import pickle
import pandas as pd
from flask import Response, render_template, request, jsonify
from flask_cors import CORS, cross_origin

from model import FraudModel, SavedModel

# load model from file
xgb_model = pickle.load(open("XGBoostClassifier.pickle.dat", "rb"))
label_encoder = pickle.load(open("LabelEncoder.pickle.dat", "rb"))

app = flask.Flask(__name__)

cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/api/list", methods=["GET"])
def list():
    df = pd.read_csv("./templates/fraudTest_clean_import.csv")
    return jsonify(df[:50].to_dict('records'))

@app.route("/api/detect", methods=["POST"])
def detect():
    if request.method == "POST":
        data = request.form['data']
        predictions = SavedModel(xgb_model, label_encoder, data).predict()

        return jsonify(dict(predictions))

@app.route("/api/predict", methods=["POST"])
def predict():

    try:
        file = request.files['file']
        df = pd.read_csv(file)
        predictions = SavedModel(xgb_model, label_encoder, None, df).predict()

        return jsonify(predictions), 200
    except Exception as e:
        # raise e
        return jsonify(dict(error="Something unexpected happened.")), 400

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5001)

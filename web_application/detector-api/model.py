# This code should go into your server.py
import os
import flask
import lxml
import json
import pickle
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

from flask import Response, render_template, request, jsonify

from sklearn.feature_selection import mutual_info_classif
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from xgboost import XGBClassifier

import datetime as dt

class FraudModel:
    def __init__(self, train_file_path, test_file_path):

        self.test_original = pd.read_csv(test_file_path)
        self.train_original = pd.read_csv(train_file_path)
        
        self.test_original = self.mod_features(self.test_original)
        self.train_original = self.mod_features(self.train_original)

        self.feature_columns = ['category','amt','zip','lat','long','city_pop','merch_lat','merch_long','age','hour','day','month','is_fraud']
        self.label_encoder = LabelEncoder()

        self.train_data = self.train_original[self.feature_columns].copy()
        self.test_data = self.test_original[self.feature_columns].copy()
        
        # Encode the 'category' into numerical label
        self.train_data['category'] = self.label_encoder.fit_transform(self.train_data['category'])
        self.test_data['category'] = self.label_encoder.fit_transform(self.test_data['category'])

        self.X_train = self.train_data.drop('is_fraud', axis='columns')
        self.y_train = self.train_data['is_fraud']
        
        self.X_test = self.test_data.drop('is_fraud', axis='columns')
        self.y_test = self.test_data['is_fraud']

        # Creating holders to store the model performance results
        self.ML_Model = []
        self.acc_train = []
        self.acc_test = []

        # Train 3 Model Types
        tree, acc_train_tree, acc_test_tree = self.d_tree()
        forest, acc_train_forest, acc_test_forest = self.rand_forest()
        xgb, acc_train_xgb, acc_test_xgb = self.xg_boost()

        # Save The Models
        self.Models = []
        self.Models.append(tree)
        self.Models.append(forest)
        self.Models.append(xgb)

        # save XGBoost model to file, since its the best performing model
        pickle.dump(xgb, open("XGBoostClassifier.pickle.dat", "wb"))

        # Save the LabelEncoder
        pickle.dump(self.label_encoder, open("LabelEncoder.pickle.dat", "wb"))

    #function to call for storing the results
    def storeResults(self, model, a, b):
        self.ML_Model.append(model)
        self.acc_train.append(round(a, 3))
        self.acc_test.append(round(b, 3))

    def mod_features(self, df):
        df['age'] = dt.date.today().year-pd.to_datetime(df['dob']).dt.year
        df['hour'] = pd.to_datetime(df['trans_date_trans_time']).dt.hour
        df['day'] = pd.to_datetime(df['trans_date_trans_time']).dt.dayofweek
        df['month'] = pd.to_datetime(df['trans_date_trans_time']).dt.month
        return df

    def d_tree(self):

        # Decision Tree model 
        tree = DecisionTreeClassifier(max_depth = 5)
        tree.fit(self.X_train, self.y_train)

        #predicting the target value from the model for the samples
        y_test_tree = tree.predict(self.X_test)
        y_train_tree = tree.predict(self.X_train)
        #computing the accuracy of the model performance
        acc_train_tree = accuracy_score(self.y_train,y_train_tree)
        acc_test_tree = accuracy_score(self.y_test,y_test_tree)

        print("Decision Tree: Accuracy on training Data: {:.3f}".format(acc_train_tree))
        print("Decision Tree: Accuracy on test Data: {:.3f}".format(acc_test_tree))

        #checking the feature improtance in the model
        plt.figure(figsize=(9,7))
        n_features = self.X_train.shape[1]
        plt.barh(range(n_features), tree.feature_importances_, align='center')
        plt.yticks(np.arange(n_features), self.X_train.columns)
        plt.xlabel("Feature importance")
        plt.ylabel("Feature")
        plt.show()

        #storing the results. The below mentioned order of parameter passing is important.
        #Caution: Execute only once to avoid duplications.
        self.storeResults('Decision Tree', acc_train_tree, acc_test_tree)
        # Return the results of the model
        return (tree, acc_train_tree, acc_test_tree)

    def rand_forest(self):
        # Random Forest model
        # instantiate the model
        forest = RandomForestClassifier(max_depth=5, random_state=5)
        
        # fit the model 
        forest.fit(self.X_train, self.y_train)
        
        #predicting the target value from the model for the samples
        y_test_forest = forest.predict(self.X_test)
        y_train_forest = forest.predict(self.X_train)

        #computing the accuracy of the model performance
        acc_train_forest = accuracy_score(self.y_train, y_train_forest)
        acc_test_forest = accuracy_score(self.y_test, y_test_forest)

        print("Random forest: Accuracy on training Data: {:.3f}".format(acc_train_forest))
        print("Random forest: Accuracy on test Data: {:.3f}".format(acc_test_forest))

        #checking the feature improtance in the model
        plt.figure(figsize=(9,7))
        n_features = self.X_train.shape[1]
        plt.barh(range(n_features), forest.feature_importances_, align='center')
        plt.yticks(np.arange(n_features), self.X_train.columns)
        plt.xlabel("Feature importance")
        plt.ylabel("Feature")
        plt.show()

        #storing the results. The below mentioned order of parameter passing is important.
        #Caution: Execute only once to avoid duplications.
        self.storeResults('Random Forest', acc_train_forest, acc_test_forest)
        
        return (forest, acc_train_forest, acc_test_forest)
    
    def xg_boost(self):
        
        # instantiate the model
        xgb = XGBClassifier(learning_rate=0.4,max_depth=7)
        
        #fit the model
        xgb.fit(self.X_train, self.y_train)
        
        #predicting the target value from the model for the samples
        y_test_xgb = xgb.predict(self.X_test)
        y_train_xgb = xgb.predict(self.X_train)
        
        #computing the accuracy of the model performance
        acc_train_xgb = accuracy_score(self.y_train,y_train_xgb)
        acc_test_xgb = accuracy_score(self.y_test,y_test_xgb)

        print("XGBoost: Accuracy on training Data: {:.3f}".format(acc_train_xgb))
        print("XGBoost : Accuracy on test Data: {:.3f}".format(acc_test_xgb))
        
        #storing the results. The below mentioned order of parameter passing is important.
        #Caution: Execute only once to avoid duplications.
        self.storeResults('XGBoost', acc_train_xgb, acc_test_xgb)
        
        return (xgb, acc_train_xgb, acc_test_xgb)
    
    def compare_models(self):
        #creating dataframe
        results = pd.DataFrame({
            'ML Model': self.ML_Model,    
            'Train Accuracy': self.acc_train,
            'Test Accuracy': self.acc_test
        })
        results.sort_values(by=['Test Accuracy', 'Train Accuracy'], ascending=False)
        return results

    def clf_predict(self, model, features):

        prediction = model.predict(features)
        return prediction

class SavedModel:
    def __init__(self, model, label_encoder, data, df):
        
        self.columns = ['category','amt','zip','lat','long','city_pop','merch_lat','merch_long','age','hour','day','month']
        self.df = self.mod_features(df)
        self.original_df = self.mod_features(df)
        self.df = self.df[self.columns].copy()
        # self.df = pd.DataFrame(
        #     columns=self.columns, 
        #     data=data
        # )

        self.model = model
        self.label_encoder = label_encoder
        
        self.data = self.df
        self.df['category'] = label_encoder.fit_transform(self.df['category'])
    
    def mod_features(self, df):
        df['age'] = dt.date.today().year-pd.to_datetime(df['dob']).dt.year
        df['hour'] = pd.to_datetime(df['trans_date_trans_time']).dt.hour
        df['day'] = pd.to_datetime(df['trans_date_trans_time']).dt.dayofweek
        df['month'] = pd.to_datetime(df['trans_date_trans_time']).dt.month
        return df

    def predict(self):
        predictions = self.model.predict(self.data)
        df = self.original_df.copy()
        df['predicted_label'] = predictions
        return df[:50].to_dict('records')
        
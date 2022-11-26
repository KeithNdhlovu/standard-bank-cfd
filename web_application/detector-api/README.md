# Model Training

Open the notebook in the folder `web_application/detector-api/[Model Generation] credit-card-fraud-detection.ipynb` and Run all cells, also make sure that all training and test files are save in the correct paths.

This notebook will create two files once done, a `LabelEncoder` and `XGBoostModel` which will later be loaded by the `detector-api` web based project.

## Running the REST Server

Once model training is finished, you can now on the terminal, run the server, make sure you are still within the same folder you are running the notebook in. `web_application/detector-api/`

```shell
$ python -m server
```

Keep this command running on the background so it will be used by the frontend.
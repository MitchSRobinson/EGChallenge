import keras
import numpy as np

def predict_next_timestamp(model, history):
	"""Predict the next time stamp given a sequence of history data"""

	prediction = model.predict(history)
	prediction = np.reshape(prediction, (prediction.size,))
	return prediction

def load_model():
  return keras.models.load_model('RNN.h5')

def predict(array):
  return predict_next_timestamp(load_model(), array)

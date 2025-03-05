import * as tf from '@tensorflow/tfjs';

let model;

export const loadModel = async () => {
  if (!model) {
    model = await tf.loadLayersModel('/path/to/tfjs_model/model.json');
  }
  return model;
};

export const predict = async (features) => {
  const model = await loadModel();
  const inputTensor = tf.tensor2d([features]);
  const prediction = model.predict(inputTensor);
  const recommendation = prediction.dataSync()[0];
  return recommendation;
};
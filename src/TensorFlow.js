// linearRegressionModel.js
import * as tf from '@tensorflow/tfjs';

const trainModel = async (trainingData) => {
  const model = tf.sequential();
  model.add(tf.layers.dense({ inputShape: [6], units: 1 }));
  model.compile({ optimizer: 'sgd', loss: 'meanSquaredError' });

  const input = tf.tensor2d(trainingData.map(item => [
    item.TeamMatches,
    item.TeamGoalsAtHome,
    item.TeamGoalsAtAway,
    item.TeamGoalsAgaisntHome,
    item.TeamGoalsAgaisntAway,
    item.TeamPlacement,
  ]));
  const labels = tf.tensor2d(trainingData.map(item => [item.TotalGoals]));

  await model.fit(input, labels, { epochs: 1000 });

  return model;
};

const predictOutcome = (model, homeTeam, awayTeam) => {
  const homeTeamInput = tf.tensor2d([[
    homeTeam.teamMatches,
    homeTeam.teamGoalsAtHome,
    homeTeam.teamGoalsAtAway,
    homeTeam.teamGoalsAgaisntHome,
    homeTeam.teamGoalsAgaisntAway,
    homeTeam.teamPlacement,
  ]]);
  const awayTeamInput = tf.tensor2d([[
    awayTeam.teamMatches,
    awayTeam.teamGoalsAtHome,
    awayTeam.teamGoalsAtAway,
    awayTeam.teamGoalsAgaisntHome,
    awayTeam.teamGoalsAgaisntAway,
    awayTeam.teamPlacement,
  ]]);

  const homeTeamPrediction = model.predict(homeTeamInput);
  const awayTeamPrediction = model.predict(awayTeamInput);

  const maxGames = homeTeam.teamMatches + awayTeam.teamMatches;
  const maxGoals = homeTeamPrediction.dataSync()[0] + awayTeamPrediction.dataSync()[0];
  const median = maxGoals / maxGames;
  const odds = median / 100.0;
  const oddsHere = odds * maxGames;

  return {
    maxGames,
    maxGoals,
    median,
    odds: odds.toFixed(2),
    oddsHere: oddsHere.toFixed(2),
  };
};

export { trainModel, predictOutcome };

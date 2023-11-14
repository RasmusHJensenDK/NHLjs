import React, { useState, useEffect } from 'react';

const TeamPrediction = () => {
  const [homeTeam, setHomeTeam] = useState(null);
  const [awayTeam, setAwayTeam] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the data from the backend API
        const response = await fetch('http://localhost:3001/teams'); // Update the URL accordingly
        const data = await response.json();

        // Set the fetched teams in the state
        setTeams(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Call the fetchData function
    fetchData();
  }, []); // Empty dependency array ensures useEffect runs only once

  const handleHomeTeamChange = (event) => {
    const selectedTeam = teams.find((team) => team.teamName === event.target.value);
    setHomeTeam(selectedTeam);
  };

  const handleAwayTeamChange = (event) => {
    const selectedTeam = teams.find((team) => team.teamName === event.target.value);
    setAwayTeam(selectedTeam);
  };

  const predictOutcome = () => {
    if (homeTeam && awayTeam) {
      const maxGames = homeTeam.teamMatches + awayTeam.teamMatches;
      const maxGoals =
        homeTeam.teamGoalsAtHome +
        homeTeam.teamGoalsAgaisntHome +
        homeTeam.teamGoalsAtAway +
        homeTeam.teamGoalsAgaisntAway +
        awayTeam.teamGoalsAtHome +
        awayTeam.teamGoalsAgaisntHome +
        awayTeam.teamGoalsAtAway +
        awayTeam.teamGoalsAgaisntAway;
  
      // Use double for the division
      const median = maxGoals / maxGames;
      const odds = median / 100.0;

      let betRecommendation = '';

      if (median > 6.8) {
        betRecommendation = 'Bet above 6.5 goals';
      } else if (median > 5.8) {
        betRecommendation = 'Bet over 5.5 goals';
      } else {
        betRecommendation = 'Bet under 5.5 goals';
      }
  
      setPredictionResult({
        maxGames,
        maxGoals,
        median,
        odds: odds.toFixed(2), // Round to two decimal places
        oddsHere: (odds * maxGames).toFixed(2), // Round to two decimal places
        betRecommendation,
      });
    }
  };

  return (
    <div>
      <label>
        Home Team:
        <select onChange={handleHomeTeamChange}>
          <option value="">Select Home Team</option>
          {teams.map((team) => (
            <option key={team.teamName} value={team.teamName}>
              {team.teamName}
            </option>
          ))}
        </select>
      </label>

      <label>
        Away Team:
        <select onChange={handleAwayTeamChange}>
          <option value="">Select Away Team</option>
          {teams.map((team) => (
            <option key={team.teamName} value={team.teamName}>
              {team.teamName}
            </option>
          ))}
        </select>
      </label>

      <button onClick={predictOutcome}>Predict Outcome</button>

      {predictionResult && (
        <div>
          <h2>Prediction Result:</h2>
          <p>Max Games: {predictionResult.maxGames}</p>
          <p>Max Goals: {predictionResult.maxGoals}</p>
          <p>Median: {predictionResult.median}</p>
          <p>Odds Here: {predictionResult.oddsHere}</p>
          <p>Bet Recommendation: {predictionResult.betRecommendation}</p>
        </div>
      )}
    </div>
  );
};

export default TeamPrediction;

import { useState } from 'react';
import SplashScreen from './screens/SplashScreen.jsx';
import CategoryScreen from './screens/CategoryScreen.jsx';
import SubcategoryScreen from './screens/SubcategoryScreen.jsx';
import GameScreen from './screens/GameScreen.jsx';
import MiniGamesScreen from './screens/MiniGamesScreen.jsx';
import MiniGamePlayScreen from './screens/MiniGamePlayScreen.jsx';
import LeaderboardScreen from './screens/LeaderboardScreen.jsx';
import RegulatorDashboard from './screens/RegulatorDashboard.jsx';

export default function App() {
  const [route, setRoute] = useState({ screen: 'splash' });
  const go = (screen, params = {}) => setRoute({ screen, ...params });

  if (route.screen === 'splash')       return <SplashScreen onStart={() => go('category')} onLeaderboard={() => go('leaderboard')} onRegulator={() => go('regulator')} />;
  if (route.screen === 'leaderboard')  return <LeaderboardScreen onBack={() => go('splash')} />;
  if (route.screen === 'regulator')    return <RegulatorDashboard onBack={() => go('splash')} />;
  if (route.screen === 'category')     return <CategoryScreen onSelect={(cat) => go('subcategory', { category: cat })} onMiniGames={() => go('miniGames')} />;
  if (route.screen === 'subcategory')  return <SubcategoryScreen category={route.category} onSelect={(sub) => go('game', { category: route.category, subcategory: sub })} onBack={() => go('category')} />;
  if (route.screen === 'game')         return <GameScreen category={route.category} subcategory={route.subcategory} onBack={() => go('category')} />;
  if (route.screen === 'miniGames')    return <MiniGamesScreen onSelect={(mg) => go('miniGamePlay', { miniGame: mg })} onBack={() => go('category')} />;
  if (route.screen === 'miniGamePlay') return <MiniGamePlayScreen miniGame={route.miniGame} onBack={() => go('miniGames')} />;
  return <SplashScreen onStart={() => go('category')} onLeaderboard={() => go('leaderboard')} onRegulator={() => go('regulator')} />;
}

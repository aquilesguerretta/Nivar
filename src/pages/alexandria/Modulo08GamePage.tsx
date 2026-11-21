import { useNavigate } from 'react-router-dom';
import { Modulo08Game } from '@/components/alexandria/games/Modulo08Game';

export function Modulo08GamePage({ trilhaId }: { trilhaId: string }) {
  const navigate = useNavigate();
  return (
    <Modulo08Game
      onBack={() => navigate(`/alexandria/trilha/${trilhaId}/modulo/modulo-08`)}
    />
  );
}

export default Modulo08GamePage;


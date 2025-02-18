import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Footer } from '../Components/Footer';
import socket from '../services/socket';
import { useUser } from '../context/UserContext';
import '../styles/game.css';

// Tipos para balotas y tarjetón
type Ball = number;
type BingoCard = (Ball | "FREE")[][];

const generateRandomCard = (): BingoCard => {
  let numbers = Array.from({ length: 75 }, (_, i) => i + 1);
  numbers = numbers.sort(() => 0.5 - Math.random()).slice(0, 24); // 24 números sin repetir
  
  const card: BingoCard = [
    ['B', 'I', 'N', 'G', 'O'], // Cabecera de letras
    ...Array(5).fill(null).map((_, i) =>
      Array(5).fill(null).map((_, j) => {
        if (i === 2 && j === 2) return "FREE"; // Espacio libre en el centro
        const index = i * 5 + j - (i > 2 || (i === 2 && j > 2) ? 1 : 0); // Ajuste del índice después del espacio libre
        return numbers[index];
      })
    )
  ];
  
  return card;
};


const Game: React.FC = () => {
  const [drawnBalls, setDrawnBalls] = useState<Ball[]>([]);
  const [playerCard, setPlayerCard] = useState<BingoCard>(generateRandomCard());
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const navigate = useNavigate();
  const {user} = useUser()

  useEffect(() => {
    // Cuando el componente se monta, escuchar eventos de socket
    socket.emit("joinGame");
    socket.emit("startGame")
    socket.on("gameStarted", () => {
      setDrawnBalls([]);
      setPlayerCard(generateRandomCard()); // Nueva balota para cada jugador
      setSelectedNumbers([]);
      setGameOver(false);
      setWinner(null);
    });
    // Escuchar balotas sorteadas
    socket.on("newBall", (ball: Ball) => {
      setDrawnBalls((prevBalls) => [...prevBalls, ball]);
    });

    socket.on("disqualified", (data: { player: string }) => {
      if (data.player === user.username) 
        {
          alert("Has sido descalificado");
          navigate('/home');
        }
      else{
        alert(`${data.player} ha sido descalificado`);
      }      
    });
    // Escuchar cuando alguien gane
    socket.on("gameOver", (data: { winner: string }) => {
      setGameOver(true);
      setWinner(data.winner);
      alert(`${data.winner} ha ganado!`);
      setTimeout(() => navigate('/home'), 5000); // Regresar al home después de 5 segundos
    });

    return () => {
      // Limpiar los eventos de socket cuando se desmonta el componente
      socket.off("newBall");
      socket.off("gameOver");
      socket.off("disqualified")
      socket.emit("leaveGame");
      setDrawnBalls([]); // Reset drawnBalls on disconnect
      setPlayerCard(generateRandomCard()); // Generate new card on disconnect
      setSelectedNumbers([]);
      setGameOver(false);
      setWinner(null);
    };
  }, [navigate]);

  // Manejador para seleccionar un número en el tarjetón del jugador
  const handleSelectNumber = (number: Ball | "FREE") => {
    if (number !== "FREE" && !selectedNumbers.includes(number)) {
      setSelectedNumbers([...selectedNumbers, number]);
    }
  };

  const checkVictory = (): boolean => {
    // Verifica si todos los números en una fila están seleccionados y han sido sorteados
    const isRowCompleted = (row: number) => playerCard[row].every(
      (num) => num === "FREE" || (selectedNumbers.includes(num as Ball) && drawnBalls.includes(num as Ball))
    );
  
    // Verifica si todos los números en una columna están seleccionados y han sido sorteados
    const isColumnCompleted = (col: number) => playerCard.slice(1).every(
      (row) => row[col] === "FREE" || (selectedNumbers.includes(row[col] as Ball) && drawnBalls.includes(row[col] as Ball))
    );
  
    // Verifica si toda la tarjeta está marcada correctamente (considerando las balotas sorteadas)
    const isCardCompleted = () => playerCard.slice(1).every(
      (row) => row.every((num) => num === "FREE" || (selectedNumbers.includes(num as Ball) && drawnBalls.includes(num as Ball)))
    );
  
    // Verifica si las cuatro esquinas están seleccionadas y han sido sorteadas
    const isFourCornersMarked = () => {
      const corners = [
        playerCard[1][0],
        playerCard[1][4],
        playerCard[5][0],
        playerCard[5][4]
      ];
      return corners.every((num) => num === "FREE" || (selectedNumbers.includes(num as Ball) && drawnBalls.includes(num as Ball)));
    };
  
    // Verificar si se cumple alguna de las condiciones de victoria
    return (
      playerCard.slice(1).some((_, rowIndex) => isRowCompleted(rowIndex + 1)) || // alguna fila
      [0, 1, 2, 3, 4].some((colIndex) => isColumnCompleted(colIndex)) ||         // alguna columna
      isCardCompleted() ||                                                       // toda la tarjeta
      isFourCornersMarked()                                                      // cuatro esquinas
    );
  };

  const handleBingo = () => {
    if (checkVictory()) {      
      socket.emit("playerWon", { username: user.username }); // Envía el nombre del jugador actual
    } else {
      alert("No has cumplido las condiciones para ganar. Estás descalificado.");
      socket.emit("playerLose", {username: user.username })
      setDrawnBalls([]); // Reset drawnBalls on disconnect
      setPlayerCard(generateRandomCard()); // Generate new card on disconnect
      setSelectedNumbers([]);
      setGameOver(false);
      setWinner(null);
      setTimeout(() => navigate('/home'), 5000); // Regresar al home después de 5 segundos
    }
  };

  return (
    <div className='bingo-content'>
      <div className='title'>
      <h2>¡Bienvenido al Juego de Bingo!</h2>
      </div>
      <div className='balotas'>
        <h3>Balotas:</h3>
        <div>{drawnBalls.join(', ')}</div>
      </div>
      <div className='bingo-card'>
        <h3>Tarjetón</h3>
        <table className='bingo-card'>
          <thead>
            <tr>{playerCard[0].map((letter, idx) => <th key={idx}>{letter}</th>)}</tr>
          </thead>
          <tbody>
            {playerCard.slice(1).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((num, colIndex) => (
                  <td
                    key={colIndex}
                    onClick={() => handleSelectNumber(num)}
                    style={{
                      cursor: 'pointer',
                      backgroundColor: num === "FREE" || selectedNumbers.includes(num as Ball) ? 'lightgreen' : '#242424'
                    }}
                  >
                    {num}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='final'>
      <button onClick={handleBingo}>Bingo!</button>
      {gameOver && winner && <p>El juego ha terminado. Ganador: {winner}</p>}
      </div>

      <Footer />
    </div>
  );
};

export default Game;

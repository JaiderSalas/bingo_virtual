// src/Lobby.js
import { useState, useEffect } from 'react';
import '../styles/lobby.css';
import socket from '../services/socket';
import { useNavigate } from 'react-router-dom';
export const Lobby = () => {
  const navigate = useNavigate();
  const [playersInLobby, setPlayersInLobby] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60);


  useEffect(() => {
    // Emitir al servidor que el jugador se ha unido al lobby
    socket.emit('joinLobby');

    // Escuchar el evento 'lobbyStatus'
    socket.on('lobbyStatus', (players) => {
      setPlayersInLobby(players);
    });

    // Limpiar el listener al desmontar el componente
    return () => {
      socket.off('lobbyStatus');
      socket.emit('leaveLobby');
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    if (timeRemaining === 0 && playersInLobby < 2) {
      socket.emit('leaveLobby');
      alert("No se encontraron suficientes jugadores. Regresando al inicio.");
      navigate('/home');
    }
    return () => clearInterval(timer);
  }, [playersInLobby, timeRemaining, navigate]);

  useEffect(() => {

    socket.on('gameStarted', (players) => {
      navigate('/game', { state: { players } });
    });
    return () => {
      socket.off('gameStarted');
    }
  }, [isReady,navigate]);

  const handleReady = () => {
    setIsReady(true);
    socket.emit('playerReady');
  };

  return (
    <div className="lobby-box">
      <h2>Esperando jugadores...</h2>
      <p>Jugadores en el lobby: {playersInLobby}</p>
      {playersInLobby < 2 && <p>Tiempo restante: {timeRemaining}</p>}
      {playersInLobby >= 2 && <button onClick={handleReady}>Listo para comenzar</button>}
      {isReady && <p>Esperando a que otros jugadores estén listos...</p>}
    </div>
  );
};

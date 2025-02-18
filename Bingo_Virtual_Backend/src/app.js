import express from "express"; 
import router from "./routes/user-routes.js";
import connectDB from "./config/db.js";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { createServer } from "http";
import bingorouter from "./routes/bingo-routes.js"

const app = express();
const server = createServer(app);
export const io = new Server(server, {
  cors: {
    origin: '*',
    credentials: true,
  }
});

app.use(morgan("dev"));
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

connectDB();

app.use("/api/user", router);
app.use("/api/bingo", bingorouter);

let players = 0;
let readyPlayers = 0;
let playersInGame = 0;
let interval;
let gameStarted = false;
let drawnBalls = [];

function drawBall(){
  let newball;
  do{
    newball = Math.floor(Math.random() * 75) + 1;
  } while(drawnBalls.includes(newball));
  drawnBalls.push(newball);
  io.emit('newBall', newball);
}

io.on('connection', (socket) => {
  
  socket.on('joinLobby', () => {
    console.log('Usuario conectado');
    players++;
    io.emit('lobbyStatus', players);
  });

  socket.on('leaveLobby', () => {
    console.log('Usuario desconectado');
    players--;
    io.emit('lobbyStatus', players);
  });

  socket.on('playerReady', () => {
    readyPlayers++;
    if (readyPlayers === players && players >= 2) {
      io.emit('gameStarted');
      gameStarted = true;
      playersInGame = 0;
      players = 0;
      readyPlayers = 0;
      drawnBalls = [];
      clearInterval(interval);
      interval = null;
    }
  });
  socket.on('disconnect', () => {
    players = Math.max(players - 1, 0);;  // Evita números negativos
    io.emit('lobbyStatus', players);
  });
  socket.on('startGame', () => {
    console.log('El juego ha comenzado', playersInGame);
    if (playersInGame > 0 && !interval) {
      interval = setInterval(drawBall, 5000);
    }
  });
  socket.on('joinGame', () => {
    playersInGame++;
    players=0;
    readyPlayers=0;
  });
  socket.on('leaveGame', () => {
    playersInGame--;
    if (playersInGame === 0) {
      clearInterval(interval);
      interval = null;
      drawnBalls = [];
    }
  });
  socket.on('playerWon', (data) => {
    if (gameStarted) {
      console.log(`El jugador ${data.username} ha ganado`);
      
      // Notifica a todos los jugadores que alguien ganó y termina el juego
      io.emit('gameOver', { winner: data.username });

      // Reinicia el estado del juego
      gameStarted = false;
      playersInGame = 0;
      players = 0;
      readyPlayers = 0;
      drawnBalls = [];
      // Limpia el sorteo de balotas
      clearInterval(interval);
      interval = null;
    }
  });
  socket.on('playerLose', (data) => {
    console.log(`El jugador ${data.username} ha sido descalificado`);
    io.emit('disqualified', { player: data.username });
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

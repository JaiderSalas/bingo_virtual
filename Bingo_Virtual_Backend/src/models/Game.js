import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
  playerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Referencia al usuario
  card: { 
    type: [[Number || String]], // La tarjeta de bingo del jugador, incluye números y el espacio "FREE"
    required: true 
  },
  selectedNumbers: { type: [Number], default: [] }, // Números seleccionados por el jugador
  isWinner: { type: Boolean, default: false } // Indicador de si el jugador ganó
});

const gameSchema = new mongoose.Schema({
  players: { type: [playerSchema], required: true }, // Lista de jugadores en la partida
  winners: { type: [mongoose.Schema.Types.ObjectId], ref: "User", default: [] }, // Lista de ganadores
  losers: { type: [mongoose.Schema.Types.ObjectId], ref: "User", default: [] }, // Lista de perdedores
}, {
  timestamps: true
});

export default mongoose.model("Game", gameSchema);

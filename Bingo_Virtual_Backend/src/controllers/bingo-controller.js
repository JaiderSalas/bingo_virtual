import Game from "../models/Game.js";

export const saveGame = async (req, res) => {
    const { players, winners, losers } = req.body;

    try {
        // Crear un arreglo de jugadores con la carta, números seleccionados y estado de ganador
        const playersData = await Promise.all(players.map(async (player) => {
            const playerData = {
                playerId: player.playerId, // Referencia al usuario
                card: player.card, // La tarjeta de bingo del jugador
                selectedNumbers: player.selectedNumbers, // Los números seleccionados
                isWinner: player.isWinner, // Si el jugador ha ganado
            };
            return playerData;
        }));

        // Crear el objeto del juego con la información proporcionada
        const newGame = new Game({
            players: playersData,
            winners: winners, // Lista de ganadores
            losers: losers, // Lista de perdedores
        });

        // Guardar el juego en la base de datos
        const savedGame = await newGame.save();

        res.status(201).json({
            message: "Juego guardado correctamente",
            game: savedGame,
        });
    } catch (error) {
        res.status(400).json({
            message: "Error al guardar el juego",
            error,
        });
    }
};

on('playerSpawned', () => { // When the player spawns
  emitNet('b-fr-core:playerInit'); // Emit the event to the server
})
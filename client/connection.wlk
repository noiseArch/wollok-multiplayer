import mainExample.Player
import mainExample.connectedPlayers
import wollok.game.*
import utils.*

object connHandler {
  method connect(url, playerId) {
    wsApi.connect(url, playerId)
    
    game.onTick(
      1,
      "listenMessages",
      { 
        const msg = wsApi.getMessage()
        if (msg != null) {
          const data = msg.split("|")
          const type = data.get(0)
          const playerId = data.get(1)
          console.println(msg)
          if (type == "player_connected") {
            const newPlayer = new Player(
              id = playerId,
              position = game.center()
            )
            connectedPlayers.add(newPlayer)
            game.addVisual(newPlayer)
          }
          if (type == "player_disconnected") {
            const disconnectedPlayer = connectedPlayers.find(
              { player => player.id() == playerId }
            )
            connectedPlayers.remove(disconnectedPlayer)
            console.println(connectedPlayers)
            game.removeVisual(disconnectedPlayer)
          }
          if (type == "player_update") {
            const position = data.get(2).split("@")
            console.println(position.get(0))
            
            strConverter.initialize()
            const x = strConverter.toInt(position.get(0))
            const y = strConverter.toInt(position.get(1))
            
            const updatedPlayer = connectedPlayers.find(
              { player => player.id() == playerId }
            )
            const newPosition = new MutablePosition().createPosition(x, y)
            updatedPlayer.position(newPosition)
          }
        }
      }
    )
  }
  
  method send(msg) {
    wsApi.send(msg)
  }
}

object wsApi {
  method connect(url, playerId) native
  
  method send(msg) native
  
  method getMessage() native
}
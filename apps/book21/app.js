function distributeMonsters(rooms) {
  for (var j = 1; j < 20; j++) {
    var z = -1;
    do {
      z = Math.floor(Math.random() * 44);
    } while (z == 5 || z == 16 || z ==17 || z == 27 || z == 29 || z == 30 || z == 31 || z == 32 || z == 37 || rooms[z][7] != 0);
    rooms[z][7] = j;
  }
}


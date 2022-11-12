class Cache {
  creatures = [];

  findAllCreatures() {
    if (this.creatures.length === 0) {
      return null;
    }

    return this.creatures;
  }

  setAllCreatures(creatures) {
    this.creatures = creatures;
  }

  resetAllCreatures() {
    this.creatures = [];
  }
}

module.exports = new Cache();

class Cache {
  creatures = [];
  usersByUid = new Map();

  resetUserByUid(uid) {
    this.usersByUid.delete(uid);
  }

  setUserByUid(user) {
    this.usersByUid.set(user.uid, user);
  }

  getUserByUid(uid) {
    return this.usersByUid.get(uid);
  }

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

class Cache {
  usersToAssign = [];
  handlersToAssign = new Map();
  creatures = [];
  usersByUid = new Map();
  theMostEdgeGarden = null;

  checkMyTurnToAssign(user) {
    const currentUser = this.usersToAssign[0];
    if (currentUser) {
      return currentUser.id === user.id;
    }

    return true;
  }

  getCurrentUserToAssign() {
    return this.usersToAssign[0];
  }

  addUserToAssign(user, callback) {
    this.usersToAssign.push(user);
    this.handlersToAssign.set(user.id, callback);
  }

  popUserToAssign() {
    this.usersToAssign.pop();
  }

  getTheMostEdgeGarden() {
    return this.theMostEdgeGarden;
  }

  setTheMostEdgeGarden(garden) {
    this.theMostEdgeGarden = garden;
  }

  resetTheMostEdgeGarden() {
    this.theMostEdgeGarden = null;
  }

  resetUserByUid(uid) {
    this.usersByUid.delete(uid);
  }

  setUserByUid(user) {
    if (user) {
      this.usersByUid.set(user.uid, user);
    }
  }

  getUserByUid(uid) {
    return this.usersByUid.get(uid);
  }

  findAllCreatures() {
    return null;
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

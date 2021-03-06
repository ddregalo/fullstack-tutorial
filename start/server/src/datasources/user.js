const { DataSource } = require('apollo-datasource');
const isEmail = require('isemail');

class UserAPI extends DataSource {
  constructor({ store }) {
    super();
    this.store = store;
  }

  /**
   * This is a function that gets called by ApolloServer when being setup.
   * This function gets called with the datasource config including things
   * like caches and context. We'll assign this.context to the request context
   * here, so we can know about the user making requests
   */
  initialize(config) {
    this.context = config.context;
  }

  /**
   * User can be called with an argument that includes email, but it doesn't
   * have to be. If the user is already on the context, it will use that user
   * instead
   */
  async findOrCreateUser({ email: emailArg } = {}) {
    const email =
      this.context && this.context.user ? this.context.user.email : emailArg;
    if (!email || !isEmail.validate(email)) return null;

    const users = await this.store.users.findOrCreate({ where: { email } });
    return users && users[0] ? users[0] : null;
  }

  async buyArtworks({ artworkIds }) {
    const userId = this.context.user.id;
    if (!userId) return;

    let results = [];

    for (const artworkId of artworkIds) {
      const res = await this.buyArtwork({ artworkId });
      if (res) results.push(res);
    }

    return results;
  }

  async buyArtwork({ artworkId }) {
    const userId = this.context.user.id;
    const res = await this.store.artworks.findOrCreate({
      where: { userId, artworkId },
    });
    return res && res.length ? res[0].get() : false;
  }

  async cancelArtworkPurchase({ artworkId }) {
    const userId = this.context.user.id;
    return !!this.store.artworks.destroy({ where: { userId, artworkId } });
  }

  async getArtworkIdsByUser() {
    const userId = this.context.user.id;
    const found = await this.store.artworks.findAll({
      where: { userId },
    });
    return found && found.length
      ? found.map(l => l.dataValues.artworkId).filter(l => !!l)
      : [];
  }

  async isUserConfirmedToBuy({ artworkId }) {
    if (!this.context || !this.context.user) return false;
    const userId = this.context.user.id;
    const found = await this.store.artworks.findAll({
      where: { userId, artworkId },
    });
    return found && found.length > 0;
  }
}

module.exports = UserAPI;

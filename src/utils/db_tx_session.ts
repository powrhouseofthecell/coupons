import mongoose from "mongoose";

class TX {
  session: any;

  async create_session() {
    this.session = await mongoose.startSession();
    return this;
  }

  start_transaction() {
    this.session.startTransaction();
    return this;
  }

  async commit_transaction() {
    await this.session.commitTransaction();
    return this;
  }

  end_session() {
    this.session.endSession();
    return this;
  }

  async abort_transaction() {
    await this.session.abortTransaction();
    return this;
  }
}

export default TX;

class Message {
  constructor(action, object) {
    this.action = action;
    this.type = object.constructor.name;
    this.object = object;
  }
}

class Codec {
  constructor(types) {
    this.types = types;
  }

  decode(string) {
    // TODO: deserialize the message
    const message = JSON.parse(string);
    if (message.object instanceof Object) {
      message.object = Object.assign(new this.types[message.type](), message.object);
    }
    return message;
  }

  encode(message) {
    // TODO: serialize the message
    return JSON.stringify(message);
  }
}

export { Message, Codec };

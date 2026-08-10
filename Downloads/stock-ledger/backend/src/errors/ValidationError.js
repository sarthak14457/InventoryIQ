class ValidationError extends Error {
  constructor(message, fields = {}) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = 400;
    this.fields = fields;
  }
}

export default ValidationError;

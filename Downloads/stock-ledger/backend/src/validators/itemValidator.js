import ValidationError from "../errors/ValidationError.js";

function validateItem(body) {
  const { name, qty, threshold, price } = body;
  const fields = {};

  if (!name || !name.trim()) {
    fields.name = "Item name is required.";
  }

  if (qty === undefined || Number(qty) < 0) {
    fields.qty = "Quantity must be 0 or more.";
  }

  if (threshold !== undefined && Number(threshold) < 0) {
    fields.threshold = "Threshold must be 0 or more.";
  }

  if (price !== undefined && Number(price) < 0) {
    fields.price = "Price must be 0 or more.";
  }

  if (Object.keys(fields).length) {
    throw new ValidationError("Invalid item details.", fields);
  }
}

export { validateItem };

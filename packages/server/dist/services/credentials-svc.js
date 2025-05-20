"use strict";
var import_mongoose = require("mongoose");
const credentialSchema = new import_mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true
    },
    hashedPassword: {
      type: String,
      required: true
    }
  },
  { collection: "user_credentials" }
);
const credentialModel = (0, import_mongoose.model)(
  "Credential",
  credentialSchema
);

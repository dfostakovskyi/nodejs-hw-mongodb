//src\db\models\contact.js

import { model, Schema } from "mongoose";

const contactsSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: String,
            required: true
        },
        email: {
            type: String
        },
        isFavourite: {
            type: Boolean,
            default: false
        },
        contactType: {
            type: String,
            enum: ["work", "home", "personal"],
            required: true,
            default: "personal"
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "users",
            required: true
        },

        photo: { type: String }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const ContactsCollection = model("contacts", contactsSchema);

export { ContactsCollection };

"use strict";
/* eslint-disable */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReturnTypes = exports.AllTypesProps = void 0;
exports.AllTypesProps = {};
exports.ReturnTypes = {
    Query: {
        users: "User"
    },
    User: {
        id: "Int",
        username: "String",
        posts: "Post"
    },
    Post: {
        id: "Int",
        heading: "String",
        text: "String",
        authorId: "Int"
    }
};

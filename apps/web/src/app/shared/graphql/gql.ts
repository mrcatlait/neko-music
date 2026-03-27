/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "query GetBackstageArtist {\n  backstageArtists {\n    id\n    name\n    status\n    mediaStatus\n    artwork {\n      url\n    }\n  }\n}": typeof types.GetBackstageArtistDocument,
    "query GetBackstageGenres {\n  backstageGenres {\n    id\n    name\n    slug\n    status\n  }\n}": typeof types.GetBackstageGenresDocument,
    "\n          query GetGenre($id: String!) {\n            backstageGenre(id: $id) {\n              id\n              name\n              slug\n            }\n          }\n        ": typeof types.GetGenreDocument,
    "\n          mutation UpdateGenre($id: String!, $genre: UpdateGenreInput!) {\n            updateGenre(id: $id, genre: $genre) {\n              id\n              name\n              slug\n            }\n          }\n        ": typeof types.UpdateGenreDocument,
};
const documents: Documents = {
    "query GetBackstageArtist {\n  backstageArtists {\n    id\n    name\n    status\n    mediaStatus\n    artwork {\n      url\n    }\n  }\n}": types.GetBackstageArtistDocument,
    "query GetBackstageGenres {\n  backstageGenres {\n    id\n    name\n    slug\n    status\n  }\n}": types.GetBackstageGenresDocument,
    "\n          query GetGenre($id: String!) {\n            backstageGenre(id: $id) {\n              id\n              name\n              slug\n            }\n          }\n        ": types.GetGenreDocument,
    "\n          mutation UpdateGenre($id: String!, $genre: UpdateGenreInput!) {\n            updateGenre(id: $id, genre: $genre) {\n              id\n              name\n              slug\n            }\n          }\n        ": types.UpdateGenreDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetBackstageArtist {\n  backstageArtists {\n    id\n    name\n    status\n    mediaStatus\n    artwork {\n      url\n    }\n  }\n}"): (typeof documents)["query GetBackstageArtist {\n  backstageArtists {\n    id\n    name\n    status\n    mediaStatus\n    artwork {\n      url\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetBackstageGenres {\n  backstageGenres {\n    id\n    name\n    slug\n    status\n  }\n}"): (typeof documents)["query GetBackstageGenres {\n  backstageGenres {\n    id\n    name\n    slug\n    status\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n          query GetGenre($id: String!) {\n            backstageGenre(id: $id) {\n              id\n              name\n              slug\n            }\n          }\n        "): (typeof documents)["\n          query GetGenre($id: String!) {\n            backstageGenre(id: $id) {\n              id\n              name\n              slug\n            }\n          }\n        "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n          mutation UpdateGenre($id: String!, $genre: UpdateGenreInput!) {\n            updateGenre(id: $id, genre: $genre) {\n              id\n              name\n              slug\n            }\n          }\n        "): (typeof documents)["\n          mutation UpdateGenre($id: String!, $genre: UpdateGenreInput!) {\n            updateGenre(id: $id, genre: $genre) {\n              id\n              name\n              slug\n            }\n          }\n        "];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;
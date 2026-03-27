/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
};

export type Artwork = {
  __typename?: 'Artwork';
  /** The dominant color of the artwork */
  dominantColor: Scalars['String']['output'];
  /** The template URL with {size} placeholder; use preset names (small, medium, large) */
  url: Scalars['String']['output'];
};

export type BackstageArtist = {
  __typename?: 'BackstageArtist';
  artwork?: Maybe<Artwork>;
  createdAt: Scalars['DateTime']['output'];
  createdBy: Scalars['String']['output'];
  genres?: Maybe<Array<BackstageGenre>>;
  id: Scalars['ID']['output'];
  mediaStatus?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  status: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  updatedBy: Scalars['String']['output'];
  verified: Scalars['Boolean']['output'];
};

export type BackstageGenre = {
  __typename?: 'BackstageGenre';
  createdAt: Scalars['DateTime']['output'];
  createdBy: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  slug: Scalars['String']['output'];
  status: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  updatedBy: Scalars['String']['output'];
};

export type CreateArtistInput = {
  genres: Array<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  verified: Scalars['Boolean']['input'];
};

export type CreateGenreInput = {
  name: Scalars['String']['input'];
  slug: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createArtist: BackstageArtist;
  createGenre: BackstageGenre;
  generateArtistArtworkUploadToken: UploadToken;
  updateArtist: BackstageArtist;
  updateGenre: BackstageGenre;
};


export type MutationCreateArtistArgs = {
  artist: CreateArtistInput;
};


export type MutationCreateGenreArgs = {
  genre: CreateGenreInput;
};


export type MutationGenerateArtistArtworkUploadTokenArgs = {
  id: Scalars['String']['input'];
};


export type MutationUpdateArtistArgs = {
  artist: UpdateArtistInput;
  id: Scalars['String']['input'];
};


export type MutationUpdateGenreArgs = {
  genre: UpdateGenreInput;
  id: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  backstageArtist: BackstageArtist;
  backstageArtists: Array<BackstageArtist>;
  backstageGenre: BackstageGenre;
  backstageGenres: Array<BackstageGenre>;
};


export type QueryBackstageArtistArgs = {
  id: Scalars['String']['input'];
};


export type QueryBackstageArtistsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryBackstageGenreArgs = {
  id: Scalars['String']['input'];
};


export type QueryBackstageGenresArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateArtistInput = {
  genres: Array<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  verified: Scalars['Boolean']['input'];
};

export type UpdateGenreInput = {
  name: Scalars['String']['input'];
  slug: Scalars['String']['input'];
};

export type UploadToken = {
  __typename?: 'UploadToken';
  uploadToken: Scalars['String']['output'];
};

export type GetBackstageArtistQueryVariables = Exact<{ [key: string]: never; }>;


export type GetBackstageArtistQuery = { __typename: 'Query', backstageArtists: Array<{ __typename: 'BackstageArtist', id: string, name: string, status: string, mediaStatus?: string | null, artwork?: { __typename: 'Artwork', url: string } | null }> };

export type GetBackstageGenresQueryVariables = Exact<{ [key: string]: never; }>;


export type GetBackstageGenresQuery = { __typename: 'Query', backstageGenres: Array<{ __typename: 'BackstageGenre', id: string, name: string, slug: string, status: string }> };

export type GetGenreQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetGenreQuery = { __typename: 'Query', backstageGenre: { __typename: 'BackstageGenre', id: string, name: string, slug: string } };

export type UpdateGenreMutationVariables = Exact<{
  id: Scalars['String']['input'];
  genre: UpdateGenreInput;
}>;


export type UpdateGenreMutation = { __typename: 'Mutation', updateGenre: { __typename: 'BackstageGenre', id: string, name: string, slug: string } };


export const GetBackstageArtistDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetBackstageArtist"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"backstageArtists"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"mediaStatus"}},{"kind":"Field","name":{"kind":"Name","value":"artwork"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]} as unknown as DocumentNode<GetBackstageArtistQuery, GetBackstageArtistQueryVariables>;
export const GetBackstageGenresDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetBackstageGenres"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"backstageGenres"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<GetBackstageGenresQuery, GetBackstageGenresQueryVariables>;
export const GetGenreDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetGenre"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"backstageGenre"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]} as unknown as DocumentNode<GetGenreQuery, GetGenreQueryVariables>;
export const UpdateGenreDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateGenre"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"genre"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateGenreInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"updateGenre"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"genre"},"value":{"kind":"Variable","name":{"kind":"Name","value":"genre"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]} as unknown as DocumentNode<UpdateGenreMutation, UpdateGenreMutationVariables>;
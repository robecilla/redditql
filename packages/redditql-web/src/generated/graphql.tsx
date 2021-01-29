import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  __typename?: 'Query';
  posts: PaginatedPosts;
  post?: Maybe<Post>;
  me?: Maybe<User>;
};


export type QueryPostsArgs = {
  cursor?: Maybe<Scalars['Int']>;
  limit: Scalars['Int'];
};


export type QueryPostArgs = {
  id: Scalars['ID'];
};

export type PaginatedPosts = {
  __typename?: 'PaginatedPosts';
  posts: Array<Post>;
  hasMore: Scalars['Boolean'];
};

export type Post = {
  __typename?: 'Post';
  id: Scalars['ID'];
  title: Scalars['String'];
  content: Scalars['String'];
  points: Scalars['Float'];
  updoots: Array<Updoot>;
  author: User;
  createdAt: Scalars['String'];
  contentExcerpt: Scalars['String'];
  vote?: Maybe<Scalars['Boolean']>;
};

export type Updoot = {
  __typename?: 'Updoot';
  vote: Scalars['Float'];
  userId: Scalars['ID'];
  user: User;
  postId: Scalars['ID'];
  post: Post;
  createdAt: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  username: Scalars['String'];
  email: Scalars['String'];
  posts: Array<Post>;
};

export type Mutation = {
  __typename?: 'Mutation';
  updoot: Scalars['Boolean'];
  downdoot: Scalars['Boolean'];
  createPost: Post;
  updatePost?: Maybe<Post>;
  deletePost: Scalars['Boolean'];
  changePassword: UserResponse;
  forgotPassword: Scalars['Boolean'];
  register: UserResponse;
  login: UserResponse;
  logout: Scalars['Boolean'];
};


export type MutationUpdootArgs = {
  postId: Scalars['Int'];
};


export type MutationDowndootArgs = {
  postId: Scalars['Int'];
};


export type MutationCreatePostArgs = {
  input: PostInput;
};


export type MutationUpdatePostArgs = {
  content: Scalars['String'];
  title: Scalars['String'];
  id: Scalars['Int'];
};


export type MutationDeletePostArgs = {
  id: Scalars['Int'];
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String'];
  token: Scalars['String'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationRegisterArgs = {
  options: UsernamePasswordInput;
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  usernameOrEmail: Scalars['String'];
};

export type PostInput = {
  title: Scalars['String'];
  content: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type UsernamePasswordInput = {
  email: Scalars['String'];
  username: Scalars['String'];
  password: Scalars['String'];
};

export type ErrorFragment = (
  { __typename?: 'FieldError' }
  & Pick<FieldError, 'field' | 'message'>
);

export type PostFragment = (
  { __typename?: 'Post' }
  & Pick<Post, 'id' | 'title' | 'content' | 'points' | 'vote' | 'createdAt'>
  & { author: (
    { __typename?: 'User' }
    & UserFragment
  ) }
);

export type PostChunkFragment = (
  { __typename?: 'Post' }
  & Pick<Post, 'id' | 'title' | 'createdAt' | 'contentExcerpt' | 'points' | 'vote'>
  & { author: (
    { __typename?: 'User' }
    & UserFragment
  ) }
);

export type UserFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'username'>
);

export type UserResponseFragment = (
  { __typename?: 'UserResponse' }
  & { user?: Maybe<(
    { __typename?: 'User' }
    & UserFragment
  )>, errors?: Maybe<Array<(
    { __typename?: 'FieldError' }
    & ErrorFragment
  )>> }
);

export type ChangePasswordMutationVariables = Exact<{
  token: Scalars['String'];
  newPassword: Scalars['String'];
}>;


export type ChangePasswordMutation = (
  { __typename?: 'Mutation' }
  & { changePassword: (
    { __typename?: 'UserResponse' }
    & UserResponseFragment
  ) }
);

export type CreatePostMutationVariables = Exact<{
  input: PostInput;
}>;


export type CreatePostMutation = (
  { __typename?: 'Mutation' }
  & { createPost: (
    { __typename?: 'Post' }
    & Pick<Post, 'id' | 'content'>
  ) }
);

export type DeletePostMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeletePostMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deletePost'>
);

export type DowndootMutationVariables = Exact<{
  postId: Scalars['Int'];
}>;


export type DowndootMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'downdoot'>
);

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'forgotPassword'>
);

export type LoginMutationVariables = Exact<{
  usernameOrEmail: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'UserResponse' }
    & UserResponseFragment
  ) }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type RegisterMutationVariables = Exact<{
  options: UsernamePasswordInput;
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { register: (
    { __typename?: 'UserResponse' }
    & UserResponseFragment
  ) }
);

export type UpdatePostMutationVariables = Exact<{
  id: Scalars['Int'];
  title: Scalars['String'];
  content: Scalars['String'];
}>;


export type UpdatePostMutation = (
  { __typename?: 'Mutation' }
  & { updatePost?: Maybe<(
    { __typename?: 'Post' }
    & PostFragment
  )> }
);

export type UpdootMutationVariables = Exact<{
  postId: Scalars['Int'];
}>;


export type UpdootMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'updoot'>
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & UserFragment
  )> }
);

export type PostQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type PostQuery = (
  { __typename?: 'Query' }
  & { post?: Maybe<(
    { __typename?: 'Post' }
    & PostFragment
  )> }
);

export type PostsQueryVariables = Exact<{
  limit: Scalars['Int'];
  cursor?: Maybe<Scalars['Int']>;
}>;


export type PostsQuery = (
  { __typename?: 'Query' }
  & { posts: (
    { __typename?: 'PaginatedPosts' }
    & Pick<PaginatedPosts, 'hasMore'>
    & { posts: Array<(
      { __typename?: 'Post' }
      & PostChunkFragment
    )> }
  ) }
);

export const UserFragmentDoc = gql`
    fragment User on User {
  id
  username
}
    `;
export const PostFragmentDoc = gql`
    fragment Post on Post {
  id
  title
  content
  author {
    ...User
  }
  points
  vote
  createdAt
}
    ${UserFragmentDoc}`;
export const PostChunkFragmentDoc = gql`
    fragment PostChunk on Post {
  id
  title
  createdAt
  contentExcerpt
  points
  vote
  author {
    ...User
  }
}
    ${UserFragmentDoc}`;
export const ErrorFragmentDoc = gql`
    fragment Error on FieldError {
  field
  message
}
    `;
export const UserResponseFragmentDoc = gql`
    fragment UserResponse on UserResponse {
  user {
    ...User
  }
  errors {
    ...Error
  }
}
    ${UserFragmentDoc}
${ErrorFragmentDoc}`;
export const ChangePasswordDocument = gql`
    mutation ChangePassword($token: String!, $newPassword: String!) {
  changePassword(token: $token, newPassword: $newPassword) {
    ...UserResponse
  }
}
    ${UserResponseFragmentDoc}`;

export function useChangePasswordMutation() {
  return Urql.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument);
};
export const CreatePostDocument = gql`
    mutation CreatePost($input: PostInput!) {
  createPost(input: $input) {
    id
    content
  }
}
    `;

export function useCreatePostMutation() {
  return Urql.useMutation<CreatePostMutation, CreatePostMutationVariables>(CreatePostDocument);
};
export const DeletePostDocument = gql`
    mutation DeletePost($id: Int!) {
  deletePost(id: $id)
}
    `;

export function useDeletePostMutation() {
  return Urql.useMutation<DeletePostMutation, DeletePostMutationVariables>(DeletePostDocument);
};
export const DowndootDocument = gql`
    mutation Downdoot($postId: Int!) {
  downdoot(postId: $postId)
}
    `;

export function useDowndootMutation() {
  return Urql.useMutation<DowndootMutation, DowndootMutationVariables>(DowndootDocument);
};
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email)
}
    `;

export function useForgotPasswordMutation() {
  return Urql.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument);
};
export const LoginDocument = gql`
    mutation Login($usernameOrEmail: String!, $password: String!) {
  login(usernameOrEmail: $usernameOrEmail, password: $password) {
    ...UserResponse
  }
}
    ${UserResponseFragmentDoc}`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const RegisterDocument = gql`
    mutation Register($options: UsernamePasswordInput!) {
  register(options: $options) {
    ...UserResponse
  }
}
    ${UserResponseFragmentDoc}`;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const UpdatePostDocument = gql`
    mutation UpdatePost($id: Int!, $title: String!, $content: String!) {
  updatePost(id: $id, title: $title, content: $content) {
    ...Post
  }
}
    ${PostFragmentDoc}`;

export function useUpdatePostMutation() {
  return Urql.useMutation<UpdatePostMutation, UpdatePostMutationVariables>(UpdatePostDocument);
};
export const UpdootDocument = gql`
    mutation Updoot($postId: Int!) {
  updoot(postId: $postId)
}
    `;

export function useUpdootMutation() {
  return Urql.useMutation<UpdootMutation, UpdootMutationVariables>(UpdootDocument);
};
export const MeDocument = gql`
    query Me {
  me {
    ...User
  }
}
    ${UserFragmentDoc}`;

export function useMeQuery(options: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
};
export const PostDocument = gql`
    query Post($id: ID!) {
  post(id: $id) {
    ...Post
  }
}
    ${PostFragmentDoc}`;

export function usePostQuery(options: Omit<Urql.UseQueryArgs<PostQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<PostQuery>({ query: PostDocument, ...options });
};
export const PostsDocument = gql`
    query Posts($limit: Int!, $cursor: Int) {
  posts(limit: $limit, cursor: $cursor) {
    hasMore
    posts {
      ...PostChunk
    }
  }
}
    ${PostChunkFragmentDoc}`;

export function usePostsQuery(options: Omit<Urql.UseQueryArgs<PostsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<PostsQuery>({ query: PostsDocument, ...options });
};
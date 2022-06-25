import { gql } from "@apollo/client";

export const ADD_POST = gql`
  mutation MyMutation(
    $body: String!
    $image: String!
    $subcapsule_id: ID!
    $title: String!
    $username: String!
  ) {
    insertPost(
      body: $body
      image: $image
      subcapsule_id: $subcapsule_id
      title: $title
      username: $username
    ) {
      body
      image
      subcapsule_id
      title
      id
      created_at
      username
    }
  }
`;

export const ADD_SUBCAPSULE = gql`
  mutation MyMutation($topic: String!) {
    insertSubcapsule(topic: $topic) {
      id
      topic
      created_at
    }
  }
`;

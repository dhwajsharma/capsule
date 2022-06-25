import { gql } from "@apollo/client";

export const GET_SUBCAPSULE_BY_TOPIC = gql`
  query MyQuery($topic: String!) {
    getSubcapsuleListByTopic(topic: $topic) {
      id
      topic
      created_at
    }
  }
`;

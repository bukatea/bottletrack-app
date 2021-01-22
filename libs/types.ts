import DynamoDB from 'aws-sdk/clients/dynamodb';
import { MandateProps } from './typeUtility';
import { GeolocationResponse } from '@react-native-community/geolocation';

type StringAttributeValue = MandateProps<Pick<DynamoDB.AttributeValue, 'S'>, 'S'>;
type NumberAttributeValue = MandateProps<Pick<DynamoDB.AttributeValue, 'N'>, 'N'>;
type BinaryAttributeValue = MandateProps<Pick<DynamoDB.AttributeValue, 'B'>, 'B'>;
type StringSetAttributeValue = MandateProps<Pick<DynamoDB.AttributeValue, 'SS'>, 'SS'>;
type NumberSetAttributeValue = MandateProps<Pick<DynamoDB.AttributeValue, 'NS'>, 'NS'>;
type BinarySetAttributeValue = MandateProps<Pick<DynamoDB.AttributeValue, 'BS'>, 'BS'>;
type MapAttributeValue = MandateProps<Pick<DynamoDB.AttributeValue, 'M'>, 'M'>;
type ListAttributeValue = MandateProps<Pick<DynamoDB.AttributeValue, 'L'>, 'L'>;
type NullAttributeValue = MandateProps<Pick<DynamoDB.AttributeValue, 'NULL'>, 'NULL'>;
type BooleanAttributeValue = MandateProps<Pick<DynamoDB.AttributeValue, 'BOOL'>, 'BOOL'>;

export interface BottleRequest {
  bottleName: string;
  BD_ADDR?: string;
  BD_UUID?: string;
  lastSeenLocation: GeolocationResponse;
}

export interface BottleResponse {
  userId: StringAttributeValue; // primary key
  bottleName: StringAttributeValue; // sort key
  createdAt: NumberAttributeValue;
  BD_ADDR?: StringAttributeValue;
  BD_UUID?: StringAttributeValue;
  lastSeenLocation: MapAttributeValue;
}

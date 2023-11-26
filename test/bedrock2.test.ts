import * as cdk from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import * as Bedrock2 from '../lib/bedrock2-stack';

test('Lambda and http api Created', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new Bedrock2.Bedrock2Stack(app, 'MyTestStack');
  // THEN

  const template = Template.fromStack(stack);

  // expect a lambda function
  expect(template.resourceCountIs('AWS::Lambda::Function', 1));

  // expect a http api
  expect(template.resourceCountIs('AWS::ApiGatewayV2::Api', 1));
});



import {
  Stack,
  StackProps,
  aws_lambda_nodejs,
  aws_lambda,
  aws_iam,
  Duration,
  CfnOutput
} from "aws-cdk-lib";
import { Construct } from "constructs";
import * as path from "path";
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import * as apigwv2 from '@aws-cdk/aws-apigatewayv2-alpha';

export class Bedrock2Stack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const bedrockLambda = new aws_lambda_nodejs.NodejsFunction(
      this,
      "BedrockLambdaHttp",
      {
        runtime: aws_lambda.Runtime.NODEJS_16_X,
        handler: "handler",
        entry: path.join(__dirname, "../src/lambda/bedrock/index.ts"),
        bundling: {
          forceDockerBundling: false,
        },
        timeout: Duration.seconds(90),
      }
    );

    bedrockLambda.addToRolePolicy(
      new aws_iam.PolicyStatement({
        actions: ["bedrock:InvokeModel"],
        resources: ["*"],
      })
    );

    // create an http api 
    const bedrockLambdaIntegration = new HttpLambdaIntegration('bedrockLmabdaIntegration', bedrockLambda);

    const httpApi = new apigwv2.HttpApi(this, 'HttpApi',);
    httpApi.addRoutes({
      path: '/bedrock',
      methods: [apigwv2.HttpMethod.POST],
      integration: bedrockLambdaIntegration
    });

    new CfnOutput(this, 'HttpApiUrl', {
      value: httpApi.url!,
    });
  }
}

import { APIGatewayProxyHandler } from 'aws-lambda';
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from '@aws-sdk/client-bedrock-runtime';

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    // Parse the HTTP request body
    const requestBody = JSON.parse(event.body as string);
    const { prompt } = requestBody;

    const client = new BedrockRuntimeClient({
        region: 'us-east-1',
    });

    const response: any = await client.send(
      new InvokeModelCommand({
        modelId: 'ai21.j2-mid-v1',
        contentType: 'application/json',
        accept: '*/*',
        body: JSON.stringify({
          prompt,
          maxTokens: 200,
          temperature: 0.7,
          topP: 1,
          stopSequences: [],
          countPenalty: { scale: 0 },
          presencePenalty: { scale: 0 },
          frequencyPenalty: { scale: 0 },
        }),
      })
    );

    const jsonString = Buffer.from(response.body).toString('utf8');
    const parsedDataText = JSON.parse(jsonString);

    // Return a successful HTTP response
    return {
      statusCode: 200,
      body: JSON.stringify({ response: parsedDataText.completions[0].data.text }),
    };
  } catch (err) {
    console.error(err);

    // Return an error HTTP response
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Something went wrong while invoking the model' }),
    };
  }
};

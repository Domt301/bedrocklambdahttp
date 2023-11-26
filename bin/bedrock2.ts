#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { Bedrock2Stack } from '../lib/bedrock2-stack';

const app = new cdk.App();
new Bedrock2Stack(app, 'Bedrock2Stack');

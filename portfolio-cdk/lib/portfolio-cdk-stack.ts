import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as origin from 'aws-cdk-lib/aws-cloudfront-origins';
import * as cfn from 'aws-cdk-lib/aws-cloudfront';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as iam from 'aws-cdk-lib/aws-iam';

export class PortfolioCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // https://aws.amazon.com/jp/premiumsupport/knowledge-center/cloudfront-serve-static-website/
    const refererValue = 'd279d248-1a92-4f1c-a71f-a95991c95faf';

    // S3 Web Hosting
    const bucket = new s3.Bucket(this, "bucket", {
      websiteIndexDocument: 'index.html',
      publicReadAccess: true,
    });
    // Refererに期待通りの値がなければアクセスを拒絶する
    bucket.addToResourcePolicy(new iam.PolicyStatement({
      effect: iam.Effect.DENY,
      actions: ['s3:GetObject'],
      principals: [new iam.ArnPrincipal('*')],
      resources: [bucket.bucketArn + '/*'],
      conditions: {
        StringNotLike: {
          'aws:Referer': refererValue,
        }
      },
    }));

    const cdn = new cfn.Distribution(this, "cdn", {
      // 価格クラスは200から日本を含むようになる
      priceClass: cfn.PriceClass.PRICE_CLASS_200,

      defaultBehavior: {
        // S3 Web Hosting Endpoint をオリジンとしたいので、S3Origin ではなく、HttpOrigin を使う。
        origin: new origin.HttpOrigin(bucket.bucketWebsiteDomainName, {
          customHeaders: {Referer: refererValue},
          protocolPolicy: cfn.OriginProtocolPolicy.HTTP_ONLY,
        }),
        viewerProtocolPolicy: cfn.ViewerProtocolPolicy.HTTPS_ONLY,
        // リダイレクト用の CloudFront Functions
        functionAssociations: [{
          eventType: cfn.FunctionEventType.VIEWER_REQUEST,
          function: new cfn.Function(this, "func", {
            code: cfn.FunctionCode.fromFile({
              filePath: './lib/redirect.js',
            }),
          })
        }],
      },
    });

    // Nuxt3アプリケーションの資材はCDKデプロイ実行前に
    // npm run generate で生成済みである前提
    new deploy.BucketDeployment(this, "deploy", {
      sources: [deploy.Source.asset('../portfolio-app/.output/public')],
      destinationBucket: bucket,
      // distribution属性を指定すると、
      // デプロイ後にキャッシュをクリアしてくれる
      distribution: cdn,
    });

    new cdk.CfnOutput(this, "endpoint", {
      value: `https://${cdn.distributionDomainName}`
    });
  }
}

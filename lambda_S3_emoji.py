import boto3
import json
import base64

s3 = boto3.client('s3')

def lambda_handler(event, context):
    print("Received event: " + json.dumps(event, indent=2))
    
    image = base64.b64decode(event['body'])

    bucket = 'rekognition-emoji'
    key = event['queryStringParameters']['filename']

    s3.put_object(Bucket=bucket, Key=key, Body=image)
    
    response = rekognition.detect_labels(
        Image={
            'S3Object': {
                'Bucket': bucket,
                'Name': key
            }
        },
        MaxLabels=10
    )


    return {
        'statusCode': 200,
        'body': json.dumps('Image uploaded successfully!')
    }
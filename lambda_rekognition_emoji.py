import boto3
import json
import base64

s3 = boto3.client('s3')
rekognition = boto3.client('rekognition')

def lambda_handler(event, context):
    print("Received event: " + json.dumps(event, indent=2))
    

    image = base64.b64decode(event['file'])

    bucket = 'rekognition-emoji'
    key = event['name'] + '.jpg'

    s3.put_object(Bucket=bucket, Key=key, Body=image)
    
    response = rekognition.detect_faces(
        Image={
            'S3Object': {
                'Bucket': bucket,
                'Name': key
            }
        },
        Attributes=['ALL']
    )

    emotions = response['FaceDetails'][0]['Emotions'][0]['Type']

    emoji = {'HAPPY': '(＊゜ー゜)b', 'SAD': '(´;ω;`)', 'ANGRY': '(／‵Д′)／~ ╧╧'
             , 'CONFUSED': '( ╹ -╹)?', 'DISGUSTED': '(·•᷄‎ࡇ•᷅ )', 'SURPRISED': 'Σ(;ﾟдﾟ)', 'CALM': '(*ᵕᴗᵕ)⁾⁾', 'UNKNOWN': '🤔', 'FEAR': '( ﾟдﾟ)'}

    return {
        'statusCode': 200,
        'body': json.dumps(emoji[emotions]),
        'emotion': emotions
    }
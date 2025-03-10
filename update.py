import boto3
import zipfile
import os

#update html file
s3 = boto3.client('s3')
bucket = 'testweb888'
file = 'index.zip'
filedir = ['index.html', 'index.css', 'index.js', 'images/']

with zipfile.ZipFile(file, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for f in filedir:
        if os.path.isfile(f):
            zipf.write(f)
        else:
            for root, dirs, files in os.walk(f):
                for filename in files:
                    zipf.write(os.path.join(root, filename))

object_path = 'index.zip'

s3.upload_file(file, bucket, object_path)



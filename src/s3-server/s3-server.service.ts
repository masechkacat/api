import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class S3ServerService {
  private s3: AWS.S3;

  constructor(private config: ConfigService) {
    this.s3 = new AWS.S3({
      accessKeyId: this.config.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.config.get('AWS_SECRET_ACCESS_KEY'),
      region: this.config.get('AWS_REGION'),
    });
  }

  async uploadFile(file: Express.Multer.File) {
    const date = new Date();
    const timestamp = date.getTime();

    const params = {
      Bucket: this.config.get('AWS_BUCKET_NAME'),
      Key: `${timestamp}-${file.originalname}`,
      Body: file.buffer,
    };

    const uploadResult = await this.s3.upload(params).promise();

    return uploadResult.Location;
  }

  async deleteFile(fileUrl: string) {
    const fileKey = fileUrl.split('/').pop();

    await this.s3.deleteObject({
      Bucket: this.config.get('AWS_BUCKET_NAME'),
      Key: fileKey,
    }).promise();
  }

  async uploadFiles(files: Express.Multer.File[]) {
    const uploadPromises = files.map(file => this.uploadFile(file));
    const uploadResults = await Promise.all(uploadPromises);
    return uploadResults;
  }
}
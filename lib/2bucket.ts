import fs from "fs";
import path from "path";
import FormData from "form-data";
import axios from "axios";
import { type UploadedFile } from "express-fileupload";

export interface UploadOptions {
  folder?: string; // (ex: "companies/123")
  rename?: string;
  bucket_id?: string; // opcional, se quiser enviar pra outro bucket
}

export interface UploadResult {
  url: string;
  path: string;
  bucket_id: string;
  original_name: string;
  size?: number;
  mime_type?: string;
}

export default class TwoBucketService {
  private server: string;
  private bucket_id: string;
  private api_version: string;

  constructor(server: string, api_version: string, bucket_id: string) {
    if (!bucket_id) throw new Error("2BUCKET_ID not defined in .env");
    this.server = server;
    this.api_version = api_version;
    this.bucket_id = bucket_id;
  }

  /**
   * Upload de arquivo para o serviço 2Bucket.
   * Aceita qualquer arquivo (UploadedFile, Buffer, ou path local).
   */
  public async upload_file(
    file: UploadedFile | Buffer | string,
    options: UploadOptions = {},
  ): Promise<UploadResult> {
    try {
      const { folder, rename, bucket_id } = options;
      const final_bucket = bucket_id || this.bucket_id;

      let filename = rename;
      let file_buffer: Buffer;
      let mime_type = "application/octet-stream";
      let original_name = "";

      if (typeof file === "string") {
        original_name = path.basename(file);
        filename = filename || original_name;
        file_buffer = fs.readFileSync(file);
      } else if (file instanceof Buffer) {
        original_name = rename || "unnamed_file";
        filename = filename || original_name;
        file_buffer = file;
      } else {
        original_name = file.name;
        filename = filename || original_name;
        file_buffer = file.data;
        mime_type = file.mimetype;
      }

      const target_folder = folder || "misc";
      const target_path = `${target_folder}/${filename}`;

      const form_data = new FormData();
      form_data.append("bucket_id", final_bucket);
      form_data.append("folder", target_folder);
      form_data.append("file", file_buffer, filename);
      if (rename) form_data.append("rename", rename);

      const url = `${this.server}${this.api_version}/api/2bucket/file/upload`;
      const res = await axios.post(url, form_data, {
        headers: {
          ...form_data.getHeaders(),
          Authorization: `Bearer ${process.env.BUCKET_TOKEN ?? ""}`,
        },
      });

      if (res.status !== 201) {
        throw new Error(`2Bucket upload failed: ${res.statusText}`);
      }

      const file_url = `${this.server}${this.api_version}/api/2bucket/file/${final_bucket}?path=${encodeURIComponent(target_path)}`;

      return {
        url: file_url,
        path: target_path,
        bucket_id: final_bucket,
        original_name,
        size: file_buffer.length,
        mime_type,
      };
    } catch (err) {
      console.error("TwoBucketService.upload_file error:", err);
      throw err;
    }
  }
}

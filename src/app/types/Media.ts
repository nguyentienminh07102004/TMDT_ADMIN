export interface FileUploadRequest {
  file: File;
}

export interface Media {
  id: string;
  name: string;
  url: string;
  contentType: string;
  size: number;
  fileKey: string;
  status: boolean;
}
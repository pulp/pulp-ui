import { PulpAPI } from './pulp';

interface UploadProps {
  file: File;
  // Takes pulp_href for repository
  repository: string;
  // Takes pulp_href for collection
  signed_collection: string;
}

const base = new PulpAPI();
base.apiPath = 'content/ansible/collection_signatures/';

export const CertificateUploadAPI = {
  // Returns /pulp/api/v3/tasks/0be64cb4-3b7e-4a6b-b35d-c3b589923a90/
  upload: (data: UploadProps): Promise<{ data: { task: string } }> => {
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('repository', data.repository);
    formData.append('signed_collection', data.signed_collection);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    return base.http.post(base.apiPath, formData, config);
  },
};

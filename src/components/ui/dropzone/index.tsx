import { Accept } from 'react-dropzone';
import {
  Dropzone as DropzoneRoot,
  DropzoneDescription,
  DropzoneGroup,
  DropzoneInput,
  DropzoneTitle,
  DropzoneUploadIcon,
  DropzoneZone,
} from './dropzone';
import {
  FileList,
  FileListAction,
  FileListActions,
  FileListDescription,
  FileListHeader,
  FileListIcon,
  FileListInfo,
  FileListItem,
  FileListName,
  FileListSize,
} from '@/components/ui/file-list';
import { Trash2 } from 'lucide-react';

type DropzoneProps = {
  file?: File;
  setFile: (file: File | undefined) => void;
  accept?: Accept;
}

const defaultAccept = {
  'image/*': ['.jpg', '.jpeg', '.png', '.webp'],
};

export const Dropzone = ({
  file,
  setFile,
  accept = defaultAccept,
}: DropzoneProps) => {
  return (
    <DropzoneRoot
      accept={accept}
      onDropAccepted={file => setFile(file[0])}
      maxSize={5 * 1024 * 1024} //5MB
    >
      <div className='flex flex-col gap-4'>
        <DropzoneZone>
          <DropzoneInput />
          <DropzoneGroup className='gap-4'>
            <DropzoneUploadIcon />
            <DropzoneGroup>
              <DropzoneTitle>Solte seu arquivo aqui ou clique para fazer upload</DropzoneTitle>
              <DropzoneDescription>
                Você pode enviar arquivos de imagem (jpg, jpeg, png, webp) com tamanho máximo de 5MB.
              </DropzoneDescription>
            </DropzoneGroup>
          </DropzoneGroup>
        </DropzoneZone>

        {file && (
          <FileList>
            <FileListItem>
              <FileListHeader>
                <FileListIcon />
                <FileListInfo>
                  <FileListName>{file.name}</FileListName>
                  <FileListDescription>
                    <FileListSize>{file.size}</FileListSize>
                  </FileListDescription>
                </FileListInfo>
                <FileListActions>
                  <FileListAction onClick={() => setFile(undefined)}>
                    <Trash2 />
                  </FileListAction>
                </FileListActions>
              </FileListHeader>
            </FileListItem>
          </FileList>
        )}
      </div>
    </DropzoneRoot>
  );
};